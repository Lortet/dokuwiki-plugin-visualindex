<?php
/**
 * Plugin visualindex
 * Affiche les pages d'un namespace donné
 * Auteur: Choimetg, Lortetv
 */

use dokuwiki\Extension\SyntaxPlugin;
use dokuwiki\File\PageResolver;
use dokuwiki\Ui\Index;

class syntax_plugin_visualindex_visualindex extends SyntaxPlugin {
    /** @var helper_plugin_pagesicon|null|false */
    private $pagesiconHelper = false;

	private function getMediaLinkTargetAttr() {
		global $conf;
		$target = (string)($conf['target']['media'] ?? '');
		if($target === '') return '';
		return ' target="' . hsc($target) . '"';
	}

    private function renderInfoMessage(Doku_Renderer $renderer, $langKey) {
        $message = $this->getLang($langKey);
        if(!$message) {
            $message = 'Nothing to display.';
        }
        $renderer->doc .= '<div class="visualindex_info">' . hsc($message) . '</div>';
    }

    public function getType() {
        return 'substition'; // substition = remplacer la balise par du contenu (orthographe figée dans l'API DokuWiki)
    }

    public function getPType() {
        return 'block';
    }

    public function getSort() { // priorité du plugin par rapport à d'autres
        return 10;
    }

    /**
	 * Reconnaît la syntaxe {{visualindex>[namespace]}}
     */
    public function connectTo($mode) { // reconnait la syntaxe utilisé par l'utilisateur
        $this->Lexer->addSpecialPattern('{{visualindex>.*?}}', $mode, 'plugin_visualindex_visualindex');
    }

    /**
     * Nettoie  {{visualindex>[namespace]}}
     */
    public function handle($match, $state, $pos, Doku_Handler $handler) {
		$paramsString = trim(substr($match, 14, -2));
		$params = explode(';', $paramsString);
    	$namespace = trim(array_shift($params));

		$result = ['namespace' => $namespace];

		foreach ($params as $param) {
			$param = trim($param);
			$paramParts = explode('=', $param, 2);
			$paramName = $paramParts[0];
			$paramValue = isset($paramParts[1])? $paramParts[1] : true;
			$result[$paramName] = $paramValue;
		}

		return $result;
	}

	private function getCurrentNamespace($ID, $getMedias = false) {
		if(!is_dir($this->namespaceDir($ID, $getMedias))) {
			$pageNamespaceInfo = $this->getNamespaceInfo($ID);
			if($this->isHomepage($pageNamespaceInfo['pageID'], $pageNamespaceInfo['parentID'])) {
				return $pageNamespaceInfo['parentNamespace'];
			}
		}

		return $ID;
	}

    public function render($mode, Doku_Renderer $renderer, $data) {
		if($mode !== 'xhtml' && $mode !== 'wikiedit') return false;

		global $ID;

		$getMedias = isset($data['medias']) && $data['medias'] || false;
		$filter = isset($data['filter'])? $data['filter'] : null;
		$desc = isset($data['desc']) && $data['desc'] || false;

		if($data['namespace'] === '.') { // Récupération du namespace courant
			$namespace = $this->getCurrentNamespace($ID, $getMedias);
		}
		elseif(strpos($data['namespace'], '~') === 0) {
			$relativeNamespace = cleanID(ltrim($data['namespace'], '~'));
			$currentNamespace = $this->getCurrentNamespace($ID, $getMedias);
        	$namespace = $currentNamespace . ':' . $relativeNamespace;
		}
		else {
			$namespace = cleanID($data['namespace']);
		}

		$items = $this->getItemsAndSubfoldersItems($namespace, $getMedias, $filter, $desc);
		if($items === false) {
			$this->renderInfoMessage($renderer, 'namespace_not_found');
			return true;
		}
		if(empty($items)) {
			$this->renderInfoMessage($renderer, 'empty');
			return true;
		}

		// Tri stable : homepages en premier, ordre de scan préservé pour les égaux
		$idx = 0;
		foreach ($items as &$item) { $item['_idx'] = $idx++; }
		unset($item);
		usort($items, function($a, $b) {
			$diff = $b['sortID'] - $a['sortID'];
			return $diff !== 0 ? $diff : ($a['_idx'] - $b['_idx']);
		});

		$tileWidth = $this->getConf('tile_width');
		$iconSize  = $this->getConf('icon_size');
		$textSize  = $this->getConf('text_size');
		$textColor = $this->getConf('text_color');

		// Styles inline dérivés de la configuration
		$tileStyle = 'width:' . hsc($tileWidth) . ';';
		$imgStyle  = 'max-width:' . hsc($iconSize) . ';max-height:' . hsc($iconSize) . ';';

		// -----------------------------
		// ProseMirror / HTML wrapper
		// -----------------------------
		$renderer->doc .= '<span class="plugin_visualindex" '
			.'data-namespace="'.htmlspecialchars($namespace).'" '
			.'data-filter="'.htmlspecialchars($filter).'" '
			.'data-desc="'.($desc ? '1' : '0').'">';

		// -----------------------------
		// HTML classique pour le rendu visuel
		// -----------------------------
		$renderer->doc .= '<div class="visualindex">';

		$renderedItems = 0;
		foreach ($items as $item) {
			$pageID        = $item['pageID'];
			$itemNamespace = $item['namespace'];
			$pageNamespace = $item['pageNamespace'];
			$isHomepage    = $item['isHomepage'];

			if($pageNamespace == $ID) {
				continue;
			}

			$permission = auth_quickaclcheck($pageNamespace);
			if($permission < AUTH_READ) {
				continue;
			}

			$logoUrl = null;
			if(!$getMedias) {
				$title = p_get_first_heading($pageNamespace);
				if(empty($title)) {
					continue;
				}
			}
			else {
				$title = str_replace('_', ' ', $pageID);
				$logoUrl = $this->getMediaItemImage($pageNamespace);
			}

			if(!$logoUrl) {
				$logoUrl = $this->getPageImage($itemNamespace, $pageID);
			}

			// Afficher le lien de la page ou du sous-dossier
			$targetAttr = $getMedias ? $this->getMediaLinkTargetAttr() : '';
			$renderer->doc .= '<a class="vi_tile' . ($isHomepage? ' homepage' : '') . '" style="' . $tileStyle . 'color:' . $textColor . ';font-size:' . $textSize . '" href="'. ($getMedias? ml($pageNamespace) : wl($pageNamespace)) . '"' . $targetAttr . '>';
				$renderer->doc .= '<div class="vi_content"><img loading="lazy" src="' . $logoUrl . '" style="' . $imgStyle . '" alt="" /><br />' . $title . '</div>';
				$renderer->doc .= '<div class="vi_vertical_align"></div>';
			$renderer->doc .= '</a>';
			$renderedItems++;
		}

		$renderer->doc .= '</div>';

		if($renderedItems === 0) {
			$this->renderInfoMessage($renderer, 'empty');
		}

		$renderer->doc .= '</span>';
		// -----------------------------
		// Fin du node ProseMirror
		// -----------------------------

		return true;
	}

	private function getPagesiconHelper() {
		if($this->pagesiconHelper === false) {
			$this->pagesiconHelper = plugin_load('helper', 'pagesicon');
		}
		return $this->pagesiconHelper ?: null;
	}

	private function getDefaultImageUrl() {
		$defaultImage = cleanID((string)$this->getConf('default_image'));
		if($defaultImage !== '' && @file_exists(mediaFN($defaultImage))) {
			return ml($defaultImage, ['width' => 55]);
		}

		return '/lib/plugins/visualindex/images/default_image.png';
	}

	private function getMediaItemImage($mediaID) {
		$mediaID = cleanID((string)$mediaID);
		if($mediaID === '') {
			return $this->getDefaultImageUrl();
		}

		$helper = $this->getPagesiconHelper();
		if((bool)$this->getConf('use_pagesicon') && $helper) {
			if(method_exists($helper, 'getMediaIconUrl')) {
				$mtime = null;
				$iconUrl = $helper->getMediaIconUrl($mediaID, 'bigorsmall', ['width' => 55], $mtime, false);
				if($iconUrl) return $iconUrl;
			} else if(method_exists($helper, 'getMediaIcon')) {
				$mtime = null;
				$withDefaultSupported = false;
				try {
					$method = new ReflectionMethod($helper, 'getMediaIcon');
					$withDefaultSupported = $method->getNumberOfParameters() >= 5;
				} catch (ReflectionException $e) {
					$withDefaultSupported = false;
				}

				if($withDefaultSupported) {
					$iconUrl = $helper->getMediaIcon($mediaID, 'bigorsmall', ['width' => 55], $mtime, false);
				} else {
					$iconUrl = $helper->getMediaIcon($mediaID, 'bigorsmall', ['width' => 55], $mtime);
				}
				if($iconUrl) return $iconUrl;
			}
		}

		$childPathInfo = pathinfo(noNS($mediaID));
		$imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
		if(isset($childPathInfo['extension']) && in_array(strtolower((string)$childPathInfo['extension']), $imageExtensions, true)) {
			return ml($mediaID);
		}

		return $this->getDefaultImageUrl();
	}

	/**
	 * Renvoie l'URL de l'icone de la page via pagesicon, sinon image par defaut.
	 */
	private function getPageImage($namespace, $pageID = null) {
		if(!$pageID) {
			$pageNamespaceInfo = $this->getNamespaceInfo($namespace);
			$namespace = $pageNamespaceInfo['parentNamespace'];
			$pageID = $pageNamespaceInfo['pageID'];
		}

		$helper = $this->getPagesiconHelper();
		if((bool)$this->getConf('use_pagesicon') && $helper) {
			if(method_exists($helper, 'getPageIconUrl')) {
				$mtime = null;
				$iconUrl = $helper->getPageIconUrl((string)$namespace, (string)$pageID, 'bigorsmall', ['width' => 55], $mtime, false);
				if($iconUrl) return $iconUrl;
			} else if(method_exists($helper, 'getImageIcon')) {
				$mtime = null;
				$withDefaultSupported = false;
				try {
					$method = new ReflectionMethod($helper, 'getImageIcon');
					$withDefaultSupported = $method->getNumberOfParameters() >= 6;
				} catch (ReflectionException $e) {
					$withDefaultSupported = false;
				}

				if($withDefaultSupported) {
					$iconUrl = $helper->getImageIcon((string)$namespace, (string)$pageID, 'bigorsmall', ['width' => 55], $mtime, false);
				} else {
					$iconUrl = $helper->getImageIcon((string)$namespace, (string)$pageID, 'bigorsmall', ['width' => 55], $mtime);
				}
				if($iconUrl) return $iconUrl;
			}
		}

		return $this->getDefaultImageUrl();
	}


	private function createListItem($parentNamespace, $pageID, $isHomepage = false) {
		return array(
			'pageID' => $pageID,
			'namespace' => $parentNamespace,
			'pageNamespace' => cleanID("$parentNamespace:$pageID"),
			'sortID' => ($isHomepage? 100 : 0),
			'isHomepage' => $isHomepage
		);
	}

	/**
	 * Récupère à la fois les pages et les sous-dossiers d'un namespace
	 */
	private function getItemsAndSubfoldersItems($namespace, $getMedias = false, $filter = null, $desc = false) {
		global $conf;

		$childrens = @scandir($this->namespaceDir($namespace, $getMedias), $desc? SCANDIR_SORT_DESCENDING : SCANDIR_SORT_ASCENDING);
		if($childrens === false) {
			if($getMedias) {
				$childrens = @scandir($this->namespaceDir($namespace));
				if($childrens != false) {
					return [];
				}
			}

			return false;
		}

		$start = $conf['start']; // page d'accueil du namespace

		$finalPattern = null;
		if($filter) {
			$parts = explode('|', $filter);
			$regexParts = [];
			foreach ($parts as $part) {
				$pattern = preg_quote($part, '/');
				$pattern = str_replace('\*', '.*', $pattern);
				$regexParts[] = '^' . $pattern . '$';
			}

			$finalPattern = '/(' . implode('|', $regexParts) . ')/i';
		}

		$items = [];
		foreach($childrens as $child) {
			if($child[0] == '.' ) {
				continue;
			}

			if($finalPattern && !preg_match($finalPattern, $child)) {
				continue;
			}

			$childPathInfo = pathinfo($child);
			$childID = cleanID($childPathInfo['filename']);
			$childNamespace = cleanID("$namespace:$childID");

			$childHasExtension = isset($childPathInfo['extension']) && $childPathInfo['extension'] !== '';
			$isDirNamespace = is_dir($this->namespaceDir($childNamespace, $getMedias));
			$isPageNamespace = page_exists($childNamespace);

			if($getMedias) {
				if($childHasExtension) {
					$items[] = $this->createListItem($namespace, $child);
				}
				continue;
			}

			if(!$childHasExtension && $isDirNamespace) { // Si dossier
				if(page_exists("$childNamespace:$start")) { // S'il y a une page d'accueil
					$items[] = $this->createListItem($childNamespace, $start);
				}
				else if(page_exists("$childNamespace:$childID")) { // S'il y a une page du même nom que le dossier dans le dossier
					$items[] = $this->createListItem($childNamespace, $childID);
				}
				else if($isPageNamespace) { // S'il y a une page du même nom que le dossier au même niveau que le dossier
					$items[] = $this->createListItem($namespace, $childID);
				}

				continue;
			}

			if(!$isDirNamespace && $isPageNamespace) {
				$skipRegex = $this->getConf('skip_file');
				if (!empty($skipRegex) && preg_match($skipRegex, $childNamespace)) {
					continue;
				}

				$isHomepage = false;
				$pageNamespaceInfo = $this->getNamespaceInfo("$namespace:$childID");
				if($this->isHomepage($childID, $pageNamespaceInfo['parentID'])) {
					$isHomepage = true;
				}

				$items[] = $this->createListItem($namespace, $childID, $isHomepage);
			}
		}

		return $items;
	}

	private function isHomepage($pageID, $parentID) {
		global $conf;
		$startPageID = $conf['start'];

		return $pageID == $startPageID || $pageID == $parentID;
	}

	private function namespaceDir($namespace, $getMedias = false) {
		global $conf;

		// Choix du dossier selon le mode
		$baseDir = $getMedias ? $conf['mediadir'] : $conf['datadir'];

		// Remplacement des deux-points par des slashs et encodage UTF-8
		return $baseDir . '/' . utf8_encodeFN(str_replace(':', '/', $namespace));
	}

	private function getNamespaceInfo($namespace) {
		$namespaces = explode(':', $namespace);

		return array(
			'pageNamespace' => $namespace,
			'pageID' => array_pop($namespaces),
			'parentNamespace' => implode(':', $namespaces),
			'parentID' => array_pop($namespaces)
		);
	}
}

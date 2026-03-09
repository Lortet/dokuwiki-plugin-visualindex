<?php

/**
 *Configuration par défaut du plugin
 */
$meta['taille_icone'] = array('string', '_pattern' => '/^\d+(px|em|vh|cm)$/');
$meta['taille_texte'] = array('string', '_pattern' => '/^\d+(px|em|vh|cm)$/');
$meta['couleur_texte'] = array('string', '_pattern' => '/^(#([a-fA-F0-9]{3}|[a-fA-F0-9]{6})|rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}(\s*,\s*(0|0?\.\d+|1))?\s*\)|red|blue|green|black|white|yellow|cyan|magenta|gray|grey|purple|orange|pink|brown|lime|navy|teal|olive|maroon|aqua|silver|fuchsia)$/i');
$meta['skip_file']     = array('string', '_pattern' => '/^($|\/.*\/.*$)/');
$meta['show_in_editor_menu'] = array('onoff');
$meta['use_pagesicon'] = array('onoff');
$meta['default_image'] = array('string');
// $meta['id_image_erreur'] = array('string', '_pattern' => '/^.*\.(png|jpg|jpeg)$/i');

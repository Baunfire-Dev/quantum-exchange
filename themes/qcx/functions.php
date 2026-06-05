<?php

/**
 * qcx functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package qcx
 */

// Ensure this file is being accessed within WordPress
if (!defined('ABSPATH')) {
    exit;
}

require_once 'vendor/autoload.php';
Timber\Timber::init();

define('_S_VERSION', '20260606-8c23185');

if (!function_exists('bf_stup')):
    function bf_setup()
    {
        add_theme_support('align-wide');
        add_theme_support('title-tag');
        add_theme_support('post-thumbnails');

        add_theme_support('editor-styles');
        add_editor_style([
            'assets/css/admin/block-editor.css',
            'assets/css/admin/editor-style.css',
            'assets/css/admin/editor-typography.css',
        ]);
    }
endif;

add_action('after_setup_theme', 'bf_setup');

require_once 'includes/theme/allow-file-types.php';
require_once 'includes/theme/disable-comments.php';

require_once 'includes/theme/setup-shortcodes.php';

require_once 'includes/theme/support-helpers.php';
require_once 'includes/theme/support-visual-overrides.php';

require_once 'includes/theme/support-videos.php';
require_once 'includes/theme/support-transients.php';

require_once 'includes/theme/disable-native-blocks.php';
require_once 'includes/theme/support-cpt.php';

require_once 'includes/theme/support-search.php';

require_once 'includes/theme/setup-enqueue.php';
require_once 'includes/theme/setup-acf.php';
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

define('_ENV', 'development');

if (!defined('_S_VERSION')) {
    if (_ENV == 'development')
        define('_S_VERSION', uniqid());
    else
        define('_S_VERSION', '1.0.0');
}

if (!function_exists('bf_setup')):
    function bf_setup()
    {
        add_theme_support('align-wide');
        add_theme_support('title-tag');
        add_theme_support('post-thumbnails');
    }
endif;

add_action('after_setup_theme', 'bf_setup');

require_once 'includes/theme/allow-file-types.php';
require_once 'includes/theme/disable-comments.php';

// require_once 'includes/theme/setup-timber.php';
require_once 'includes/theme/setup-shortcodes.php';

require_once 'includes/theme/support-helpers.php';
require_once 'includes/theme/support-visual-overrides.php';

require_once 'includes/theme/support-videos.php';
require_once 'includes/theme/support-transients.php';
// require_once 'includes/theme/support-block-templates.php';


require_once 'includes/theme/disable-native-blocks.php';
require_once 'includes/theme/support-cpt.php';
















/******************** LOAD CSS/JS ************************/
add_action('wp_enqueue_scripts', 'front_css_styles');
add_action('wp_enqueue_scripts', 'front_js_scripts');

add_action('admin_enqueue_scripts', 'back_css_styles');
add_action('admin_enqueue_scripts', 'back_js_scripts');

add_action('enqueue_block_editor_assets', 'enqueue_block_editor_scripts');


function front_css_styles()
{
    wp_enqueue_style('bf-normalize-style', get_template_directory_uri() . '/assets/css/theme/normalize.css', array(), _S_VERSION);
    wp_enqueue_style('bf-admin-bar-style', get_template_directory_uri() . '/assets/css/admin/bar.css', array(), _S_VERSION);
    wp_enqueue_style('bf-theme-style', get_template_directory_uri() . '/assets/css/theme/styles.css', array(), uniqid());
    wp_register_style('bf-lenis-style', get_template_directory_uri() . '/assets/css/external/lenis.css', array(), _S_VERSION);

    wp_register_style('bf-owl-style', get_template_directory_uri() . '/assets/css/external/owl.css', array(), _S_VERSION);
    wp_register_style('bf-select-two-style', get_template_directory_uri() . '/assets/css/external/select2.min.css', array(), _S_VERSION);
    wp_register_style('bf-toastify-style', get_template_directory_uri() . '/assets/css/external/toastify.min.css', array(), _S_VERSION);
}

function front_js_scripts()
{
    wp_enqueue_script("bf-gsap-script", get_template_directory_uri() . '/assets/js/external/gsap.min.js', array('jquery'), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));
    wp_enqueue_script("bf-scroll-trigger-script", get_template_directory_uri() . '/assets/js/external/ScrollTrigger.min.js', array('jquery'), _S_VERSION, array('strategy' => 'defer', 'in_footer' => true));
    wp_enqueue_script("bf-scramble-text-script", get_template_directory_uri() . '/assets/js/external/ScrambleTextPlugin.min.js', array(), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));
    wp_enqueue_script("bf-scroll-to-script", get_template_directory_uri() . '/assets/js/external/ScrollToPlugin.min.js', array('jquery'), _S_VERSION, array('strategy' => 'defer', 'in_footer' => true));
    wp_enqueue_script("bf-lenis-script", get_template_directory_uri() . '/assets/js/external/lenis.min.js', array('jquery'), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));

    wp_register_script("bf-vimeo-script", get_template_directory_uri() . '/assets/js/external/vimeo-player.js', array('jquery'), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));
    wp_register_script('bf-owl-script', get_template_directory_uri() . '/assets/js/external/owl.min.js', array('jquery'), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));
    wp_register_script("bf-select-two-script", get_template_directory_uri() . '/assets/js/external/select2.min.js', array(), _S_VERSION, array('strategy' => 'defer', 'in_footer' => true));
    wp_register_script("bf-toastify-script", get_template_directory_uri() . '/assets/js/external/toastify.js', array('jquery'), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));
    wp_register_script("bf-rellax-script", get_template_directory_uri() . '/assets/js/external/rellax.min.js', array('jquery'), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));

    
// function allow_json_uploads($mimes) {
//     $mimes['json'] = 'application/json';
//     return $mimes;
// }
// add_filter('upload_mimes', 'allow_json_uploads');

// add_action('wp_enqueue_scripts', function() {
// 	wp_enqueue_script(
// 		'lottie-player',
// 		'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js',
// 		[],
// 		null,
// 		true
// 	);
// });

// will clean

    wp_enqueue_script("bf-custom-min-js", get_template_directory_uri() . '/assets/js/custom.min.js', array('jquery', 'bf-gsap-script', 'bf-scroll-trigger-script', 'bf-lenis-script', 'bf-scramble-text-script', 'bf-scroll-to-script'), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));
}

function back_css_styles($hook)
{
    wp_enqueue_style('bf-custom-admin-style', get_template_directory_uri() . '/assets/css/admin/styles.css', array(), _S_VERSION);

    if ($hook === 'post.php' || $hook === 'post-new.php') {
        // wp_enqueue_style('acfe-style', get_template_directory_uri() . '/assets/css/external/acfe.css', array(), _S_VERSION);
    }
}

function back_js_scripts($hook)
{
    if ($hook === 'post.php' || $hook === 'post-new.php') {
    }
}

function enqueue_block_editor_scripts()
{
    wp_enqueue_script('bf-block-preview-script', get_template_directory_uri() . '/assets/js/admin/block-preview.js', array('jquery'), _S_VERSION, true);
    wp_localize_script("bf-block-preview-script", 'theme_path', array('url' => get_template_directory_uri()));
}
















/******************** ACF ************************/
add_action('acf/init', 'my_acf_op_init');

function my_acf_op_init()
{
    if (function_exists('acf_add_options_page')) {
        acf_add_options_page(array(
            'menu_title' => 'Global Config',
            'menu_slug' => 'theme-general-settings',
            'capability' => 'manage_options',
            'redirect' => true,
            'icon_url' => menu_icon(),
        ));

        acf_add_options_sub_page(array(
            'page_title' => 'Theme Settings',
            'menu_title' => 'Theme Settings',
            'parent_slug' => 'theme-general-settings',
            'capability' => 'manage_options',
        ));

        acf_add_options_sub_page(array(
            'page_title' => 'Header Navigation',
            'menu_title' => 'Header Navigation',
            'parent_slug' => 'theme-general-settings',
            'capability' => 'manage_options',
        ));

        acf_add_options_sub_page(array(
            'page_title' => 'Footer Navigation',
            'menu_title' => 'Footer Navigation',
            'parent_slug' => 'theme-general-settings',
            'capability' => 'manage_options',
        ));

        acf_add_options_sub_page(array(
            'page_title' => 'Site Scripts',
            'menu_title' => 'Site Scripts',
            'parent_slug' => 'theme-general-settings',
            'capability' => 'manage_options',
        ));

        acf_add_options_sub_page(array(
            'page_title' => 'Extras',
            'menu_title' => 'Extras',
            'parent_slug' => 'theme-general-settings',
            'capability' => 'manage_options',
        ));

        acf_add_options_sub_page(array(
            'page_title' => 'Not found',
            'menu_title' => 'Not found',
            'parent_slug' => 'theme-general-settings',
            'capability' => 'manage_options',
        ));
    }
}

add_action('init', 'register_custom_blocks');

function register_custom_blocks()
{
    if (!function_exists('acf_register_block_type')) {
        return;
    }

    $theme_slug = get_field("theme_slug", "option");
    $theme_slug = $theme_slug ? $theme_slug : "baunfire";

    $blocks_dir = __DIR__ . '/blocks';

    if (!is_dir($blocks_dir) || !is_readable($blocks_dir)) {
        return;
    }

    foreach (scandir($blocks_dir) as $dir) {
        $block_path = $blocks_dir . '/' . $dir;

        if ($dir === '.' || $dir === '..' || !is_dir($block_path)) {
            continue;
        }

        $block_json = $block_path . '/block.json';
        if (!file_exists($block_json)) {
            continue;
        }

        register_block_type($block_path, [
            'category' => $theme_slug,
            'icon'     => block_icon(true),
            'supports' => [
                'anchor' => true,
            ],
        ]);
    }
}

add_filter('block_categories_all', 'custom_block_category', 10, 2);

function custom_block_category($categories, $post)
{
    $theme_slug = get_field("theme_slug", "option");
    $theme_slug = $theme_slug ? $theme_slug : "baunfire";

    $custom_category = array(
        array(
            'slug' => $theme_slug,
            'title' => __(ucfirst(strtolower($theme_slug)) . ' Blocks', $theme_slug)
        ),
    );

    return array_merge($custom_category, $categories);
}

add_filter('block_categories_all', 'custom_block_category', 10, 2);

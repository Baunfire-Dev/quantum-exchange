<?php
add_action('wp_enqueue_scripts', 'front_css_styles');
add_action('wp_enqueue_scripts', 'front_js_scripts');

add_action('admin_enqueue_scripts', 'back_css_styles');
add_action('admin_enqueue_scripts', 'back_js_scripts');

add_action('enqueue_block_editor_assets', 'enqueue_block_editor_scripts');

add_filter('style_loader_tag', 'front_deferred_styles', 10, 4);


function front_css_styles()
{
    wp_enqueue_style('bf-theme-style', get_template_directory_uri() . '/assets/css/bundles/styles.css', array(), _S_VERSION);

    wp_register_style('bf-owl-style', get_template_directory_uri() . '/assets/css/external/owl.css', array(), _S_VERSION);
    wp_register_style('bf-select-two-style', get_template_directory_uri() . '/assets/css/external/select2.min.css', array(), _S_VERSION);
    wp_register_style('bf-toastify-style', get_template_directory_uri() . '/assets/css/external/toastify.min.css', array(), _S_VERSION);
}

function front_js_scripts()
{
    wp_enqueue_script("bf-core", get_template_directory_uri() . '/assets/js/bundles/core.min.js', array(), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));
    wp_enqueue_script('bf-owl-script', get_template_directory_uri() . '/assets/js/external/owl.min.js', array('jquery'), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));

    wp_register_script("bf-text-script", get_template_directory_uri() . '/assets/js/external/TextPlugin.min.js', array('jquery'), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));

    wp_register_script("bf-vimeo-script", get_template_directory_uri() . '/assets/js/external/vimeo-player.js', array('jquery'), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));

    wp_register_script("bf-select-two-script", get_template_directory_uri() . '/assets/js/external/select2.min.js', array(), _S_VERSION, array('strategy' => 'defer', 'in_footer' => true));
    wp_register_script("bf-toastify-script", get_template_directory_uri() . '/assets/js/external/toastify.js', array('jquery'), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));

    wp_register_script("bf-rellax-script", get_template_directory_uri() . '/assets/js/external/rellax.min.js', array('jquery'), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));

    wp_enqueue_script("bf-custom-min-js", get_template_directory_uri() . '/assets/js/bundles/custom.min.js', array('jquery', 'bf-core'), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));
}

function back_css_styles($hook)
{
    wp_enqueue_style('bf-custom-admin-style', get_template_directory_uri() . '/assets/css/admin/styles.css', array(), _S_VERSION);

    if ($hook === 'post.php' || $hook === 'post-new.php') {
        wp_enqueue_style('acfe-style', get_template_directory_uri() . '/assets/css/external/acfe.css', array(), _S_VERSION);
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

function front_deferred_styles($html, $handle, $href, $media) {
    $defer_styles = array(
        'bf-owl-style',
        'bf-select-two-style',
        'bf-toastify-style'
    );

    if (in_array($handle, $defer_styles)) {
        return "<link rel='stylesheet' href='{$href}' media='print' onload=\"this.media='all'\" />";
    }

    return $html;
}

function remove_jquery_migrate($scripts) {
    if (!is_admin() && isset($scripts->registered['jquery'])) {
        $script = $scripts->registered['jquery'];

        if ($script->deps) {
            $script->deps = array_diff($script->deps, array('jquery-migrate'));
        }
    }
}

add_action('wp_default_scripts', 'remove_jquery_migrate');
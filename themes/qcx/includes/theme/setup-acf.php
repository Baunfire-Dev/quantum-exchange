<?php
add_action('acf/init', 'my_acf_op_init');
add_action('init', 'register_custom_blocks');
add_filter('block_categories_all', 'custom_block_category', 10, 2);

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

function register_custom_blocks()
{
    if (!function_exists('acf_register_block_type')) {
        return;
    }

    $theme_slug = get_field('theme_slug', 'option') ?: 'baunfire';
    $blocks_dir = get_template_directory() . '/blocks';

    if (!is_dir($blocks_dir) || !is_readable($blocks_dir)) {
        return;
    }

    foreach (scandir($blocks_dir) as $dir) {
        $block_path = $blocks_dir . '/' . $dir;

        if ($dir === '.' || $dir === '..' || !is_dir($block_path)) {
            continue;
        }

        $block_json_path = $block_path . '/block.json';

        if (!file_exists($block_json_path)) {
            continue;
        }

        convert_block_to_v3($block_json_path);

        register_block_type($block_path, [
            'category' => $theme_slug,
            'icon'     => block_icon(true),
            'supports' => ['anchor' => true],
        ]);
    }
}

function convert_block_to_v3(string $path): void
{
    if (!is_writable($path)) {
        return;
    }

    $raw = file_get_contents($path);
    if ($raw === false) {
        return;
    }

    $data = json_decode($raw, true);
    if (!is_array($data)) {
        return;
    }

    $original = $data;

    $top_defaults = [
        '$schema'    => 'https://advancedcustomfields.com/schemas/json/main/block.json',
        'apiVersion' => 3,
    ];

    foreach ($top_defaults as $key => $value) {
        if (!array_key_exists($key, $data)) {
            $data[$key] = $value;
        }
    }

    $acf_defaults = [
        'blockVersion'        => 3,
        'hideFieldsInSidebar' => true,
    ];

    if (!isset($data['acf']) || !is_array($data['acf'])) {
        $data['acf'] = [];
    }

    foreach ($acf_defaults as $key => $value) {
        if (!array_key_exists($key, $data['acf'])) {
            $data['acf'][$key] = $value;
        }
    }

    if ($data === $original) {
        return;
    }

    file_put_contents(
        $path,
        json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n"
    );
}

function generate_block_preview_ui($block)
{
    $block_slug = str_replace('acf/', '', $block['name']);
    $preview_path = get_template_directory() . '/blocks/' . $block_slug . '/preview.png';
    $preview_url  = get_template_directory_uri() . '/blocks/' . $block_slug . '/preview.png';

    \Timber\Timber::render(
        'components/block-preview.twig',
        [
            'blk_has_preview' => file_exists($preview_path),
            'blk_preview' => $preview_url,
            'blk_title' => $block['title'] ?? $block_slug,
            'blk_logo' => block_icon(),
            'blk_client' => get_bloginfo('name')
        ]
    );
}

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

add_filter('acf/prepare_field/name=block_preview', function($field) {
    $field_group = acf_get_field_group($field['parent']);
    
    if (!$field_group || empty($field_group['location'])) {
        return $field;
    }
    
    foreach ($field_group['location'] as $rule_group) {
        foreach ($rule_group as $rule) {
            if ($rule['param'] === 'block' && isset($rule['value'])) {
                $block_slug = str_replace('acf/', '', $rule['value']);
                
                $preview_path = get_template_directory() . '/blocks/' . $block_slug . '/preview.png';
                $preview_url = get_template_directory_uri() . '/blocks/' . $block_slug . '/preview.png';
                
                if (file_exists($preview_path)) {
                    $field['_preview_url'] = $preview_url;
                }
                
                return $field;
            }
        }
    }
    
    return $field;
});

add_action('acf/render_field/name=block_preview', function($field) {
    if (!empty($field['_preview_url'])) {
        echo sprintf(
            '<div class="acf-block-preview-guide">
                <img src="%s" alt="Block Preview">
            </div>',
            esc_url($field['_preview_url'])
        );
    }
}, 10, 1);
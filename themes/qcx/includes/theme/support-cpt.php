<?php
/**
 * Register multiple CPTs + their own categories.
 * CPTs: News & Resources, Awards, Blogs & Podcasts, Media Coverage,
 *       Resource Library, Press Releases, Webinars & Events, Team
 */

add_action('init', function () {

    $types = [
        'news' => [
            'label'     => 'News',
            'slug'      => 'news-resources',
            'icon'      => 'dashicons-megaphone',
            'tax'       => ['slug' => 'news_category', 'label' => 'News Categories']
        ],
        'award' => [
            'label'     => 'Awards',
            'slug'      => 'awards',
            'icon'      => 'dashicons-awards',
            'tax'       => ['slug' => 'award_category', 'label' => 'Award Categories']
        ],
        'blog_podcast' => [
            'label'     => 'Blogs & Podcasts',
            'slug'      => 'blogs-podcasts',
            'icon'      => 'dashicons-format-audio',
            'tax'       => ['slug' => 'blog_podcast_category', 'label' => 'Blog/Podcast Categories']
        ],
        'media_coverage' => [
            'label'     => 'Media Coverage',
            'slug'      => 'media-coverage',
            'icon'      => 'dashicons-media-document',
            'tax'       => ['slug' => 'media_coverage_category', 'label' => 'Media Coverage Categories']
        ],
        'resource_library' => [
            'label'     => 'Resource Library',
            'slug'      => 'resource-library',
            'icon'      => 'dashicons-portfolio',
            'tax'       => ['slug' => 'resource_library_category', 'label' => 'Resource Categories']
        ],
        'press_release' => [
            'label'     => 'Press Releases',
            'slug'      => 'press-releases',
            'icon'      => 'dashicons-media-text',
            'tax'       => ['slug' => 'press_release_category', 'label' => 'Press Release Categories']
        ],
        'webinar_event' => [
            'label'     => 'Webinars & Events',
            'slug'      => 'webinars-events',
            'icon'      => 'dashicons-calendar',
            'tax'       => ['slug' => 'webinar_event_category', 'label' => 'Webinar/Event Categories']
        ],
        'team' => [
            'label'     => 'Team',
            'slug'      => 'team',
            'icon'      => 'dashicons-groups',
            'tax'       => ['slug' => 'team_category', 'label' => 'Team Categories']
        ],
    ];

    foreach ($types as $type => $cfg) {
        // ===== CPT =====
        register_post_type($type, [
            'label'         => $cfg['label'],
            'labels'        => [
                'name'               => __($cfg['label']),
                'singular_name'      => __($cfg['label']),
                'menu_name'          => __($cfg['label']),
                'add_new'            => __('Add New'),
                'add_new_item'       => __('Add New ' . $cfg['label']),
                'edit_item'          => __('Edit ' . $cfg['label']),
                'new_item'           => __('New ' . $cfg['label']),
                'view_item'          => __('View ' . $cfg['label']),
                'view_items'         => __('View ' . $cfg['label']),
                'search_items'       => __('Search ' . $cfg['label']),
                'not_found'          => __('No items found'),
                'not_found_in_trash' => __('No items found in Trash'),
            ],
            'public'        => true,
            'show_ui'       => true,
            'show_in_menu'  => true,
            'show_in_rest'  => true,
            'menu_icon'     => $cfg['icon'],
            'menu_position' => 20,
            'has_archive'   => false,
            'rewrite'       => ['slug' => $cfg['slug']],
            'supports'      => ['title','editor','thumbnail','excerpt','revisions','custom-fields'],
        ]);

        // Extra safety (keeps supports even if something strips them)
        add_post_type_support($type, ['editor','thumbnail','excerpt','revisions','custom-fields']);

        // ===== Taxonomy (hierarchical like categories) =====
        register_taxonomy($cfg['tax']['slug'], [$type], [
            'labels' => [
                'name'              => __($cfg['tax']['label']),
                'singular_name'     => __($cfg['tax']['label']),
                'search_items'      => __('Search ' . $cfg['tax']['label']),
                'all_items'         => __('All ' . $cfg['tax']['label']),
                'parent_item'       => __('Parent ' . $cfg['tax']['label']),
                'parent_item_colon' => __('Parent ' . $cfg['tax']['label'] . ':'),
                'edit_item'         => __('Edit ' . $cfg['tax']['label']),
                'update_item'       => __('Update ' . $cfg['tax']['label']),
                'add_new_item'      => __('Add New ' . rtrim($cfg['tax']['label'], 's')),
                'new_item_name'     => __('New ' . rtrim($cfg['tax']['label'], 's') . ' Name'),
                'menu_name'         => __($cfg['tax']['label']),
            ],
            'hierarchical'      => true,
            'public'            => true,
            'show_ui'           => true,
            'show_in_rest'      => true,
            'show_admin_column' => true,
            'rewrite'           => ['slug' => $cfg['tax']['slug']],
        ]);
    }
}, 0);

/** Force Gutenberg on for these CPTs */
add_filter('use_block_editor_for_post_type', function ($use, $type) {
    $types = ['news','award','blog_podcast','media_coverage','resource_library','press_release','webinar_event','team', 'partner'];
    return in_array($type, $types, true) ? true : $use;
}, 100, 2);

/**
 * ✅ Force selected CPTs to use single.php template
 */
add_filter('single_template', function ($template) {
    $post_type = get_post_type();

    $types = [
        'news',
        'award',
        'blog_podcast',
        'media_coverage',
        'resource_library',
        'press_release',
        'webinar_event',
        'team'
  ];

    if (in_array($post_type, $types, true)) {
        $default_template = locate_template(['single.php']);
        if ($default_template) {
            return $default_template;
        }
    }

    return $template;
});

add_action('template_redirect', function () {

    // All CPTs that should support redirect
    $types = [
        'news',
        'award',
        'blog_podcast',
        'media_coverage',
        'resource_library',
        'press_release',
        'webinar_event',
        'team'
    ];

    if ( is_singular($types) ) {

        // ACF field
        $redirect_url = get_field('redirect_link');

        // Redirect ONLY if field is not empty
        if (!empty($redirect_url)) {
            wp_redirect( esc_url($redirect_url), 301 );
            exit;
        }
    }
});

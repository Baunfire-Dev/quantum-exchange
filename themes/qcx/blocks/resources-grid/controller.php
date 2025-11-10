<?php
use Timber\Timber;

/**
 * Resource Grid (V2) — All CPTs + Blog with dynamic taxonomies and AJAX
 */

acf_setup_meta($block['data'], $block['id'], true);

$ctx = Timber::context();
$ctx['block']  = $block;
$ctx['fields'] = get_field('block') ?: [];

// Choose design variation
$design = $ctx['fields']['design_variation'] ?? 'V1';

// === CPTs + Taxonomies Map ===
$cpt_map = [
    'all' => ['label' => 'All', 'tax' => null],
    'news' => ['label' => 'News & Resources', 'tax' => 'news_category'],
    'award' => ['label' => 'Awards', 'tax' => 'award_category'],
    'blog_podcast' => ['label' => 'Blogs & Podcasts', 'tax' => 'blog_podcast_category'],
    'media_coverage' => ['label' => 'Media Coverage', 'tax' => 'media_coverage_category'],
    'resource_library' => ['label' => 'Resource Library', 'tax' => 'resource_library_category'],
    'press_release' => ['label' => 'Press Releases', 'tax' => 'press_release_category'],
    'webinar_event' => ['label' => 'Webinars & Events', 'tax' => 'webinar_event_category'],
    'team' => ['label' => 'Team', 'tax' => 'team_category'],
    'post' => ['label' => 'Blog', 'tax' => 'category'],
];
$ctx['cpt_map'] = $cpt_map;

// Get initial filters from URL params
$type_param = sanitize_key($_GET['type'] ?? 'all');
$cat_param  = intval($_GET['cat'] ?? 0);

// === Grid Config ===
$ctx['rg'] = [
    'post_type'     => $type_param,
    'tax_category'  => $cpt_map[$type_param]['tax'] ?? 'category',
    'ppp'           => 9,
    'design'        => $design,
];

// === Initial Query ===
$args = [
    'post_status'    => 'publish',
    'posts_per_page' => $ctx['rg']['ppp'],
    'paged'          => 1,
];

if ($type_param !== 'all' && post_type_exists($type_param)) {
    $args['post_type'] = $type_param;
} else {
    // all CPTs + blog
    $args['post_type'] = array_keys(array_filter($cpt_map, fn($v, $k) => $k !== 'all', ARRAY_FILTER_USE_BOTH));
}

if ($cat_param && !empty($ctx['rg']['tax_category'])) {
    $args['tax_query'] = [
        [
            'taxonomy' => $ctx['rg']['tax_category'],
            'field'    => 'term_id',
            'terms'    => [$cat_param],
        ]
    ];
}

$initial = new WP_Query($args);
$ctx['resources'] = Timber::get_posts($initial);
wp_reset_postdata();

// Nonce for AJAX
$ctx['rg_nonce'] = wp_create_nonce('rg_nonce');

acf_reset_meta($block['id']);
Timber::render(__DIR__ . '/template.twig', $ctx);

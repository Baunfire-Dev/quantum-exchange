<?php

use Timber\Timber;

acf_setup_meta($block["data"], $block["id"], true);

$context = Timber::context([
    "block" => $block,
    "fields" => get_field("block"),
    "posts" => [],
    "items_per_page" => 9
]);

$resource = $context["fields"]["resource"] ?? 'all';

$post_types = [
    'all' => ['label' => 'All', 'tax' => null],
    'news' => ['label' => 'News & Resources', 'tax' => 'news_category'],
    'blog_podcast' => ['label' => 'Blogs & Podcasts', 'tax' => 'blog_podcast_category'],
    'media_coverage' => ['label' => 'Media Coverage', 'tax' => 'media_coverage_category'],
    'resource_library' => ['label' => 'Resource Library', 'tax' => 'resource_library_category'],
    'press_release' => ['label' => 'Press Releases', 'tax' => 'press_release_category'],
    'webinar_event' => ['label' => 'Webinars & Events', 'tax' => 'webinar_event_category']
];

if ($resource != "all") {
    $terms = get_terms([
        'taxonomy' => $post_types[$resource]['tax'],
        'hide_empty' => false,
    ]);

    $post_types[$resource]['tax_items'] = array_map(function ($term) {
        return [
            'name' => $term->name,
            'slug' => $term->slug
        ];
    }, $terms);
}

$context['types'] = $post_types;

$transient_key = TRANSIENT_PREFIX . "_" . $resource . "_grid_resource";
$posts = get_transient($transient_key);

if (!$posts) {
    $posts = Timber::get_posts(array(
        'post_type' => $resource == "all" ? array_keys($post_types) : $resource,
        'posts_per_page' => -1,
        'post_status' => 'publish',
        'order' => 'DESC'
    ));

    set_transient($transient_key, $posts, TRANSIENT_DURATION);
}

$context['posts'] = $posts;

$context["block"]["slug"] = preg_replace('/^acf\//', '', $block["name"]);
acf_reset_meta($block["id"]);

Timber::render("./template.twig", $context);

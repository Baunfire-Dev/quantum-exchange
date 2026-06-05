<?php
use Timber\Timber;

if ($is_preview) {
    generate_block_preview_ui($block);
    return;
}

acf_setup_meta($block["data"], $block["id"], true);

$context = Timber::context([
    "block" => $block,
    "fields" => get_field("block"),
    "posts" => [],
    "items_per_page" => 9
]);

$post_types = [
    'news' => ['label' => 'News & Resources', 'tax' => 'news_category'],
    'blog_podcast' => ['label' => 'Blogs & Podcasts', 'tax' => 'blog_podcast_category'],
    'media_coverage' => ['label' => 'Media Coverage', 'tax' => 'media_coverage_category'],
    'press_release' => ['label' => 'Press Releases', 'tax' => 'press_release_category'],
    'webinar_event' => ['label' => 'Webinars & Events', 'tax' => 'webinar_event_category'],
    'award' => ['label' => 'Awards', 'tax' => 'award_category'],
];

$resources = $context["fields"]["resource"];

$posts = [];

foreach ($resources as $key) {
    if (!isset($post_types[$key])) {
        continue;
    }

    $terms = get_terms([
        'taxonomy' => $post_types[$key]['tax'],
        'hide_empty' => false,
    ]);

    $post_types[$key]['tax_items'] = array_map(function ($term) {
        return [
            'name' => $term->name,
            'slug' => $term->slug,
        ];
    }, $terms);

    $transient_key = TRANSIENT_PREFIX . "_" . $key . "_grid_resource";
    $cached = get_transient($transient_key);

    if (!$cached) {
        $cached = Timber::get_posts([
            'post_type' => $key,
            'posts_per_page' => -1,
            'post_status' => 'publish',
            'order' => 'DESC',
        ]);

        set_transient($transient_key, $cached, TRANSIENT_DURATION);
    }

    $posts = array_merge($posts, (array) $cached);
}

usort($posts, fn($a, $b) => strtotime($b->post_date) - strtotime($a->post_date));

$all_cats = [];

foreach ($post_types as $type) {
    if (!empty($type['tax_items'])) {
        foreach ($type['tax_items'] as $cat) {
            $all_cats[$cat['slug']] = $cat;
        }
    }
}

usort($all_cats, fn($a, $b) => strcasecmp($a['name'], $b['name']));

$context['posts'] = $posts;
$context['types'] = array_intersect_key($post_types, array_flip($resources));
$context['all_cats'] = $all_cats;

$context["block"]["slug"] = preg_replace('/^acf\//', '', $block["name"]);
acf_reset_meta($block["id"]);

Timber::render("./template.twig", $context);
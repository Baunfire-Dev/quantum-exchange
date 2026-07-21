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
    "post_types" => [
        'news' => ['label' => 'News & Resources', 'tax' => 'news_category'],
        'blog_podcast' => ['label' => 'Blogs & Podcasts', 'tax' => 'blog_podcast_category'],
        'media_coverage' => ['label' => 'Media Coverage', 'tax' => 'media_coverage_category'],
        'press_release' => ['label' => 'Press Releases', 'tax' => 'press_release_category'],
        'webinar_event' => ['label' => 'Webinars & Events', 'tax' => 'webinar_event_category'],
        'award' => ['label' => 'Awards', 'tax' => 'award_category']
    ]
]);

$mode = $context['fields']['mode'];
$data_source = $context['fields']['featured_posts'];

if ($mode == "manual") {
    $data_source = $context['fields']['featured_posts_manual'];
} else if ($mode == "recent") {
    $type = $context['fields']['source'];
    $data_source = Timber::get_posts([
        'post_type' => $type,
        'posts_per_page' => 2,
        'post_status' => 'publish',
        'order' => 'DESC',
    ]);
}

$context['data_source'] = $data_source;

$context["block"]["slug"] = preg_replace('/^acf\//', '', $block["name"]);

acf_reset_meta($block["id"]);
Timber::render("./template.twig", $context);

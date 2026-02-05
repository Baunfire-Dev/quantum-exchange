<?php
use Timber\Timber;
acf_setup_meta($block["data"], $block["id"], true);

$context = Timber::context([
    "block" => $block,
    "fields" => get_field("block"),
    "post_types" => [
        'news' => ['label' => 'News & Resources', 'tax' => 'news_category'],
        'blog_podcast' => ['label' => 'Blogs & Podcasts', 'tax' => 'blog_podcast_category'],
        'media_coverage' => ['label' => 'Media Coverage', 'tax' => 'media_coverage_category'],
        'resource_library' => ['label' => 'Resource Library', 'tax' => 'resource_library_category'],
        'press_release' => ['label' => 'Press Releases', 'tax' => 'press_release_category'],
        'webinar_event' => ['label' => 'Webinars & Events', 'tax' => 'webinar_event_category'],
        'award' => ['label' => 'Awards', 'tax' => 'award_category']
    ]
]);


$context["block"]["slug"] = preg_replace('/^acf\//', '', $block["name"]);

acf_reset_meta($block["id"]);
Timber::render("./template.twig", $context);

<?php
use Timber\Timber;

acf_setup_meta($block["data"], $block["id"], true);

$context = Timber::context([
  "block" => $block,
  "fields" => get_field("block")
]);

$context["block"]["slug"] = preg_replace('/^acf\//', '', $block["name"]);

$select_videos = $context["fields"]["source"] ?? "all";
$raw_videos = array();
$clean_videos = array();

if ($select_videos === "all") {
    $raw_videos = get_posts(array(
        'post_type' => 'videos',
        'posts_per_page' => -1,
        'orderby' => 'date',
        'order' => 'DESC',
        'post_status' => 'publish'
    ));
}elseif ($select_videos === "manual" && !empty($context["fields"]["videos"])) {
    $video_ids = $context["fields"]["videos"];

    if (!is_array($video_ids)) {
        $video_ids = array($video_ids);
    }

    $raw_videos = get_posts(array(
        'post_type' => 'videos',
        'post__in' => $video_ids,
        'orderby' => 'post__in',
        'posts_per_page' => -1,
        'post_status' => 'publish'
    ));
}

if (!empty($raw_videos)) {
    foreach ($raw_videos as $video) {
        $video_fields = get_fields($video->ID);
        
        $video_item = array(
            'title' => $video->post_title,
            'source' => $video_fields['source'] ?? 'direct',
            'video_url' => $video_fields['video_url'] ?? null,
            'youtube_id' => $video_fields['youtube_id'] ?? null,
            'thumbnail' => isset($video_fields['thumbnail']) ? $video_fields['thumbnail'] : '',
        );
        
        $clean_videos[] = $video_item;
    }
}

$context["videos"] = $clean_videos;

acf_reset_meta($block["id"]);

Timber::render("./template.twig", $context);
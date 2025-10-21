<?php
use Timber\Timber;

acf_setup_meta($block["data"], $block["id"], true);

$context = Timber::context([
  "block" => $block,
  "fields" => get_field("block")
]);

$context["block"]["slug"] = preg_replace('/^acf\//', '', $block["name"]);

$select_videos = $context["fields"]["select_videos"] ?? "all";
$videos_data = array();

if ($select_videos === "all") {
    $videos = get_posts(array(
        'post_type' => 'videos',
        'posts_per_page' => -1,
        'orderby' => 'date',
        'order' => 'DESC',
        'post_status' => 'publish'
    ));
} elseif ($select_videos === "latest") {
    $videos = get_posts(array(
        'post_type' => 'videos',
        'posts_per_page' => 5,
        'orderby' => 'date',
        'order' => 'DESC',
        'post_status' => 'publish'
    ));
} elseif ($select_videos === "manual" && !empty($context["fields"]["videos"])) {
    $video_ids = $context["fields"]["videos"];
    if (!is_array($video_ids)) {
        $video_ids = array($video_ids);
    }
    $videos = get_posts(array(
        'post_type' => 'videos',
        'post__in' => $video_ids,
        'orderby' => 'post__in',
        'posts_per_page' => -1,
        'post_status' => 'publish'
    ));
}

if (!empty($videos)) {
    foreach ($videos as $video) {
        $video_fields = get_fields($video->ID);
        $video_item = array(
            'id' => $video->ID,
            'title' => $video->post_title,
            'excerpt' => $video->post_excerpt,
            'thumbnail' => $video_fields['thumnail'] ?? null,
            'source' => $video_fields['source'] ?? 'media',
            'select_media' => $video_fields['select_media'] ?? null,
            'vimeo_id' => $video_fields['vimeo_id'] ?? null,
            'youtube_id' => $video_fields['youtube_id'] ?? null
        );
        
        if (!$video_item['thumbnail'] && has_post_thumbnail($video->ID)) {
            $video_item['thumbnail'] = get_post_thumbnail_id($video->ID);
        }
        
        $videos_data[] = $video_item;
    }
}

$context["videos"] = $videos_data;

acf_reset_meta($block["id"]);

Timber::render("./template.twig", $context);
<?php

use Timber\Timber;

acf_setup_meta($block["data"], $block["id"], true);

$context = Timber::context([
    "block" => $block,
    "fields" => get_field("block"),
    "posts" => [],
    "has_posts" => true,
    "page_link" => get_permalink(get_queried_object_id())
]);

$posts = Timber::get_posts(array(
    'post_type' => "glossary",
    'posts_per_page' => -1,
    'post_status' => 'publish',
    'order' => 'ASC',
    'orderby'   => 'title',
));

$data = [];
$active_letters = [];

foreach ($posts as $post) {
    $letter = strtolower(substr($post->title, 0, 1));

    if (!isset($data[$letter])) {
        $data[$letter] = [];
    }

    $data[$letter][] = array(
        'title' => $post->title,
        'description' => get_field('description', $post->ID)
    );

    if (!in_array($letter, $active_letters)) {
        $active_letters[] = $letter;
    }
}

$context['posts'] = $data;
$context['active_letters'] = $active_letters;

if (empty($data)) {
   $context['has_posts'] = false;
}

$context["block"]["slug"] = preg_replace('/^acf\//', '', $block["name"]);
acf_reset_meta($block["id"]);

Timber::render("./template.twig", $context);

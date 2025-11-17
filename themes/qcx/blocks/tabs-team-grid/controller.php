<?php

use Timber\Timber;

acf_setup_meta($block["data"], $block["id"], true);

$context = Timber::context([
    "block" => $block,
    "fields" => get_field("block"),
    "posts" => [],
    "categories" => []
]);

$terms = get_terms([
    'taxonomy' => "team-type",
    'hide_empty' => false,
]);

$context['categories'] = array_map(function ($term) {
    return [
        'name' => $term->name,
        'slug' => $term->slug
    ];
}, $terms);

$transient_key = TRANSIENT_PREFIX . "_team_grid_resource";
$posts = get_transient($transient_key);

if (!$posts) {
    $posts = Timber::get_posts(array(
        'post_type' => "team",
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

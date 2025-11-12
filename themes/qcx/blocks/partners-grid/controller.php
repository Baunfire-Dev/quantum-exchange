<?php

use Timber\Timber;

acf_setup_meta($block["data"], $block["id"], true);

$context = Timber::context([
    "block" => $block,
    "fields" => get_field("block"),
    "posts" => [],
    "items_per_page" => 9
]);

$transient_key = TRANSIENT_PREFIX . "_partner_grid_resource";
$posts = get_transient($transient_key);

$terms = get_terms([
    'taxonomy' => "partner-type",
    'hide_empty' => false,
]);

$context['categories'] = array_map(function ($term) {
    return [
        'name' => $term->name,
        'slug' => $term->slug
    ];
}, $terms);

if (!$posts) {
    $posts = Timber::get_posts(array(
        'post_type' => "partner",
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

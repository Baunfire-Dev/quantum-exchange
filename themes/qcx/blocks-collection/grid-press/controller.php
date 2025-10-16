<?php

use Timber\Timber;

acf_setup_meta($block["data"], $block["id"], true);

$context = Timber::context([
    "block" => $block,
    "fields" => get_field("block")
]);

$transient_key = TRANSIENT_PREFIX . "_block_grid_press";
$posts = get_transient($transient_key);

if (!$posts) {
    $posts = Timber::get_posts(array(
        'post_type'      => 'press',
        'posts_per_page' => -1,
        'post_status'    => 'publish',
        'order'          => 'DESC'
    ));

    set_transient($transient_key, $posts, TRANSIENT_DURATION);
}

$context['posts'] = $posts;

$context["block"]["slug"] = preg_replace('/^acf\//', '', $block["name"]);

acf_reset_meta($block["id"]);

Timber::render("./template.twig", $context);

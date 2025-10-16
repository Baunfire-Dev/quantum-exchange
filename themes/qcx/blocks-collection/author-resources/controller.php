<?php

use Timber\Timber;

acf_setup_meta($block["data"], $block["id"], true);

$context = Timber::context([
    "block" => $block,
    "fields" => get_field("block")
]);

$post_id = get_the_ID();
$default_author = get_field("default_author", "option");

$query_params = array(
    'post_type' => ["post", "ebook", "customer-story", "webinar"],
    'posts_per_page' => -1,
    'post_status' => 'publish',
    'order' => 'DESC',
);

if ($post_id == $default_author->ID) {
    $query_params['meta_query'] = array(
        'relation' => 'OR',
        array(
            'key'     => 'resource_author',
            'compare' => 'NOT EXISTS',
        ),
        array(
            'key'     => 'resource_author',
            'value'   => '',
            'compare' => '=',
        ),
        array(
            'key'     => 'resource_author',
            'value'   => $default_author->ID,
            'compare' => '=',
        ),
    );
} else {
    $query_params['meta_query'] = array(
        array(
            'key'     => 'resource_author',
            'value'   => $post_id,
            'compare' => '=',
        ),
    );
}

$context['posts'] = Timber::get_posts($query_params);
$context["block"]["slug"] = preg_replace('/^acf\//', '', $block["name"]);

acf_reset_meta($block["id"]);


Timber::render("./template.twig", $context);

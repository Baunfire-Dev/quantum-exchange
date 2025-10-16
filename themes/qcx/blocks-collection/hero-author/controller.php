<?php

use Timber\Timber;

acf_setup_meta($block["data"], $block["id"], true);

$post_id = get_the_ID();

$context = Timber::context([
    "block" => $block,
    "fields" => get_field("block"),
    "title" => get_the_title($post_id),
    "feature_image" => get_post_thumbnail_id($post_id),
    "author_bio" => get_field("author_bio", $post_id),
    "author_title" => get_field("author_title", $post_id),
    "back_cta" => get_field("back_to_authors_cta", "option")
]);

$context["block"]["slug"] = preg_replace('/^acf\//', '', $block["name"]);

acf_reset_meta($block["id"]);

Timber::render("./template.twig", $context);

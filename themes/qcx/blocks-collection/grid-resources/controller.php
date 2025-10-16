<?php

use Timber\Timber;

acf_setup_meta($block["data"], $block["id"], true);

$context = Timber::context([
    "block" => $block,
    "fields" => get_field("block"),
    "posts" => []
]);

$resource = $context["fields"]["resource"];

$transient_key = TRANSIENT_PREFIX . "_" . $resource . "_grid_resource";
$posts = get_transient($transient_key);

if (!$posts) {
    $posts = Timber::get_posts(array(
        'post_type' => $resource,
        'posts_per_page' => -1,
        'post_status' => 'publish',
        'order' => 'DESC'
    ));

    set_transient($transient_key, $posts, TRANSIENT_DURATION);
}

$context['posts'] = $posts;

$category_name = "category";

if ($resource == "webinar") {
    $category_name = "webinar-type";
} elseif ($resource == "ebook") {
    $category_name = "ebook-type";
} elseif ($resource == "customer-story") {
    $category_name = "customer-story-type";
}

$context["taxonomy"] = $category_name;

$context['categories'] = Timber::get_terms(array(
    'taxonomy' => $category_name,
    'hide_empty' => false
));

$context["block"]["slug"] = preg_replace('/^acf\//', '', $block["name"]);

acf_reset_meta($block["id"]);


Timber::render("./template.twig", $context);

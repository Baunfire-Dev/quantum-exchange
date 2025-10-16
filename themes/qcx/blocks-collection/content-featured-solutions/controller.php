<?php

use Timber\Timber;

acf_setup_meta($block["data"], $block["id"], true);

$context = Timber::context([
    "block" => $block,
    "fields" => get_field("block"),
    "back_cta" => get_field("solutions_back_cta", "option")
]);

$current_id = get_the_ID();

$is_latest = $context['fields']['source'] == "latest";
$is_related = $context['fields']['source'] == "related";

$category = $context['fields']['category'];
$variation = $context['fields']['variation'];

if ($is_related) {
    $category = wp_get_post_terms($current_id, 'solution-type', ['fields' => 'ids']);
    $context['fields']['variation'] = "three-grid";
    $variation = "three-grid";
}

if (($is_latest or $is_related) && $category) {
    $context['latest_posts'] = Timber::get_posts(array(
        'post_type' => "solution",
        'posts_per_page' => $variation == "three-grid" ? 3 : -1,
        'post_status' => 'publish',
        'post__not_in'   => [$current_id],
        'order' => 'DESC',
        'tax_query'      => [
            [
                'taxonomy' => 'solution-type',
                'field'    => 'term_id',
                'terms'    => $category,
                'operator' => 'IN'
            ]
        ]
    ));
}

$context["block"]["slug"] = preg_replace('/^acf\//', '', $block["name"]);

acf_reset_meta($block["id"]);


Timber::render("./template.twig", $context);

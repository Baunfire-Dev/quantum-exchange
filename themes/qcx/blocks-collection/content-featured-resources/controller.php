<?php

use Timber\Timber;

acf_setup_meta($block["data"], $block["id"], true);

$context = Timber::context([
    "block" => $block,
    "fields" => get_field("block")
]);

$current_id = get_the_ID();

$is_latest = $context['fields']['source'] == "latest";
$is_related = $context['fields']['source'] == "related";

$variation = $context['fields']['variation'];

$resource = $context['fields']['resource'];
$by_taxonomy = $context['fields']['by_taxonomy'];
$posts = null;

if ($is_related) {
    $resource = get_post_type($current_id);
    $context['fields']['variation'] = "three-grid";
    $variation = "three-grid";
}

if ($is_latest or $is_related) {
    $category_name = "category";
    $resource_params = [];
    $taxonomy = wp_get_post_terms($current_id, $category_name);

    $query_params = array(
        "post_type" => $resource,
        'posts_per_page' => $variation == "three-grid" ? 3 : 5,
        'post_status' => 'publish',
        'order' => 'DESC',
        'post__not_in'   => [$current_id],
    );

    if ($resource == "webinar") {
        $category_name = "webinar-type";
    } elseif ($resource == "ebook") {
        $category_name = "ebook-type";
    } elseif ($resource == "customer-story") {
        $category_name = "customer-story-type";
    }

    if ($is_latest) {
        if ($resource == "all") {
            $query_params["post_type"] = ["post", "ebook", "customer-story", "webinar"];
        } else {
            $taxonomy = $context['fields']['taxonomy_' . $resource];
        }
    }

    if ($by_taxonomy && $taxonomy) {
        if ($resource == "post") {
            $resource_params = array(
                'category__in' => $taxonomy
            );
        } else {
            $resource_params = array(
                'tax_query'      => array(
                    array(
                        'taxonomy' => $category_name,
                        'field'    => 'term_id',
                        'terms'    => $taxonomy,
                    ),
                ),
            );
        }
    }

    $posts = Timber::get_posts(array_merge($resource_params, $query_params));
}

$context['latest_posts'] = $posts;
$context["block"]["slug"] = preg_replace('/^acf\//', '', $block["name"]);

acf_reset_meta($block["id"]);


Timber::render("./template.twig", $context);

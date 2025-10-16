<?php

use Timber\Timber;

acf_setup_meta($block["data"], $block["id"], true);

$post_id = get_the_ID();
$author_id = get_post_field('post_author', $post_id);

$context = Timber::context([
    "block" => $block,
    "fields" => get_field("block"),
    "title" => get_the_title(),
    "categories" => [],
    "published_data" => get_the_date(),
    "site_link" => get_the_permalink(),
    "feature_image" => get_post_thumbnail_id($post_id)
]);

$post_author = get_field("resource_author", $post_id);
$default_author = get_field("default_author", "option");

if (!$post_author) {
    $post_author = $default_author;
}
    
$context['author_name'] = get_the_title($post_author);
$context['author_avatar'] = get_post_thumbnail_id($post_author);
$context['author_url'] = get_permalink($post_author);


$resource = get_post_type($post_id);
$category_name = "category";
$context['back_cta'] = get_field("blog_back_cta", "option");

if ($resource == "webinar") {
    $category_name = "webinar-type";
    $context['back_cta'] = get_field("webinar_back_cta", "option");
} elseif ($resource == "ebook") {
    $category_name = "ebook-type";
    $context['back_cta'] = get_field("ebook_back_cta", "option");
} elseif ($resource == "customer-story") {
    $category_name = "customer-story-type";
    $context['back_cta'] = get_field("customer_story_back_cta", "option");
}

$category_raw = wp_get_post_terms(get_the_ID(), $category_name);

if (!is_wp_error($category_raw)) {
    foreach ($category_raw as $category) {
        $parents = get_ancestors($category->term_id, $category_name);
        $all_ids = array_merge($parents, [$category->term_id]);

        foreach ($all_ids as $term_id) {
            $term = get_term($term_id, $category_name);
            if ($term && !is_wp_error($term)) {
                $list_link_url = isset($context['back_cta']['url']) ? $context['back_cta']['url'] : "#";

                $context['categories'][$term_id] = [
                    'name' => $term->name,
                    'url'  => $list_link_url ? $list_link_url . "?category=" . $term->slug : "#",
                ];
            }
        }
    }
}

$context['categories'] = array_values($context['categories']);

$category_raw = wp_get_post_terms($post_id, $category_name);
$context["block"]["slug"] = preg_replace('/^acf\//', '', $block["name"]);

acf_reset_meta($block["id"]);

Timber::render("./template.twig", $context);

<?php

use Timber\Timber;

acf_setup_meta($block["data"], $block["id"], true);

$context = Timber::context([
    "block" => $block,
    "fields" => get_field("block"),
    "posts" => []
]);

$transient_key = TRANSIENT_PREFIX . "_grid_solutions";
$posts = get_transient($transient_key);

if (!$posts) {
    $posts = Timber::get_posts(array(
        'post_type' => "solution",
        'posts_per_page' => -1,
        'post_status' => 'publish',
        'order' => 'DESC',
    ));

    set_transient($transient_key, $posts, TRANSIENT_DURATION);
}

$context['posts'] = $posts;

$categories_raw = Timber::get_terms(array(
    'taxonomy' => 'solution-type',
    'hide_empty' => false,
));

$context['categories'] = [
    'parents' => [],
    'non_parents' => [],
];

foreach ($categories_raw as $term) {
    if ($term->slug === 'uncategorized') {
        continue;
    }

    if ($term->parent == 0) {
        $category_data = [
            "category" => $term,
            "is_parent" => false,
            "children" => [],
            "name" => $term->name,
        ];

        $children = [];
        foreach ($categories_raw as $child) {
            if ($child->parent == $term->id && $child->slug !== 'uncategorized') {
                $children[] = $child;
            }
        }

        if (!empty($children)) {
            $category_data['is_parent'] = true;
            $category_data['children'] = $children;
            $context['categories']['parents'][] = $category_data;
        } else {
            $context['categories']['non_parents'][] = $category_data;
        }
    }
}

$context["block"]["slug"] = preg_replace('/^acf\//', '', $block["name"]);

acf_reset_meta($block["id"]);


Timber::render("./template.twig", $context);

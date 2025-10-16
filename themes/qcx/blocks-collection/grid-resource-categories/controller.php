<?php

use Timber\Timber;

acf_setup_meta($block["data"], $block["id"], true);

$context = Timber::context([
    "block" => $block,
    "fields" => get_field("block")
]);

if ($context["fields"]["item"]) {
    foreach ($context["fields"]["item"] as $index => $item) {
        $context["fields"]["item"][$index]["children"] = [];
        $by_taxonomy = $context["fields"]["item"][$index]["by_taxonomy"];
        $resource = $context["fields"]["item"][$index]["resource"];

        if ($resource) {
            if ($by_taxonomy) {
                $taxonomy = $context["fields"]["item"][$index]["taxonomy_" . ($resource == "post" ? "blog" : $resource)];
                $tax_object = get_term($taxonomy);

                $list_link_source = get_field("blog_back_cta", "option");
                $list_link_url = "#";

                if ($resource == "post") {
                    $context["fields"]["item"][$index]["children"] = Timber::get_posts(array(
                        'post_type' => $resource,
                        'posts_per_page' => 4,
                        'post_status' => 'publish',
                        'order' => 'DESC',
                        'category__in' => $taxonomy
                    ));
                    
                } elseif ($resource == "webinar") {
                    $category_name = "webinar-type";

                    $context["fields"]["item"][$index]["children"] = Timber::get_posts(array(
                        'post_type' => $resource,
                        'posts_per_page' => 4,
                        'post_status' => 'publish',
                        'order' => 'DESC',
                        'tax_query'      => array(
                            array(
                                'taxonomy' => $category_name,
                                'field'    => 'term_id',
                                'terms'    => $taxonomy,
                            ),
                        ),
                    ));

                    $list_link_source = get_field("webinar_back_cta", "option");

                } elseif ($resource == "ebook") {
                    $category_name = "ebook-type";

                    $context["fields"]["item"][$index]["children"] = Timber::get_posts(array(
                        'post_type' => $resource,
                        'posts_per_page' => 4,
                        'post_status' => 'publish',
                        'order' => 'DESC',
                        'tax_query'      => array(
                            array(
                                'taxonomy' => $category_name,
                                'field'    => 'term_id',
                                'terms'    => $taxonomy,
                            ),
                        ),
                    ));

                    $list_link_source = get_field("ebook_back_cta", "option");

                } elseif ($resource == "customer-story") {
                    $category_name = "customer-story-type";

                    $context["fields"]["item"][$index]["children"] = Timber::get_posts(array(
                        'post_type' => $resource,
                        'posts_per_page' => 4,
                        'post_status' => 'publish',
                        'order' => 'DESC',
                        'tax_query'      => array(
                            array(
                                'taxonomy' => $category_name,
                                'field'    => 'term_id',
                                'terms'    => $taxonomy,
                            ),
                        ),
                    ));

                    $list_link_source = get_field("customer_story_back_cta", "option");
                }

                $list_link_url = isset($list_link_source['url']) ? $list_link_source['url'] : "#";
                $context["fields"]["item"][$index]["cta_link"] = $list_link_url && $tax_object ? $list_link_url . "?category=" . $tax_object->slug : "#";
            } else {
                $cta_link = get_field("blog_back_cta", "option");

                if ($resource == "webinar") {
                    $cta_link = get_field("webinar_back_cta", "option");
                } elseif ($resource == "ebook") {
                    $cta_link = get_field("ebook_back_cta", "option");
                } elseif ($resource == "customer-story") {
                    $cta_link = get_field("customer_story_back_cta", "option");
                }

                $context["fields"]["item"][$index]["children"] = Timber::get_posts(array(
                    'post_type' => $resource,
                    'posts_per_page' => 4,
                    'post_status' => 'publish',
                    'order' => 'DESC'
                ));

                $context["fields"]["item"][$index]["cta_link"] = $cta_link && isset($cta_link['url']) ? $cta_link['url'] : "#";
            }
        }
    }
}

// ddump($context["fields"]["item"]);

$context["block"]["slug"] = preg_replace('/^acf\//', '', $block["name"]);

acf_reset_meta($block["id"]);

Timber::render("./template.twig", $context);

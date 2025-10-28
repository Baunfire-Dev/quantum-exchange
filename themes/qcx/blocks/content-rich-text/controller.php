<?php
use Timber\Timber;

acf_setup_meta($block["data"], $block["id"], true);

$context = Timber::context([
  "block" => $block,
  "fields" => get_field("block")
]);

$post_type = get_post_type();

if (in_array($post_type, ['post', 'ebook', 'webinar', 'customer-story', 'press'])) {
    $context["is_resource"] = true;
    $context["res_form"] = get_field("resource_form", get_the_ID());
    $context["res_letter"] = get_field("resource_sidebar_newsletter", "option");
    $context["res_cta"] = get_field("resource_cta", get_the_ID());
    $context["res_cta_bg"] = get_field("resource_sidebar_cta_bg", "option");
}

$context["block"]["slug"] = preg_replace('/^acf\//', '', $block["name"]);

acf_reset_meta($block["id"]);


Timber::render("./template.twig", $context);
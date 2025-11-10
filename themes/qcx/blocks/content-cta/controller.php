<?php

use Timber\Timber;

acf_setup_meta($block["data"], $block["id"], true);

$context = Timber::context([
    "block" => $block,
    "fields" => get_field("block"),
    "heading" => get_field("cc_heading", "option"),
    "paragraph" => get_field("cc_paragraph", "option"),
    "cta" => get_field("cc_cta", "option")
]);

$context["block"]["slug"] = preg_replace('/^acf\//', '', $block["name"]);

acf_reset_meta($block["id"]);

Timber::render("./template.twig", $context);

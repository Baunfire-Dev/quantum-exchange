<?php
use Timber\Timber;

acf_setup_meta($block["data"], $block["id"], true);

$context = Timber::context([
  "block" => $block,
  "fields" => get_field("block"),
  "single_bg" => get_field("content_framed_cta_single_bg", "option"),
  "grid_bg" => get_field("content_framed_cta_grid_bg", "option")
]);

$context["block"]["slug"] = preg_replace('/^acf\//', '', $block["name"]);

acf_reset_meta($block["id"]);

Timber::render("./template.twig", $context);
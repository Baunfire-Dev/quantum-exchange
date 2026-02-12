<?php
use Timber\Timber;

acf_setup_meta($block["data"], $block["id"], true);

$context = Timber::context([
  "block" => $block,
  "fields" => get_field("block"),
  "stylesheet" => get_template_directory_uri() . '/assets/css/bundles/styles.css'
]);

$context["block"]["slug"] = sanitize_title($block["title"]);

acf_reset_meta($block["id"]);


Timber::render("./template.twig", $context);
<?php

/**
 * The template for displaying 404 pages (not found)
 *
 * @link https://codex.wordpress.org/Creating_an_Error_404_Page
 *
 * @package qcx
 */
?>

<?php get_header();

use Timber\Timber;

$context = Timber::context([
    "nt_heading" => get_field("404_heading", "option"),
    "nt_description" => get_field("404_description", "option"),
    "nt_media_type" => get_field("404_media_type", "option"),
    "nt_image" => get_field("404_media_image", "option"),
    "nt_video" => get_field("404_media_video", "option"),
    "nt_cta" => get_field("404_cta", "option"),
]);
?>

<main>
    <?php Timber::render("./partials/404.twig", $context); ?>
</main>

<?php get_footer(); ?>
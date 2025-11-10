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
    "nf_heading" => get_field("nf_heading", "option"),
    "nf_cta_text" => get_field("nf_cta_text", "option"),
]);
?>

<main>
    <?php Timber::render("./partials/404.twig", $context); ?>
</main>

<?php get_footer(); ?>
<?php

/**
 * The template for displaying all single posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package qcx
 */

get_header();
?>


<?php
/**
 * Single Post – 1:1 layout
 * BG: #F7F9FB
 * Wrapper: max 1440, px 64, py 80, flex-col, gap 80
 * Left: back/date, title/author, share row
 * Right: featured image (aspect 616/475.84, max-h 475.836, r-8)
 */

get_header();
?>

<?php
get_template_part('components/single-hero');
get_template_part('components/content');
Timber::render('components/newsletter.twig');
get_template_part('components/related-insights');
get_template_part('components/content-cta'); //need to update
?>




<?php get_footer(); ?>
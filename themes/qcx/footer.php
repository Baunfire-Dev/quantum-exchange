<?php

/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package qcx
 */

use Timber\Timber;

$context = Timber::context([
    "footer_form_label" => get_field("footer_form_label", "option"),
    "footer_form_shorcode" => get_field("footer_form", "option"),
    "footer_social" => get_field("footer_social", "option"),
    "primary_footer_nav_column" => get_field("primary_footer_nav_column", "option"),
    "secondary_footer_nav_item" => get_field("secondary_footer_nav_item", "option"),
    "footer_credits" => get_field("footer_credits", "option"),
]);
?>

<?php Timber::render("./partials/nav-footer.twig", $context); ?>
<?php wp_footer(); ?>

<?php
if (have_rows('footer_scripts', 'option')) {
    while (have_rows('footer_scripts', 'option')) {
        the_row();
        echo get_sub_field('script');
    }
}
?>

</body>

</html>
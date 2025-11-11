<?php

/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package qcx
 */
?>

<!doctype html>
<html <?php language_attributes(); ?>>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="theme-color" content="<?= get_field("theme_color", "option") ?>">

    <script type="text/javascript">
        const templateURL = '<?= get_template_directory_uri(); ?>';
        history.scrollRestoration = "manual";
    </script>

    <?php wp_head(); ?>

    <?php
    if (have_rows('header_scripts', 'option')) {
        while (have_rows('header_scripts', 'option')) {
            the_row();
            echo get_sub_field('script');
        }
    }
    ?>
</head>

<body <?php body_class(); ?>>
    <?php
    if (have_rows('body_scripts', 'option')) {
        while (have_rows('body_scripts', 'option')) {
            the_row();
            echo get_sub_field('script');
        }
    }
    ?>

    <?php
    use Timber\Timber;

    $context = Timber::context([
        "header_nav_item" => get_field("header_nav_item", "option"),
        "override_nav_theme" => get_field("override_nav_theme"),
        "nav_theme" => get_field("nav_theme"),
    ]);

    Timber::render("./partials/nav-header.twig", $context); ?>
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

<?php get_header();

use Timber\Timber;
use Timber\PostQuery;

$search_term = get_search_query();
$context = Timber::context([]);

if ($search_term) {
    $total_found = $GLOBALS['wp_query']->found_posts;
    $results = Timber::get_posts($GLOBALS['wp_query']);

    $context = Timber::context([
        "search_term" => $search_term,
        "total_found" => $total_found,
        "results" => $results,
        "post_types" => [
            'news' => ['label' => 'News & Resources', 'tax' => 'news_category'],
            'blog_podcast' => ['label' => 'Blogs & Podcasts', 'tax' => 'blog_podcast_category'],
            'media_coverage' => ['label' => 'Media Coverage', 'tax' => 'media_coverage_category'],
            'resource_library' => ['label' => 'Resource Library', 'tax' => 'resource_library_category'],
            'press_release' => ['label' => 'Press Releases', 'tax' => 'press_release_category'],
            'webinar_event' => ['label' => 'Webinars & Events', 'tax' => 'webinar_event_category'],
            'award' => ['label' => 'Awards', 'tax' => 'award_category']
        ]
    ]);
}
?>

<main>
    <?php Timber::render("./partials/search.twig", $context); ?>
</main>

<?php get_footer(); ?>
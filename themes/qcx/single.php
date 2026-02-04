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

<main class="rs">
    <?php

    use Timber\Timber;

    $post_id = get_the_ID();
    $title = get_the_title($post_id);
    $type = get_post_type($post_id);

    $post_author = get_field("resource_author", $post_id);
    $default_author = get_field("default_author", "option");

    if (!$post_author) {
        $post_author = $default_author;
    }

    $context = Timber::context([
        "title" => $title,
        "date" => get_the_date('d M Y', $post_id),
        "author" => get_the_title($post_author),
        "feature_image" => get_post_thumbnail_id($post_id),
        "share_title" => rawurlencode($title),
        "share_link" => rawurlencode(get_the_permalink($post_id)),
        "cc_heading" => get_field("cc_heading", "option"),
        "cc_paragraph" => get_field("cc_paragraph", "option"),
        "cc_cta" => get_field("cc_cta", "option"),
        "sc_heading" => get_field("sc_title", "option"),
        "sc_paragraph" => get_field("sc_paragraph", "option"),
        "sc_form_shortcode" => get_field("sc_form_shortcode", "option"),
        "back_cta" => get_field($type . "_back_cta", "option")
    ]);

    $post_types = [
        'news' => ['label' => 'News & Resources', 'tax' => 'news_category'],
        'blog_podcast' => ['label' => 'Blogs & Podcasts', 'tax' => 'blog_podcast_category'],
        'media_coverage' => ['label' => 'Media Coverage', 'tax' => 'media_coverage_category'],
        'resource_library' => ['label' => 'Resource Library', 'tax' => 'resource_library_category'],
        'press_release' => ['label' => 'Press Releases', 'tax' => 'press_release_category'],
        'webinar_event' => ['label' => 'Webinars & Events', 'tax' => 'webinar_event_category'],
        'award' => ['label' => 'Awards', 'tax' => 'award_category']
    ];

    if (isset($post_types[$type])) {
        $taxonomy = $post_types[$type]['tax'];
        $terms = wp_get_post_terms($post_id, $taxonomy, ['fields' => 'ids']);

        if (!empty($terms) && !is_wp_error($terms)) {
            $args = [
                'post_type' => $type,
                'posts_per_page' => 3,
                'post__not_in' => [$post_id],
                'tax_query' => [
                    [
                        'taxonomy' => $taxonomy,
                        'field' => 'term_id',
                        'terms' => $terms,
                    ],
                ],
            ];

            $related_posts = Timber::get_posts($args);
            $context['related_posts'] = $related_posts;
            $context['post_type_label'] = $post_types[$type]['label'];
        }
    }

    Timber::render("./components/resource-head.twig", $context);
    Timber::render("./components/resource-body.twig", $context);
    Timber::render("./components/resource-foot.twig", $context);
    ?>
</main>

<?php get_footer(); ?>
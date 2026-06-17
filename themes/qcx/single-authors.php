<?php
get_header();
?>

<main class="rs">
    <?php

    use Timber\Timber;

    $post_id = get_the_ID();
    $meta_query_val = get_field("default_author", "option");

    $context = Timber::context([
        "title" => get_the_title(),
        "cc_heading" => get_field("cc_heading", "option"),
        "cc_paragraph" => get_field("cc_paragraph", "option"),
        "cc_cta" => get_field("cc_cta", "option"),
    ]);

    $source_id = $post_id;

    $is_team_member = get_field("is_team_member", $post_id);
    $team = get_field("team", $post_id);
    $image = get_field("image", $source_id);

    if ($is_team_member && $team) {
        $meta_query_val = $post_id;
        $source_id = $team;
        $image = get_the_post_thumbnail_url($source_id, 'large');
    }

    $position = get_field("position", $source_id);
    $linkedin = get_field("linkedin", $source_id);
    $description = get_field("description", $source_id);

    $context['image'] = $image;
    $context['position'] = $position;
    $context['linkedin'] = $linkedin;
    $context['description'] = $description;

    $post_types = [
        'news' => ['label' => 'News & Resources', 'tax' => 'news_category'],
        'blog_podcast' => ['label' => 'Blogs & Podcasts', 'tax' => 'blog_podcast_category'],
        'media_coverage' => ['label' => 'Media Coverage', 'tax' => 'media_coverage_category'],
        'press_release' => ['label' => 'Press Releases', 'tax' => 'press_release_category'],
        'webinar_event' => ['label' => 'Webinars & Events', 'tax' => 'webinar_event_category'],
        'award' => ['label' => 'Awards', 'tax' => 'award_category'],
    ];

    $posts = Timber::get_posts([
        'post_type' => array_keys($post_types),
        'posts_per_page' => -1,
        'post_status' => 'publish',
        'order' => 'DESC',
        'meta_query' => [
            [
                'key' => 'resource_author',
                'value' => $meta_query_val,
                'compare' => '=',
            ],
        ],
    ])->to_array();

    usort($posts, fn($a, $b) => strtotime($b->post_date) - strtotime($a->post_date));

    $context['posts'] = $posts;
    $context['types'] = $post_types;

    Timber::render("./components/author-head.twig", $context);
    Timber::render("./components/author-body.twig", $context);
    Timber::render("./components/author-foot.twig", $context);
    ?>
</main>

<?php get_footer(); ?>
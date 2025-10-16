<?php 

add_action('init', function() {
    // Add template only after post type is registered
    $post_type = 'post-author';

    // Define the Gutenberg template
    $template = [
        ['acf/hero-author'],
        ['acf/author-resources'],
        ['acf/content-cta']
    ];

    // Assign the template to the post type
    $post_type_object = get_post_type_object($post_type);
    if ($post_type_object) {
        $post_type_object->template = $template;
    }
});
<?php

function limit_search_to_post_types($query)
{
    if ($query->is_search() && $query->is_main_query() && !is_admin()) {
        $query->set('post_type', [
            'page', 
            'news',
            'award',
            'blog_podcast',
            'media_coverage',
            'resource_library',
            'press_release',
            'webinar_event'
        ]);

        $query->set('posts_per_page', -1);
    }
}

add_action('pre_get_posts', 'limit_search_to_post_types');
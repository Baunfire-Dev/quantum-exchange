<?php
add_filter('acf/load_field/key=field_68f803345490b', 'populate_videos_select_field');

function populate_videos_select_field($field) {
    $transient_key = 'acf_videos_select_options';
    $choices = get_transient($transient_key);
    
    if (false === $choices) {
        $choices = array();
        
        $videos = get_posts(array(
            'post_type' => 'videos',
            'posts_per_page' => -1,
            'orderby' => 'date',
            'order' => 'DESC',
            'post_status' => 'publish',
            'no_found_rows' => true,
            'update_post_meta_cache' => false,
            'update_post_term_cache' => false
        ));
        
        if ($videos) {
            foreach ($videos as $video) {
                $choices[$video->ID] = $video->post_title;
            }
        }
        
        set_transient($transient_key, $choices, 12 * HOUR_IN_SECONDS);
    }
    
    $field['choices'] = $choices;
    
    return $field;
}

add_action('save_post_videos', 'clear_videos_select_cache');
add_action('delete_post', 'clear_videos_select_cache');

function clear_videos_select_cache($post_id) {
    if (get_post_type($post_id) === 'videos') {
        delete_transient('acf_videos_select_options');
    }
}

function get_latest_videos($count = 5) {
    $cache_key = 'latest_videos_' . $count;
    $videos = wp_cache_get($cache_key, 'videos_carousel');
    
    if (false === $videos) {
        $videos = get_posts(array(
            'post_type' => 'videos',
            'posts_per_page' => $count,
            'orderby' => 'date',
            'order' => 'DESC',
            'post_status' => 'publish',
            'suppress_filters' => false,
            'no_found_rows' => true,
            'update_post_meta_cache' => false,
            'update_post_term_cache' => false
        ));
        
        wp_cache_set($cache_key, $videos, 'videos_carousel', 3600);
    }
    
    return $videos;
}

add_action('save_post_videos', 'clear_latest_videos_cache');
function clear_latest_videos_cache($post_id) {
    if (get_post_type($post_id) === 'videos') {
        wp_cache_delete('latest_videos_5', 'videos_carousel');
        wp_cache_delete('latest_videos_10', 'videos_carousel');
    }
}

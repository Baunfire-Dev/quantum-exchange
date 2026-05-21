<?php

define('TRANSIENT_PREFIX', 'qxc');
define('TRANSIENT_DURATION', 7 * DAY_IN_SECONDS);

$post_type_transient_map = [
    'all'             => ['all_grid_resource'],
    'news'            => ['news_grid_resource'],
    'award'           => ['award_grid_resource'],
    'blog_podcast'    => ['blog_podcast_grid_resource'],
    'media_coverage'  => ['media_coverage_grid_resource'],
    'press_release'   => ['press_release_grid_resource'],
    'webinar_event'   => ['webinar_event_grid_resource'],
    'team'            => ['team_grid_resource'],
];

function clear_transients(array $transient_names = [])
{
    global $wpdb;

    if (wp_using_ext_object_cache()) {
        if (empty($transient_names)) {
            wp_cache_flush();
        } else {
            foreach ($transient_names as $name) {
                delete_transient(TRANSIENT_PREFIX . '_' . $name);
            }
        }
    }

    if (empty($transient_names)) {
        $like = $wpdb->esc_like('_transient_' . TRANSIENT_PREFIX . '_') . '%';

        return $wpdb->query(
            $wpdb->prepare(
                "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s",
                $like,
                str_replace('_transient_', '_transient_timeout_', $like)
            )
        );
    }

    foreach ($transient_names as $name) {
        $transient_full    = '_transient_' . TRANSIENT_PREFIX . '_' . $name;
        $transient_timeout = '_transient_timeout_' . TRANSIENT_PREFIX . '_' . $name;

        $wpdb->delete($wpdb->options, ['option_name' => $transient_full]);
        $wpdb->delete($wpdb->options, ['option_name' => $transient_timeout]);
    }
}

function get_all_transients()
{
    global $wpdb;

    $prefix     = TRANSIENT_PREFIX;
    $transients = [];
    $like       = $wpdb->esc_like('_transient_' . $prefix . '_') . '%';

    $db_transients = $wpdb->get_results(
        $wpdb->prepare(
            "SELECT option_name, option_value FROM {$wpdb->options} WHERE option_name LIKE %s",
            $like
        )
    );

    foreach ($db_transients as $transient) {
        $key              = str_replace('_transient_', '', $transient->option_name);
        $transients[$key] = [
            'key'    => $key,
            'value'  => maybe_unserialize($transient->option_value),
            'source' => 'database',
        ];
    }

    if (wp_using_ext_object_cache()) {
        $cache_keys = wp_cache_get($prefix . '_index', $prefix . '_transients');

        if (is_array($cache_keys)) {
            foreach ($cache_keys as $cache_key) {
                if (isset($transients[$cache_key])) {
                    continue;
                }

                $value = wp_cache_get($cache_key, $prefix . '_transients');

                if ($value !== false) {
                    $transients[$cache_key] = [
                        'key'    => $cache_key,
                        'value'  => $value,
                        'source' => 'object_cache',
                    ];
                }
            }
        }
    }

    return $transients;
}

add_action('admin_menu', function () {
    add_menu_page(
        'Transients',
        'Transients',
        'manage_options',
        'clear-' . TRANSIENT_PREFIX . '-transients',
        'clear_transients_callback',
        menu_icon(),
        90
    );
});

function clear_transients_callback()
{
    $prefix = TRANSIENT_PREFIX;

    if (isset($_POST['clear_transients']) && check_admin_referer('clear_transients_action')) {
        clear_transients();
        echo '<div class="notice notice-success is-dismissible"><p>' . ucfirst($prefix) . ' transients cleared!</p></div>';
    }

    echo '<div class="wrap">';
    echo '<h1>' . ucfirst($prefix) . ' Transients</h1>';

    if (wp_using_ext_object_cache()) {
        echo '<div class="notice notice-info"><p><strong>Object Cache Active:</strong> This server is using Redis/Memcached. Transients are stored in memory cache, not the database.</p></div>';
    }

    echo '<form method="post">';
    wp_nonce_field('clear_transients_action');
    echo '<p><input type="submit" name="clear_transients" class="button button-primary" value="Clear All ' . ucfirst($prefix) . ' Transients"></p>';
    echo '</form>';

    $all_transients = get_all_transients();

    if (!empty($all_transients)) {
        echo '<h2>Found Transients</h2>';
        echo '<table class="widefat striped">';
        echo '<thead><tr><th>Transient Name</th><th>Source</th><th>Value (Truncated)</th></tr></thead>';
        echo '<tbody>';

        foreach ($all_transients as $transient) {
            $value = $transient['value'];

            if (is_scalar($value)) {
                $truncated = wp_trim_words((string) $value, 20);
            } elseif (is_array($value) || is_object($value)) {
                $count     = is_array($value) ? count($value) : count((array) $value);
                $truncated = 'Array/Object (' . $count . ' items)';
            } else {
                $truncated = '<pre style="max-height: 40px; overflow: hidden;">' . esc_html(print_r($value, true)) . '</pre>';
            }

            $source_badge = $transient['source'] === 'object_cache'
                ? '<span style="background: #00a0d2; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">REDIS</span>'
                : '<span style="background: #82878c; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px;">DB</span>';

            echo '<tr>';
            echo '<td><code>' . esc_html($transient['key']) . '</code></td>';
            echo '<td>' . $source_badge . '</td>';
            echo '<td>' . $truncated . '</td>';
            echo '</tr>';
        }

        echo '</tbody></table>';
    } else {
        echo '<div class="notice notice-warning"><p>No transients found with prefix <code>' . esc_html($prefix) . '_</code>.</p></div>';
    }

    echo '</div>';
}

add_action('save_post', function ($post_id, $post, $update) use ($post_type_transient_map) {
    if (wp_is_post_autosave($post_id) || wp_is_post_revision($post_id)) {
        return;
    }

    if (!isset($post_type_transient_map[$post->post_type])) {
        return;
    }

    $transients_to_clear = $post_type_transient_map[$post->post_type];

    if (!in_array('all_grid_resource', $transients_to_clear, true)) {
        $transients_to_clear[] = 'all_grid_resource';
    }

    clear_transients($transients_to_clear);
}, 10, 3);

$clear_transients_on_post_delete = function ($post_id) use ($post_type_transient_map) {
    $post = get_post($post_id);

    if (!$post || !isset($post_type_transient_map[$post->post_type])) {
        return;
    }

    $transients_to_clear = $post_type_transient_map[$post->post_type];

    if (!in_array('all_grid_resource', $transients_to_clear, true)) {
        $transients_to_clear[] = 'all_grid_resource';
    }

    clear_transients($transients_to_clear);
};

add_action('wp_trash_post', $clear_transients_on_post_delete);
add_action('before_delete_post', $clear_transients_on_post_delete);
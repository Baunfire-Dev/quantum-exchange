<?php
define('TRANSIENT_PREFIX', 'qxc');
define('TRANSIENT_DURATION', 7 * DAY_IN_SECONDS);

$post_type_transient_map = [
    'news' => ['news_grid_resources'],
    'blog_podcast' => ['blog_podcast_grid_resources'],
    'media_coverage' => ['media_coverage_grid_resources'],
    'resource_library' => ['resource_library_grid_resources'],
    'press_release' => ['press_release_grid_resources'],
    'webinar_event' => ['webinar_event_grid_resources'],
];

function clear_transients(array $transient_names = []) {
    global $wpdb;

    if (empty($transient_names)) {
        $like = $wpdb->esc_like('_transient_' . TRANSIENT_PREFIX . '_') . '%';
        $sql = "
            DELETE FROM {$wpdb->options}
            WHERE option_name LIKE %s
            OR option_name LIKE %s
        ";

        return $wpdb->query(
            $wpdb->prepare(
                $sql,
                $like,
                str_replace('_transient_', '_transient_timeout_', $like)
            )
        );
    }

    foreach ($transient_names as $name) {
        $transient_full = '_transient_' . TRANSIENT_PREFIX . '_' . $name;
        $transient_timeout = '_transient_timeout_' . TRANSIENT_PREFIX . '_' . $name;

        $wpdb->delete($wpdb->options, ['option_name' => $transient_full]);
        $wpdb->delete($wpdb->options, ['option_name' => $transient_timeout]);
    }
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

function clear_transients_callback() {
    global $wpdb;
    $prefix = TRANSIENT_PREFIX;

    if (isset($_POST['clear_transients']) && check_admin_referer('clear_transients_action')) {
        clear_transients();
        echo '<div class="notice notice-success is-dismissible"><p>' . ucfirst($prefix) . ' transients cleared!</p></div>';
    }

    $like = $wpdb->esc_like('_transient_' . $prefix . '_') . '%';
    $transients = $wpdb->get_results(
        $wpdb->prepare("
            SELECT option_name, option_value 
            FROM {$wpdb->options}
            WHERE option_name LIKE %s
        ", $like)
    );

    echo '<div class="wrap">';
    echo '<h1>' . ucfirst($prefix) . ' Transients</h1>';

    echo '<form method="post">';
    wp_nonce_field('clear_transients_action');
    echo '<p><input type="submit" name="clear_transients" class="button button-primary" value="Clear All ' . ucfirst($prefix) . ' Transients"></p>';
    echo '</form>';

    if (!empty($transients)) {
        echo '<table class="widefat striped">';
        echo '<thead><tr><th>Transient Name</th><th>Value (Truncated)</th></tr></thead>';
        echo '<tbody>';
        foreach ($transients as $transient) {
            $name = str_replace('_transient_', '', $transient->option_name);
            $value = maybe_unserialize($transient->option_value);
            if (is_scalar($value)) {
                $truncated = wp_trim_words((string)$value, 20);
            } else {
                $truncated = '<pre style="max-height: 40px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;max-width: 600px;">' . esc_html(print_r($value, true)) . '</pre>';
            }
            echo '<tr>';
            echo '<td><code>' . esc_html($name) . '</code></td>';
            echo '<td>' . $truncated . '</td>';
            echo '</tr>';
        }
        echo '</tbody></table>';
    } else {
        echo '<p>No transients found starting with <code>' . esc_html($prefix) . '_</code>.</p>';
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
    clear_transients($transients_to_clear);
}, 10, 3);

<?php
use Timber\Timber;

/**
 * Hero Resources Landing Block
 */

acf_setup_meta($block['data'], $block['id'], true);

$ctx = Timber::context([
  'block'  => $block,
  'fields' => get_field('block') ?: []
]);

// Normalize slug
$ctx['block']['slug'] = preg_replace('/^acf\//', '', $block['name'] ?? '');

// --- Helper: normalize ACF Post Object to a Timber\Post (or null) ---
$to_post = function ($raw) {
    if (!$raw) return null;

    // ACF can return: post ID, WP_Post object, or array with 'ID'/'id'
    if (is_numeric($raw)) {
        return Timber::get_post((int)$raw);
    }
    if (is_object($raw) && isset($raw->ID)) {
        return Timber::get_post((int)$raw->ID);
    }
    if (is_array($raw)) {
        $id = $raw['ID'] ?? $raw['id'] ?? null;
        if ($id) return Timber::get_post((int)$id);
    }
    // Fallback (Timber::get_post can sometimes coerce)
    return Timber::get_post($raw) ?: null;
};

// Extract posts
$raw1 = $ctx['fields']['featured_post_1'] ?? null;
$raw2 = $ctx['fields']['featured_post_2'] ?? null;

$ctx['post1'] = $to_post($raw1);
$ctx['post2'] = $to_post($raw2);

// Get first category terms (taxonomy is still 'category')
$get_first_cat = function ($post) {
    if (!$post) return null;
    // Using WP core for maximum compatibility
    $terms = get_the_terms($post->ID, 'category');
    if (is_wp_error($terms) || empty($terms)) return null;
    // Ensure it's an array and reindex
    $terms = array_values($terms);
    return $terms[0] ?? null;
};

$ctx['post1_cat'] = $get_first_cat($ctx['post1']);
$ctx['post2_cat'] = $get_first_cat($ctx['post2']);

acf_reset_meta($block['id']);

Timber::render(__DIR__ . '/template.twig', $ctx);

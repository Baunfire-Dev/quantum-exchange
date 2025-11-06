<?php
use Timber\Timber;

/**
 * Block Name: Partner Grid
 * Description: Displays partners with category filters and load more button.
 */

acf_setup_meta($block['data'], $block['id'], true);

$ctx = Timber::context();
$ctx['block']  = $block;
$ctx['fields'] = get_field('block') ?: [];

// --- Config ---
$ctx['pg'] = [
  'post_type'     => 'partner',
  'tax'           => 'partner_category',
  'ppp'           => 9,
];

// --- Initial Query ---
$initial = new WP_Query([
  'post_type'      => $ctx['pg']['post_type'],
  'post_status'    => 'publish',
  'posts_per_page' => $ctx['pg']['ppp'],
  'paged'          => 1,
]);
$ctx['partners'] = Timber::get_posts($initial);
wp_reset_postdata();

// --- Taxonomy Terms for Buttons ---
$terms = get_terms([
  'taxonomy'   => $ctx['pg']['tax'],
  'hide_empty' => false,
]);
$ctx['partner_terms'] = (!is_wp_error($terms)) ? $terms : [];

// --- Nonce for AJAX ---
$ctx['pg_nonce'] = wp_create_nonce('pg_nonce');

acf_reset_meta($block['id']);

Timber::render(__DIR__ . '/template.twig', $ctx);

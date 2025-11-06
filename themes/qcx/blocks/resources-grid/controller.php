<?php
use Timber\Timber;

/**
 * Resource Grid (V1) — Controller
 * - Post type: blogs (WP default 'post')
 * - Parent/Child taxonomy: both 'category' (blog categories)
 */

acf_setup_meta($block['data'], $block['id'], true);

$ctx = Timber::context();
$ctx['block']  = $block;
$ctx['fields'] = get_field('block') ?: [];

// Choose design (we’re doing V1 now but keep the flag)
$design = $ctx['fields']['design_variation'] ?? 'V1';

// Config that flows to the template data-attributes
$ctx['rg'] = [
    'post_type'     => 'post',      // <<< if your items live in a CPT, change this
    'tax_type'      => 'category',  // parent taxonomy
    'tax_category'  => 'category',  // child taxonomy (also category here)
    'ppp'           => 9,
    'design'        => $design,
];

// First render (server-side) so page isn’t empty
$initial = new WP_Query([
    'post_type'      => $ctx['rg']['post_type'],
    'post_status'    => 'publish',
    'posts_per_page' => $ctx['rg']['ppp'],
    'paged'          => 1,
]);
$ctx['resources'] = Timber::get_posts($initial);
wp_reset_postdata();

// Parent terms for the “Type” menu (top-level categories)
$parents = get_terms([
    'taxonomy'   => $ctx['rg']['tax_type'],
    'hide_empty' => false,
    'parent'     => 0,
]);
$ctx['type_terms'] = (!is_wp_error($parents)) ? $parents : [];

// Nonce
$ctx['rg_nonce'] = wp_create_nonce('rg_nonce');

acf_reset_meta($block['id']);

Timber::render(__DIR__ . '/template.twig', $ctx);

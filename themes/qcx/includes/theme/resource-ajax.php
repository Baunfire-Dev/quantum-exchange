<?php 
/**
 * ---------- Resource Grid AJAX ----------
 * Actions:
 *  - rg_filter:     returns items HTML + has_more flag
 *  - rg_categories: returns child terms for a chosen parent term
 */

add_action('wp_ajax_rg_filter',           'qcx_rg_filter');
add_action('wp_ajax_nopriv_rg_filter',    'qcx_rg_filter');

add_action('wp_ajax_rg_categories',       'qcx_rg_categories');
add_action('wp_ajax_nopriv_rg_categories','qcx_rg_categories');

/**
 * Locate the shared Twig partial for a resource card.
 * Priority: Child theme -> Parent theme
 */
function qcx_rg_locate_item_twig() {
    $candidates = array(
        trailingslashit(get_stylesheet_directory()) . 'blocks/resources-grid/_item.twig',
        trailingslashit(get_template_directory())   . 'blocks/resources-grid/_item.twig',
    );
    foreach ($candidates as $path) {
        if (is_readable($path)) return $path;
    }
    return null; // not found
}

/**
 * Render a single item with Timber using blocks/resources-grid/_item.twig
 * Expects the twig to use variables: r (Timber\Post), rg_tax (taxonomy slug)
 */
function qcx_rg_render_item_with_twig($post, $rg_tax, $item_twig_path) {
    if (!class_exists('Timber\Timber')) return null;
    if (!$item_twig_path || !is_readable($item_twig_path)) return null;

    try {
        $ctx = Timber\Timber::context();
        $ctx['r']      = new Timber\Post($post);
        $ctx['rg_tax'] = $rg_tax;
        return Timber\Timber::compile($item_twig_path, $ctx);
    } catch (\Throwable $e) {
        return null; // fall back to PHP if twig rendering fails
    }
}

/**
 * AJAX: Filter + paginate items
 */
function qcx_rg_filter() {
    check_ajax_referer('rg_nonce', 'nonce');

    $post_type = sanitize_key($_POST['post_type'] ?? 'post');
    $ppp       = max(1, intval($_POST['ppp'] ?? 9));
    $page      = max(1, intval($_POST['page'] ?? 1));

    $tax_type  = sanitize_key($_POST['tax_type'] ?? 'category'); // parent taxonomy
    $tax_cat   = sanitize_key($_POST['tax_cat']  ?? 'category'); // child taxonomy (this is your rg_tax in twig)
    $type_id   = intval($_POST['type_id'] ?? 0);                 // parent term_id
    $cat_id    = intval($_POST['cat_id']  ?? 0);                 // child term_id

    // UPDATED: map "all" to all CPTs + blog
    $all_types = array(
        'news','award','blog_podcast','media_coverage','resource_library',
        'press_release','webinar_event','team','post'
    );

    $args = array(
        'post_status'    => 'publish',
        'posts_per_page' => $ppp,
        'paged'          => $page,
    );

    if ($post_type === 'all') {
        $args['post_type'] = $all_types;
    } else {
        $args['post_type'] = $post_type;
    }

    // Build tax_query
    $tax_query = array();
    if ($type_id && taxonomy_exists($tax_type)) {
        $tax_query[] = array(
            'taxonomy'         => $tax_type,
            'field'            => 'term_id',
            'terms'            => array($type_id),
            'include_children' => true,
            'operator'         => 'IN',
        );
    }
    if ($cat_id && $tax_cat && taxonomy_exists($tax_cat)) {
        $tax_query[] = array(
            'taxonomy'         => $tax_cat,
            'field'            => 'term_id',
            'terms'            => array($cat_id),
            'include_children' => false,
            'operator'         => 'IN',
        );
    }
    if (!empty($tax_query)) {
        $args['tax_query'] = (count($tax_query) > 1)
            ? array_merge(array('relation' => 'AND'), $tax_query)
            : $tax_query;
    }

    $q = new WP_Query($args);

    // Try to render via the shared Twig partial
    $item_twig_path = qcx_rg_locate_item_twig();

    ob_start();
    if ($q->have_posts()) :
        while ($q->have_posts()) : $q->the_post();
            // Preferred: render with Twig
            $rendered = qcx_rg_render_item_with_twig(get_post(), $tax_cat, $item_twig_path);

            if ($rendered !== null) {
                echo $rendered;
                continue;
            }

            // Fallback: PHP card markup
            $label = 'ARTICLE';

            // UPDATED: only query terms if taxonomy exists/non-empty; decode entities for clean display
            if ($tax_cat && taxonomy_exists($tax_cat)) {
                $t = get_the_terms(get_the_ID(), $tax_cat);
                if (!is_wp_error($t) && !empty($t)) {
                    $t = array_values($t);
                    $label = strtoupper( html_entity_decode( $t[0]->name ) );
                }
            }

            ?>
            <article data-rg-item
            class="video-item group relative flex flex-col ~gap-[2rem]/[3rem] ~p-[1.25rem]/[2rem] border border-[#D9D9D9] rounded-[0.5rem] bg-[#F7F9FB] overflow-hidden">

            <!-- Invisible link overlay (full-card click) -->
            <a href="<?php the_permalink(); ?>" class="absolute inset-0 z-[1]" aria-label="<?php the_title_attribute(); ?>"></a>

            <div class="relative flex flex-col gap-[1.5rem] z-20">
                <div class="flex items-center gap-[0.5rem]">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="10" height="10" rx="2" fill="#08E8BD"/>
                </svg>
                <p class="eyebrow uppercase overline-r">
                    <?php echo !empty($label) ? esc_html($label) : 'BLOG'; ?>
                </p>
                </div>

                <!-- Title adopts hover color via .group -->
                <p class="lg leading-[1.1] transition-colors duration-200 group-hover:text-[#08E8BD]">
                <?php the_title(); ?>
                </p>
            </div>

            <div class="video-wrapper relative w-full h-[17.2356rem] overflow-hidden rounded-[0.5rem] z-0">
                <?php if (has_post_thumbnail()) : ?>
                <?php echo get_the_post_thumbnail(get_the_ID(), 'large', array(
                    'class' => 'w-full h-full object-cover transition-transform duration-300'
                )); ?>
                <?php endif; ?>
            </div>
            </article>
            <?php
        endwhile;
        wp_reset_postdata();
    endif;

    $html = trim(ob_get_clean());

    wp_send_json(array(
        'html'     => $html,
        'has_more' => ($q->max_num_pages > $page),
        'page'     => $page,
    ));
}

/**
 * AJAX: Return child terms of the selected parent (for the Category dropdown)
 */
function qcx_rg_categories() {
    check_ajax_referer('rg_nonce', 'nonce');

    $tax_type = sanitize_key($_POST['tax_type'] ?? 'category'); // taxonomy slug
    $type_id  = intval($_POST['type_id'] ?? 0);                  // parent term id

    $children = get_terms(array(
        'taxonomy'   => $tax_type,
        'hide_empty' => false,
        'parent'     => $type_id,
    ));

    $cats = array();
    if (!is_wp_error($children) && !empty($children)) {
        foreach ($children as $c) {
            $cats[] = array(
                'term_id' => $c->term_id,
                // UPDATED: decode to avoid showing &amp; in UI
                'name'    => html_entity_decode($c->name),
            );
        }
    }

    wp_send_json(array('cats' => $cats));
}

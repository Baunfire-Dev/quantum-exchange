<?php
/**
 * Register Partners post type + taxonomy
 */

add_action('init', function () {
    // === Register Post Type ===
    register_post_type('partner', [
        'label'              => 'Partners',
        'labels'             => [
            'name'               => __('Partners'),
            'singular_name'      => __('Partner'),
            'menu_name'          => __('Partners'),
            'add_new'            => __('Add New'),
            'add_new_item'       => __('Add New Partner'),
            'edit_item'          => __('Edit Partner'),
            'new_item'           => __('New Partner'),
            'view_item'          => __('View Partner'),
            'view_items'         => __('View Partners'),
            'search_items'       => __('Search Partners'),
            'not_found'          => __('No Partners found'),
            'not_found_in_trash' => __('No Partners found in Trash'),
        ],
        'public'             => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'show_in_rest'       => true, // ✅ Block editor support
        'menu_icon'          => 'dashicons-groups',
        'menu_position'      => 20,
        'has_archive'        => false,
        'rewrite'            => ['slug' => 'partners'],
        'supports'           => [
            'title',
            'editor',
            'thumbnail',
            'excerpt',
            'revisions',
            'custom-fields',
        ],
    ]);

    // === Register Custom Taxonomy ===
    register_taxonomy('partner_category', ['partner'], [
        'labels' => [
            'name'              => __('Partner Categories'),
            'singular_name'     => __('Partner Category'),
            'search_items'      => __('Search Partner Categories'),
            'all_items'         => __('All Partner Categories'),
            'parent_item'       => __('Parent Partner Category'),
            'parent_item_colon' => __('Parent Partner Category:'),
            'edit_item'         => __('Edit Partner Category'),
            'update_item'       => __('Update Partner Category'),
            'add_new_item'      => __('Add New Partner Category'),
            'new_item_name'     => __('New Partner Category Name'),
            'menu_name'         => __('Partner Categories'),
        ],
        'hierarchical'      => true, // behaves like post categories
        'public'            => true,
        'show_ui'           => true,
        'show_in_rest'      => true, // ✅ Gutenberg + ACF taxonomy field
        'show_admin_column' => true,
        'rewrite'           => ['slug' => 'partner-category'],
    ]);

    // Ensure supports can’t be stripped elsewhere
    add_post_type_support('partner', ['editor','thumbnail','excerpt','revisions','custom-fields']);
}, 0);


/**
 * Duplicate Partner Post
 */
add_action('admin_action_duplicate_partner_post', function () {
    global $wpdb;

    if (!isset($_GET['post']) || !($post_id = absint($_GET['post']))) {
        wp_die('No Partner ID to duplicate has been supplied!');
    }

    $post = get_post($post_id);

    if (!$post || $post->post_type !== 'partner') {
        wp_die('You can only duplicate Partner posts.');
    }

    // Duplicate post data
    $new_post_args = [
        'post_title'     => $post->post_title . ' (Copy)',
        'post_content'   => $post->post_content,
        'post_status'    => 'draft',
        'post_type'      => $post->post_type,
        'post_author'    => get_current_user_id(),
        'post_excerpt'   => $post->post_excerpt,
        'post_parent'    => $post->post_parent,
        'menu_order'     => $post->menu_order,
    ];

    $new_post_id = wp_insert_post($new_post_args);

    // Copy taxonomy terms
    $taxonomies = get_object_taxonomies($post->post_type);
    foreach ($taxonomies as $taxonomy) {
        $terms = wp_get_object_terms($post_id, $taxonomy, ['fields' => 'slugs']);
        wp_set_object_terms($new_post_id, $terms, $taxonomy, false);
    }

    // Copy all meta fields (including ACF)
    $meta = get_post_meta($post_id);
    foreach ($meta as $key => $values) {
        if ($key === '_wp_old_slug') continue;
        foreach ($values as $value) {
            add_post_meta($new_post_id, $key, maybe_unserialize($value));
        }
    }

    // Redirect to edit screen of the new post
    wp_redirect(admin_url('post.php?action=edit&post=' . $new_post_id));
    exit;
});

/**
 * Add "Duplicate" link in Partner list
 */
add_filter('post_row_actions', function ($actions, $post) {
    if ($post->post_type === 'partner' && current_user_can('edit_posts')) {
        $duplicate_link = wp_nonce_url(
            'admin.php?action=duplicate_partner_post&post=' . $post->ID,
            basename(__FILE__),
            'duplicate_nonce'
        );
        $actions['duplicate'] = '<a href="' . esc_url($duplicate_link) . '" title="Duplicate this Partner">Duplicate</a>';
    }
    return $actions;
}, 10, 2);

//partner
add_action('wp_ajax_pg_filter', 'pg_filter');
add_action('wp_ajax_nopriv_pg_filter', 'pg_filter');
function pg_filter() {
  check_ajax_referer('pg_nonce', 'nonce');
  $post_type = sanitize_text_field($_POST['post_type']);
  $ppp       = intval($_POST['ppp']);
  $page      = intval($_POST['page']);
  $cat       = intval($_POST['cat']);
  $tax       = sanitize_text_field($_POST['tax']);

  $args = [
    'post_type'      => $post_type,
    'post_status'    => 'publish',
    'posts_per_page' => $ppp,
    'paged'          => $page,
  ];
  if ($cat) {
    $args['tax_query'] = [[
      'taxonomy' => $tax,
      'field'    => 'term_id',
      'terms'    => $cat
    ]];
  }

  $q = new WP_Query($args);
  ob_start();
  if ($q->have_posts()) {
    while ($q->have_posts()) {
      $q->the_post();
      $post_id = get_the_ID();

      $cats = get_the_terms($post_id, 'partner_category');
      $cat_name = (!empty($cats) && !is_wp_error($cats)) ? esc_html($cats[0]->name) : 'Partner';
      $visit = get_field('visit_partner', $post_id);
      $brief = get_field('download_solutions_brief', $post_id);
      ?>

       <article data-pg-item
        class="video-item group relative flex flex-col gap-[1.5rem] p-[2rem] border border-[#D9D9D9] rounded-[0.5rem] bg-[#F7F9FB] overflow-hidden">

        <div class="flex items-center gap-[0.5rem]">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="10" height="10" rx="2" fill="#08E8BD"/>
          </svg>
          <p class="text-[12px] uppercase tracking-[1.2px] font-[500]"><?php echo $cat_name; ?></p>
        </div>

        <?php if (has_post_thumbnail($post_id)) : ?>
          <div class="relative w-full h-[10rem] flex justify-center items-center">
            <?php echo get_the_post_thumbnail($post_id, 'medium', ['class' => 'max-h-[6rem] w-auto object-contain']); ?>
          </div>
        <?php endif; ?>

        <div class="flex flex-col items-start gap-[0.75rem]">
          <p class="text-[24px] leading-[1.4] font-[400]"><?php echo esc_html(get_the_title()); ?></p>
          <p class="text-[18px] leading-[1.4] font-[400]"><?php echo esc_html(get_the_excerpt()); ?></p>
        </div>

        <div class="flex flex-col items-start gap-[0.75rem] mt-auto">
          <a href="<?php echo $visit_url; ?>" target="_blank"
             class="flex items-center gap-2 text-[12px] uppercase tracking-[1.2px] text-[#206EEC]">
            Visit Partner
            <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" fill="none">
              <path d="M0.707031 0.707153L4.70703 4.70715L0.707032 8.70715" stroke="#206EEC" stroke-linecap="square"/>
            </svg>
          </a>

          <?php if ($brief && isset($brief['url'])) : ?>
            <a href="<?php echo esc_url($brief['url']); ?>" target="_blank"
               class="flex items-center gap-2 text-[12px] uppercase tracking-[1.2px] text-[#206EEC]">
              Download Solution Brief
              <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" fill="none">
                <path d="M0.707031 0.707153L4.70703 4.70715L0.707032 8.70715" stroke="#206EEC" stroke-linecap="square"/>
              </svg>
            </a>
          <?php endif; ?>
        </div>
      </article>

      <?php
    }
  }
  $html = ob_get_clean();
  wp_send_json([
    'html' => $html,
    'page' => $page,
    'has_more' => ($q->found_posts > $ppp * $page),
  ]);
}

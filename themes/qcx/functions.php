<?php

/**
 * qcx functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package qcx
 */

// Ensure this file is being accessed within WordPress
if (!defined('ABSPATH')) {
    exit;
}

require_once 'vendor/autoload.php';
Timber\Timber::init();

define('_ENV', 'development');

if (!defined('_S_VERSION')) {
    if (_ENV == 'development')
        define('_S_VERSION', uniqid());
    else
        define('_S_VERSION', '1.0.0');
}

if (!function_exists('bf_setup')):
    function bf_setup()
    {
        add_theme_support('align-wide');
        add_theme_support('title-tag');
        add_theme_support('post-thumbnails');
    }
endif;

add_action('after_setup_theme', 'bf_setup');

require_once 'includes/theme/allow-file-types.php';
require_once 'includes/theme/disable-comments.php';

require_once 'includes/theme/setup-timber.php';
require_once 'includes/theme/setup-shortcodes.php';

require_once 'includes/theme/support-helpers.php';
require_once 'includes/theme/support-visual-overrides.php';

require_once 'includes/theme/support-videos.php';
// require_once 'includes/theme/support-transients.php';
// require_once 'includes/theme/support-block-templates.php';


require_once 'includes/theme/disable-native-blocks.php';
















/******************** LOAD CSS/JS ************************/
add_action('wp_enqueue_scripts', 'front_css_styles');
add_action('wp_enqueue_scripts', 'front_js_scripts');

add_action('admin_enqueue_scripts', 'back_css_styles');
add_action('admin_enqueue_scripts', 'back_js_scripts');

add_action('enqueue_block_editor_assets', 'enqueue_block_editor_scripts');


function front_css_styles()
{
    wp_enqueue_style('bf-normalize-style', get_template_directory_uri() . '/assets/css/theme/normalize.css', array(), _S_VERSION);
    wp_enqueue_style('bf-admin-bar-style', get_template_directory_uri() . '/assets/css/admin/bar.css', array(), _S_VERSION);
    wp_enqueue_style('bf-theme-style', get_template_directory_uri() . '/assets/css/theme/styles.css', array(), uniqid());
    wp_register_style('bf-lenis-style', get_template_directory_uri() . '/assets/css/external/lenis.css', array(), _S_VERSION);

    wp_register_style('bf-owl-style', get_template_directory_uri() . '/assets/css/external/owl.css', array(), _S_VERSION);
    wp_register_style('select-two-style', get_template_directory_uri() . '/assets/css/external/select2.min.css', array(), _S_VERSION);
    wp_register_style('bf-toastify-style', get_template_directory_uri() . '/assets/css/external/toastify.min.css', array(), _S_VERSION);
}

function front_js_scripts()
{
    wp_enqueue_script("bf-gsap-script", get_template_directory_uri() . '/assets/js/external/gsap.min.js', array('jquery'), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));
    wp_enqueue_script("bf-scroll-trigger-script", get_template_directory_uri() . '/assets/js/external/ScrollTrigger.min.js', array('jquery'), _S_VERSION, array('strategy' => 'defer', 'in_footer' => true));
    wp_enqueue_script("bf-scramble-text-script", get_template_directory_uri() . '/assets/js/external/ScrambleTextPlugin.min.js', array(), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));
    wp_enqueue_script("bf-scroll-to-script", get_template_directory_uri() . '/assets/js/external/ScrollToPlugin.min.js', array('jquery'), _S_VERSION, array('strategy' => 'defer', 'in_footer' => true));
    // wp_enqueue_script("bf-split-text-script", get_template_directory_uri() . '/assets/js/external/SplitText.min.js', array(), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));
    wp_enqueue_script("bf-lenis-script", get_template_directory_uri() . '/assets/js/external/lenis.min.js', array('jquery'), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));

    wp_register_script("bf-vimeo-script", get_template_directory_uri() . '/assets/js/external/vimeo-player.js', array('jquery'), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));

    wp_register_script('bf-owl-script', get_template_directory_uri() . '/assets/js/external/owl.min.js', array('jquery'), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));
    wp_register_script("select-two-script", get_template_directory_uri() . '/assets/js/external/select2.min.js', array(), _S_VERSION, array('strategy' => 'defer', 'in_footer' => true));
    wp_register_script("bf-toastify-script", get_template_directory_uri() . '/assets/js/external/toastify.js', array('jquery'), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));

    wp_enqueue_script("bf-custom-min-js", get_template_directory_uri() . '/assets/js/custom.min.js', array('jquery'), _S_VERSION, array('strategy'  => 'defer', 'in_footer' => true));
}

function back_css_styles($hook)
{
    wp_enqueue_style('bf-custom-admin-style', get_template_directory_uri() . '/assets/css/admin/styles.css', array(), _S_VERSION);

    if ($hook === 'post.php' || $hook === 'post-new.php') {
        // wp_enqueue_style('acfe-style', get_template_directory_uri() . '/assets/css/external/acfe.css', array(), _S_VERSION);
    }
}

function back_js_scripts($hook)
{
    if ($hook === 'post.php' || $hook === 'post-new.php') {
    }
}

function enqueue_block_editor_scripts()
{
    wp_enqueue_script('bf-block-preview-script', get_template_directory_uri() . '/assets/js/admin/block-preview.js', array('jquery'), _S_VERSION, true);
    wp_localize_script("bf-block-preview-script", 'theme_path', array('url' => get_template_directory_uri()));
}
















/******************** ACF ************************/
add_action('acf/init', 'my_acf_op_init');

function my_acf_op_init()
{
    if (function_exists('acf_add_options_page')) {
        acf_add_options_page(array(
            'menu_title' => 'Global Config',
            'menu_slug' => 'theme-general-settings',
            'capability' => 'manage_options',
            'redirect' => true,
            'icon_url' => menu_icon(),
        ));

        acf_add_options_sub_page(array(
            'page_title' => 'Theme Settings',
            'menu_title' => 'Theme Settings',
            'parent_slug' => 'theme-general-settings',
            'capability' => 'manage_options',
        ));

        acf_add_options_sub_page(array(
            'page_title' => 'Header Navigation',
            'menu_title' => 'Header Navigation',
            'parent_slug' => 'theme-general-settings',
            'capability' => 'manage_options',
        ));

        acf_add_options_sub_page(array(
            'page_title' => 'Footer Navigation',
            'menu_title' => 'Footer Navigation',
            'parent_slug' => 'theme-general-settings',
            'capability' => 'manage_options',
        ));

        acf_add_options_sub_page(array(
            'page_title' => 'Site Scripts',
            'menu_title' => 'Site Scripts',
            'parent_slug' => 'theme-general-settings',
            'capability' => 'manage_options',
        ));

        acf_add_options_sub_page(array(
            'page_title' => 'Extras',
            'menu_title' => 'Extras',
            'parent_slug' => 'theme-general-settings',
            'capability' => 'manage_options',
        ));

        acf_add_options_sub_page(array(
            'page_title' => '404',
            'menu_title' => '404',
            'parent_slug' => 'theme-general-settings',
            'capability' => 'manage_options',
        ));
    }
}

add_action('init', 'register_custom_blocks');

function register_custom_blocks()
{
    if (!function_exists('acf_register_block_type')) {
        return;
    }

    $theme_slug = get_field("theme_slug", "option");
    $theme_slug = $theme_slug ? $theme_slug : "baunfire";

    $blocks_dir = __DIR__ . '/blocks';

    if (!is_dir($blocks_dir) || !is_readable($blocks_dir)) {
        return;
    }

    foreach (scandir($blocks_dir) as $dir) {
        $block_path = $blocks_dir . '/' . $dir;

        if ($dir === '.' || $dir === '..' || !is_dir($block_path)) {
            continue;
        }

        $block_json = $block_path . '/block.json';
        if (!file_exists($block_json)) {
            continue;
        }

        register_block_type($block_path, [
            'category' => $theme_slug,
            'icon'     => block_icon(true),
            'supports' => [
                'anchor' => true,
            ],
        ]);
    }
}

add_filter('block_categories_all', 'custom_block_category', 10, 2);

function custom_block_category($categories, $post)
{
    $theme_slug = get_field("theme_slug", "option");
    $theme_slug = $theme_slug ? $theme_slug : "baunfire";

    $custom_category = array(
        array(
            'slug' => $theme_slug,
            'title' => __(ucfirst(strtolower($theme_slug)) . ' Blocks', $theme_slug)
        ),
    );

    return array_merge($custom_category, $categories);
}

add_filter('block_categories_all', 'custom_block_category', 10, 2);

function allow_json_uploads($mimes) {
    $mimes['json'] = 'application/json';
    return $mimes;
}
add_filter('upload_mimes', 'allow_json_uploads');

add_action('wp_enqueue_scripts', function() {
	wp_enqueue_script(
		'lottie-player',
		'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js',
		[],
		null,
		true
	);
});
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

    $args = array(
        'post_type'      => $post_type,
        'post_status'    => 'publish',
        'posts_per_page' => $ppp,
        'paged'          => $page,
    );

    // Build tax_query
    $tax_query = array();
    if ($type_id) {
        $tax_query[] = array(
            'taxonomy'         => $tax_type,
            'field'            => 'term_id',
            'terms'            => array($type_id),
            'include_children' => true,
            'operator'         => 'IN',
        );
    }
    if ($cat_id) {
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

            // Fallback: your original PHP card markup (kept intact)
            $label = 'ARTICLE';
            $t = get_the_terms(get_the_ID(), $tax_cat);
            if (!is_wp_error($t) && !empty($t)) {
                $t = array_values($t);
                $label = strtoupper($t[0]->name);
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

    $tax_type = sanitize_key($_POST['tax_type'] ?? 'category'); // parent taxonomy
    $type_id  = intval($_POST['type_id'] ?? 0);

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
                'name'    => $c->name,
            );
        }
    }

    wp_send_json(array('cats' => $cats));
}


// will clean
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

// === Ensure Gutenberg stays enabled ===
add_filter('use_block_editor_for_post_type', function ($use, $type) {
    return $type === 'partner' ? true : $use;
}, 100, 2);
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

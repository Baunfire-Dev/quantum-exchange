<?php
// Customize favicon login logo
function custom_admin_favicon()
{
    echo '<link id="favicon" rel="icon" type="image/png" href="' . esc_url(favicon()) . '">';
}

add_action('admin_head', 'custom_admin_favicon', 10, 2);
add_action('wp_head', 'custom_admin_favicon', 10, 2);
add_action('login_head', 'custom_admin_favicon', 10, 2);

// Customize custom post type icon
add_action('registered_post_type', function ($post_type, $args) {
    if (!in_array($post_type, array(
        'resource',
        'news',
        'case-study',
        'product',
        'post',
        'solution',
        'post-author',
        'customer-story',
        'webinar',
        'ebook',
        'press',
        'videos',
        'partner' 

    ))) return;

    // Set menu icon
    $args->menu_icon = menu_icon();

    global $wp_post_types;
    $wp_post_types[$post_type] = $args;
}, 10, 2);

// Customize wp-admin login logo
add_action('login_enqueue_scripts', function () {
    $login_logo = get_field("login_logo", "option");
    if (!$login_logo)
        return;

?>
    <style type="text/css">
        body.login #login h1 a {
            display: none;
        }

        body.login #login {
            padding-top: 0;
        }

        body.login #login .notice {
            margin-top: 16px;
        }
    </style>

    <div class="client-branding" style="text-align: center; padding-top: 5%;">
        <img style="width: 100%; max-width: 320px; height: auto;" src="<?= $login_logo ?>" alt="Custom Logo">
    </div>
<?php
});

// Reposition the acf fields to the top of editor
add_action('enqueue_block_editor_assets', function () {
    $block_icon = esc_url(block_icon());

    wp_add_inline_script('wp-edit-post', "
        jQuery(document).ready(function($) {
            setTimeout(() => {
                if ($('.block-editor').length) {
                    const mb = $('.edit-post-layout__metaboxes');
                    const pse = $('.edit-post-visual-editor');

                    if (mb.length && pse.length) {
                        mb.insertBefore(pse);
                        $('.postbox').addClass('closed');
                    }

                    mb.find('.acf-postbox .postbox-header h2').prepend(`<img src='{$block_icon}'/>`);
                }
            }, 1000);
        });
    ");
});

// Allow templates selected in the Template Dropdown
add_filter('template_include', function ($template) {
    if (is_page_template()) {
        return $template;
    }

    // Dynamically load templates based on slug
    if (is_page()) {
        $slug = get_post_field('post_name', get_post());
        $custom_template = get_stylesheet_directory() . '/templates/page-' . $slug . '.php';

        if (file_exists($custom_template)) {
            return $custom_template;
        }
    }

    // Fallback to the default template
    return $template;
});

// Rename posts to blog
add_filter('register_post_type_args', function ($args, $post_type) {
    if ($post_type === 'post') {
        $args['labels']['name'] = 'Blogs';
        $args['labels']['singular_name'] = 'Blog';
        $args['labels']['add_new'] = 'Add New Blog';
        $args['labels']['add_new_item'] = 'Add New Blog';
        $args['labels']['edit_item'] = 'Edit Blog';
        $args['labels']['new_item'] = 'New Blog';
        $args['labels']['view_item'] = 'View Blog';
        $args['labels']['search_items'] = 'Search Blogs';
        $args['labels']['not_found'] = 'No Blogs Found';
        $args['labels']['not_found_in_trash'] = 'No Blogs Found in Trash';
        $args['menu_name'] = 'Blogs';
    }
    return $args;
}, 10, 2);

// Add /blog/ on posts permalink
function custom_post_permalink_structure($permalink, $post, $leavename)
{
    if ($post->post_type === 'post') {
        return home_url('/blog/' . $post->post_name . '/');
    }
    return $permalink;
}

add_filter('post_link', 'custom_post_permalink_structure', 10, 3);

function custom_rewrite_rules()
{
    add_rewrite_rule('^blog/([^/]*)/?', 'index.php?name=$matches[1]', 'top');
}

add_action('init', 'custom_rewrite_rules');

// Rename categories to blog types
function rename_default_post_categories_to_blog_types() {
    global $wp_taxonomies;

    if ( isset( $wp_taxonomies['category'] ) ) {
        $labels = &$wp_taxonomies['category']->labels;

        $labels->name = 'Blog Types';
        $labels->singular_name = 'Blog Type';
        $labels->search_items = 'Search Blog Types';
        $labels->all_items = 'All Blog Types';
        $labels->parent_item = 'Parent Blog Type';
        $labels->parent_item_colon = 'Parent Blog Type:';
        $labels->edit_item = 'Edit Blog Type';
        $labels->view_item = 'View Blog Type';
        $labels->update_item = 'Update Blog Type';
        $labels->add_new_item = 'Add New Blog Type';
        $labels->new_item_name = 'New Blog Type Name';
        $labels->menu_name = 'Blog Types';
    }
}
add_action( 'init', 'rename_default_post_categories_to_blog_types' );

// Disable tags for post
add_action('init', function () {
    unregister_taxonomy_for_object_type('post_tag', 'post');
});

// Hide category
add_filter('rest_prepare_taxonomy', function ($response, $taxonomy) {
    if ('category' === $taxonomy->name) {
        $response->data['visibility']['show_ui'] = true;
    }

    return $response;
}, 10, 2);

// Hide taxonomy sidebar in block editor
add_filter('rest_prepare_taxonomy', function ($response, $taxonomy, $request) {
    $context = !empty($request['context']) ? $request['context'] : 'view';

    $target_taxonomies = ['solution-type'];

    if ($context === 'edit' && in_array($taxonomy->name, $target_taxonomies, true)) {
        $data_response = $response->get_data();
        $data_response['visibility']['show_ui'] = false;
        $response->set_data($data_response);
    }

    return $response;
}, 10, 3);

// Reorder post object results based of the recent>oldest
add_filter('acf/fields/post_object/query', function ($args, $field, $post_id) {
    if ($field['name'] === 'item_picker' or $field['name'] == 'featured_post') {
        $args['orderby'] = 'date';
        $args['order'] = 'DESC';
    }

    return $args;
}, 10, 3);

// Added support of searching post title on post object acf field type
add_filter('posts_where', function ($where, $wp_query) {
    global $pagenow, $wpdb;

    $is_acf = isset($wp_query->query['is_acf_query']) ? $wp_query->query['is_acf_query'] : false;
    if (is_search() || $is_acf) {
        $where = preg_replace(
            "/\(\s*" . $wpdb->posts . ".post_title\s+LIKE\s*(\'[^\']+\')\s*\)/",
            "(" . $wpdb->posts . ".post_title LIKE $1) OR (" . $wpdb->posts . ".ID LIKE $1)",
            $where
        );
    }
    return $where;
}, 10, 2);

// Customize wysiwyg toolbar presets
add_filter('acf/fields/wysiwyg/toolbars', function () {
    $toolbars['Plain Heading'] = array();
    $toolbars['Plain Heading'][1] = array('fullscreen', 'bold');

    // $toolbars['TOC'] = array();
    // $toolbars['TOC'][1] = array('bold', 'link', 'unlink', 'fullscreen', 'formatselect');

    $toolbars['Text and Link'] = array();
    $toolbars['Text and Link'][1] = array('fullscreen', 'link');

    $toolbars['Regular'] = array();
    $toolbars['Regular'][1] = array('fullscreen', 'italic', 'bold', 'bullist', 'link');

    $toolbars['Text and Link V2'] = array();
    $toolbars['Text and Link V2'][1] = array('fullscreen', 'fontsizeselect', 'link');

    add_filter('tiny_mce_before_init', function ($init) {
        // Add font sizes to the dropdown
        $init['fontsize_formats'] = "0.875rem 1rem";
        return $init;
    });

    return $toolbars;
});

add_filter('tiny_mce_before_init', function ($init) {
    $init['block_formats'] = 'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6;';
    return $init;
});
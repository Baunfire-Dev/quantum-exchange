<?php
function custom_allowed_block_types($allowed_block_types, $editor_context)
{
    if (!empty($editor_context->post)) {
        $post_type = $editor_context->post->post_type;

        $allowed_blocks = array();
        $all_registered_blocks = WP_Block_Type_Registry::get_instance()->get_all_registered();

        foreach ($all_registered_blocks as $block_type) {
            if (strpos( $block_type->name, 'acf/' ) === 0) {
                $allowed_blocks[] = $block_type->name;
            }
        }

        if (in_array($post_type, ['page', 'post', 'news', 'webinar', 'ebook', 'customer-story'])) {
            $supported_blocks = [
                'core/heading',
                'core/image',
                "core/paragraph",
                "core/image",
                "core/heading",
                "core/gallery",
                "core/list",
                "core/list-item",
                "core/quote",
                "core/audio",
                "core/button",
                "core/buttons",
                "core/code",
                "core/column",
                "core/columns",
                "core/file",
                "core/group",
                "core/html",
                "core/preformatted",
                "core/pullquote",
                "core/block",
                "core/spacer",
                "core/table",
                "core/video",
                "core/embed"
            ];

            return array_merge($allowed_blocks, $supported_blocks);
        }

        return $allowed_blocks;
    }

    return $allowed_block_types;
}

add_filter('allowed_block_types_all', 'custom_allowed_block_types', 10, 2);

add_action('admin_enqueue_scripts', function ($hook) {
    if ($hook === 'post.php' || $hook === 'post-new.php') {
        wp_register_script('my-custom-editor-js', '', array('wp-blocks', 'wp-dom-ready', 'wp-edit-post'), false, true);
        wp_enqueue_script('my-custom-editor-js');

        wp_add_inline_script('my-custom-editor-js', "
            wp.domReady(() => {
                const allowedEmbedVariations = ['youtube', 'vimeo'];

                wp.blocks.getBlockVariations('core/embed', 'block').forEach(variation => {
                    if (!allowedEmbedVariations.includes(variation.name)) {
                        wp.blocks.unregisterBlockVariation('core/embed', variation.name);
                    }
                });
            });
        ");
    }
}, 20);


// wp.blocks.getBlockTypes().forEach(block => {
//   console.log(block.name);
// });

add_filter('allowed_block_types_all', function ($allowed_block_types, $editor_context) {
    if (empty($editor_context->post)) return $allowed_block_types;

    $post_type = $editor_context->post->post_type;

    // ✅ Let Partner use ALL blocks
    if ($post_type === 'partner') {
        return true; // allow all registered blocks
    }

    // Build list of all ACF blocks
    $allowed_acf = [];
    foreach (WP_Block_Type_Registry::get_instance()->get_all_registered() as $bt) {
        if (strpos($bt->name, 'acf/') === 0) $allowed_acf[] = $bt->name;
    }

    // Your existing allow-list for core blocks
    if (in_array($post_type, ['page','post','news','webinar','ebook','customer-story'], true)) {
        $core_supported = [
            'core/heading','core/paragraph','core/image','core/gallery','core/list','core/list-item',
            'core/quote','core/audio','core/button','core/buttons','core/code','core/column','core/columns',
            'core/file','core/group','core/html','core/preformatted','core/pullquote','core/block',
            'core/spacer','core/table','core/video','core/embed'
        ];
        return array_merge($allowed_acf, $core_supported);
    }

    // Default: only ACF blocks
    return $allowed_acf;
}, 10, 2);

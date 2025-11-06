<?php
// ---- Global Content CTA from Options ----
$cta = get_field('block', 'option'); // ACF Options group

// ---- Default fallback content ----
$defaults = [
    'heading'   => 'Final hard-pitch CTA',
    'paragraph' => 'Gorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus.',
    'cta'       => [
        'title'  => 'Request a Demo',
        'url'    => '#',
        'target' => '_self'
    ],
    'marquee'   => 'Change nothing. Change everything.',
];

// Merge arrays (ACF values override defaults only if not empty)
$cta = wp_parse_args((array) $cta, $defaults);

// ---- Enforce fallback for empty or null string fields ----
foreach (['heading', 'paragraph', 'marquee'] as $key) {
    if (empty($cta[$key]) || (is_string($cta[$key]) && trim($cta[$key]) === '')) {
        $cta[$key] = $defaults[$key];
    }
}

// ---- Enforce fallback for CTA link if empty ----
if (empty($cta['cta']) || !is_array($cta['cta']) || empty($cta['cta']['title'])) {
    $cta['cta'] = $defaults['cta'];
}

if ($cta && is_array($cta)) {
    $ctx = Timber::context();
    $ctx['fields'] = $cta;

    // Minimal block meta expected by Twig
    $ctx['block'] = [
        'slug'      => 'block-content-cta',
        'className' => 'is-global-cta',
        'anchor'    => '',
        'id'        => 'global-content-cta',
        'data'      => [],
    ];

    // ---- Enqueue block assets ----
    $block_dir = get_template_directory() . '/blocks/content-cta';
    $block_uri = get_template_directory_uri() . '/blocks/content-cta';

    if (file_exists($block_dir . '/block.css')) {
        wp_enqueue_style(
            'content-cta',
            $block_uri . '/block.css',
            [],
            filemtime($block_dir . '/block.css')
        );
    }


    // ---- Render ----
    Timber::render(get_theme_file_path('blocks/content-cta/template.twig'), $ctx);
}


?>

<script>
  document.addEventListener("DOMContentLoaded", function () {
  // wait a bit to make sure DOM + images are ready
  setTimeout(() => {
    const sections = document.querySelectorAll("section.content-cta");
    if (!sections.length) return;

    sections.forEach((section) => {
      const marquees = section.querySelectorAll(".marquee-inner");
      marquees.forEach((marquee) => {
        const items = marquee.querySelectorAll(".marquee-text");
        const toRight = marquee.classList.contains("to-right");

        // 🌀 define the animation
        const tween = toRight
          ? gsap.fromTo(
              items,
              { xPercent: -100 },
              {
                xPercent: 0,
                duration: 40,
                ease: "linear",
                repeat: -1,
                paused: true,
              }
            )
          : gsap.to(items, {
              xPercent: -100,
              duration: 40,
              ease: "linear",
              repeat: -1,
              paused: true,
            });

        // 🎯 hook into scroll position
        ScrollTrigger.create({
          trigger: section,
          start: "top 90%",
          end: "bottom top",
          onEnter: () => tween.play(),
          onEnterBack: () => tween.play(),
          onLeave: () => tween.pause(),
          onLeaveBack: () => tween.pause(),
        });
      });
    });
  }, 300);
});
</script>
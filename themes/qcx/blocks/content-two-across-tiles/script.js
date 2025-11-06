// Fade-in + slide-up on scroll (content-tile-with-icon-text only)
baunfire.addModule({
  init(baunfire) {
    const $ = baunfire.$;
    const gsap = window.gsap;
    if (!gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const $sections = $('section.content-tile-with-icon-text');
    if (!$sections.length) return;

    $sections.each(function () {
      const $section = $(this);
      if ($section.data('initFadeSlide')) return;
      $section.data('initFadeSlide', true);

      const $heading = $section.find('.main-title').first();
      const $words   = $heading.find('.word, .split-word'); // optional splitter
      const $para    = $section.find('p').first();
      const $cta     = $section.find('.cta').first();
      const $tiles   = $section.find('article');

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          trigger: $section[0],
          start: 'top 75%',
          once: true
        }
      });

      // Heading
      if (!prefersReduced) {
        if ($words.length) {
          gsap.set($words, { yPercent: 30, autoAlpha: 0, willChange: 'transform,opacity' });
          tl.to($words, {
            yPercent: 0, autoAlpha: 1, duration: 0.8, stagger: 0.035, clearProps: 'will-change'
          }, 0);
        } else if ($heading.length) {
          gsap.set($heading, { y: 40, autoAlpha: 0, willChange: 'transform,opacity' });
          tl.to($heading, { y: 0, autoAlpha: 1, duration: 0.9, clearProps: 'will-change' }, 0);
        }
      } else if ($heading.length) {
        tl.set($heading, { autoAlpha: 1 });
      }

      // Paragraph + CTA
      const headerBits = [$para[0], $cta[0]].filter(Boolean);
      if (headerBits.length) {
        if (!prefersReduced) {
          gsap.set(headerBits, { y: 30, autoAlpha: 0, willChange: 'transform,opacity' });
          tl.to(headerBits, {
            y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.08, clearProps: 'will-change'
          }, '>-0.25');
        } else {
          tl.set(headerBits, { autoAlpha: 1 });
        }
      }

      // Tiles
      if ($tiles.length) {
        if (!prefersReduced) {
          gsap.set($tiles, { y: 32, autoAlpha: 0, willChange: 'transform,opacity' });
          tl.to($tiles, {
            y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.08, clearProps: 'will-change'
          }, '>-0.1');
        } else {
          tl.set($tiles, { autoAlpha: 1 });
        }
      }
    });
  }
});

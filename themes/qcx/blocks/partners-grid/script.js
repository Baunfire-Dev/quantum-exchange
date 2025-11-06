baunfire.addModule({
  init(baunfire) {
    const $ = baunfire.$;

    const script = () => {
      const section = $("section.p-grid");
      if (!section.length || !window.gsap || !window.ScrollTrigger) return;

      // Select the partner cards inside the grid
      const cards = section.find("[data-pg-item]");
      if (!cards.length) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section[0],
          start: baunfire.anim?.start || "top 80%", // triggers when 80% in view
          once: true,
        },
      });

      tl.fromTo(
        cards,
        { y: 60, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: { each: 0.12 },
          clearProps: "transform,opacity",
        }
      );
    };

    script();
  },
});

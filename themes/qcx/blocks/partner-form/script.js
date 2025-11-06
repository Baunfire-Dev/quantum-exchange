baunfire.addModule({
  init(baunfire) {
    const $ = baunfire.$;

    const script = () => {
      const sections = $("section.why-partner");
      if (!sections.length) return;

      sections.each(function () {
        const self = $(this);
        handleEntranceAnim(self);
      });
    };

    const handleEntranceAnim = (self) => {
      const heading   = self.find("h2").first();
      const paragraph = self.find("p").first();
      const itemsWrap = self.find(".itr").first(); // <-- your repeater wrapper

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: self[0],
          start: baunfire.anim?.start || "top 85%",
          once: true,
        },
      });

      // 1) Heading + paragraph
      tl.fromTo([heading, paragraph],
        { y: 60, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out", stagger: { each: 0.15 } }
      );

      // 2) FULL repeater wrapper (.itr)
      if (itemsWrap.length) {
        tl.fromTo(itemsWrap,
          { y: 60, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out" },
          "-=0.45" // slight overlap with previous for snap
        );
      }

    };

    script();
  },
});

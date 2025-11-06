baunfire.addModule({
  init(baunfire) {
    const $ = baunfire.$;

    const script = () => {
      const sections = $("section.why-partner, section.content-text-bullet");
      if (!sections.length) return;

      sections.each(function () {
        const self = $(this);
        handleEntranceAnim(self);
      });
    };

    const handleEntranceAnim = (self) => {
      // elements
      const heading = self.find("h2").first();
      const paragraph = self.find("p").first();
      const rightCard = self.find(".ric").first();

      // animation timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: self[0],
          start: baunfire.anim?.start || "top 85%",
          once: true,
        },
      });

      // fade + slide up for heading, paragraph, and right card (same time)
      tl.fromTo(
        [heading, paragraph, rightCard],
        { y: 60, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: { each: 0.15 }, // keeps slight rhythm between heading & paragraph
        }
      );
    };

    script();
  },
});

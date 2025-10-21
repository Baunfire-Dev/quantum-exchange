baunfire.addModule({
  init(baunfire) {
    const $ = baunfire.$;

    const script = () => {
      const els = $("section.content-cta");
      if (!els.length) return;

      els.each(function () {
        const self = $(this);
        loopingText(self);
      });
    };
    const loopingText = (self, inner) => {
      const marquees = self.find(".marquee-inner");
      if (!marquees.length) return;

      marquees.each(function () {
        const subSelf = $(this);
        const items = subSelf.find(".marquee-text");
        const toRight = subSelf.hasClass("to-right");

        let logoCarouselTween = null;

        if (toRight) {
          logoCarouselTween = gsap.fromTo(
            items,
            {
              xPercent: -100,
            },
            {
              xPercent: 0,
              duration: 40,
              ease: "linear",
              repeat: -1,
              paused: true,
            }
          );
        } else {
          logoCarouselTween = gsap.to(items, {
            xPercent: -100,
            duration: 40,
            ease: "linear",
            repeat: -1,
            paused: true,
          });
        }

        ScrollTrigger.create({
          trigger: inner,
          start: "top 90%",
          end: "bottom top",
          onEnter: function () {
            logoCarouselTween.play();
          },
          onEnterBack: function () {
            logoCarouselTween.play();
          },
          onLeave: function () {
            logoCarouselTween.pause();
          },
          onLeaveBack: function () {
            logoCarouselTween.pause();
          },
        });
      });
    };
    script();
  },
});

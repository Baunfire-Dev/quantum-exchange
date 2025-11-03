baunfire.addModule({
  init(baunfire) {
    const $ = baunfire.$;

    const script = () => {
      const els = $("section.carousel-stats-and-quotes");
      if (!els.length) return;

      els.each(function () {
        const self = $(this);
        handleCarousel(self);
        handleEntranceAnim(self);
        animateSection(self);
      });
    };

    const handleEntranceAnim = (self) => {
      const blockTitle = self.find(".block-title");
      const paraDesc = self.find(".para-desc");
      const pagination = self.find(".pagination");

      const entranceAnim = gsap.timeline({
        scrollTrigger: {
          trigger: self,
          start: baunfire.anim.start
        }
      })
        .fromTo([blockTitle, paraDesc, pagination],
          {
            y: "40",
            autoAlpha: 0
          },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            stagger: { each: 0.2 },
            ease: Power2.easeOut
          }
        );
    };

    const animateSection = (self) => {
      const items = self.find('.owl-item .item-card');
      const lines = self.find('.owl-item .item-line');
      const lineSvgs = lines.find('svg');
      
      ScrollTrigger.create({
        trigger: self,
        start: "top 80%",
        once: true,
        onEnter: () => {
          items.each(function(index) {
            const card = $(this);
            const line = lines.eq(index);
            const lineSvg = lineSvgs.eq(index);
            
            const tl = gsap.timeline({
              delay: index * 0.2
            });
            
            tl.fromTo(lineSvg, 
              { opacity: 0, scale: 0 },
              { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" }
            );
            
            tl.fromTo(line[0], 
              { '--line-width': '0' },
              { '--line-width': 'calc(100% + 3rem)', duration: 0.8, ease: "power2.inOut" }, 
              "-=0.2"
            );
            
            tl.fromTo(card, 
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 
              "-=0.4"
            );
          });
        }
      });
    };

    const handleCarousel = (self) => {
      const carousel = self.find(".owl-carousel");
      const next = self.find(".ar-r");
      const prev = self.find(".ar-l");

      const carouselInstance = carousel.owlCarousel({
        loop: true,
        rewind: true,
        dots: true,
        dotsEach: true,
        items: 3,
        margin: 24,
        center: true,
        autoWidth: false,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        responsive: {
          0: {
            items: 1,
            center: true
          },
          768: {
            items: 2,
            center: true
          },
          1024: {
            items: 3,
            center: true
          }
        }
      });

      next.click(function () {
        carousel.trigger('next.owl.carousel');
      });

      prev.click(function () {
        carousel.trigger('prev.owl.carousel');
      });
    };

    script();
  },
});
baunfire.addModule({
  init(baunfire) {
    const $ = baunfire.$;

    const script = () => {
      const els = $("section.carousel-stats-and-quotes");
      if (!els.length) return;

     
      els.each(function () {
        const self = $(this);
        handleCarousel(self);
      });
    };

     const handleCarousel = (self) => {
        const carousel = self.find(".owl-carousel");
        const next = self.find(".ar-r");
        const prev = self.find(".ar-l");
        const animatedItems = new Set();

        const animateItems = () => {
          const visibleItems = carousel.find('.owl-item.active');
          
          visibleItems.each(function(index) {
            const item = $(this);
            const itemIndex = item.index();
            
            if (animatedItems.has(itemIndex)) return;
            animatedItems.add(itemIndex);
            
            const card = item.find('.item-card');
            const line = item.find('.item-line');
            const lineSvg = line.find('svg');
            
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
        };

        const carouselInstance = carousel.owlCarousel({
          loop: true,
          rewind: true,
          dots: true,
          dotsEach: true,
          items: 3,
          margin: 32,
          center: true,
          autoWidth: false,
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

        setTimeout(() => animateItems(), 100);
        
        carousel.on('translated.owl.carousel', function() {
          animateItems();
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
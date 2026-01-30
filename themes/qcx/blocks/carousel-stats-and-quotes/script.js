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
            });
        };

        const handleEntranceAnim = (self) => {
            const title = self.find(".block-title");
            const para = self.find(".block-para");
            const items = self.find(".items");
            const itemsNav = self.find(".items-nav");
            const itemsLine = self.find(".items-line");
            const cards = self.find('.item-card');

            const elAnims = [title, para, itemsNav, items].filter(el => el.length > 0);

            const entranceAnim = gsap.timeline({
                scrollTrigger: {
                    trigger: self,
                    start: baunfire.anim.start
                }
            })

            if (elAnims.length) {
                entranceAnim.fromTo(elAnims,
                    {
                        y: 40,
                        autoAlpha: 0
                    },
                    {
                        y: 0,
                        autoAlpha: 1,
                        duration: 0.8,
                        stagger: { each: 0.2 },
                        ease: "power2.out"
                    }
                );
            }

            if (cards.length) {
                if (cards.length == 1) {
                    entranceAnim
                        .to(cards,
                            {
                                opacity: 1,
                                y: 0,
                                duration: 0.6,
                                ease: "power2.out",
                                stagger: { each: 0.2 }
                            },
                            elAnims.length ? ">-0.6" : ""
                        );
                } else {
                    entranceAnim
                        .to(itemsLine,
                            {
                                width: "100vw",
                                duration: 1,
                                ease: "power2.out",
                                onStart: () => {
                                    items.addClass("activated")
                                },
                                onComplete: () => {
                                    items.addClass("completed")
                                }
                            },
                            ">-0.8"
                        )
                        .to(cards,
                            {
                                opacity: 1,
                                y: 0,
                                duration: 0.6,
                                ease: "power2.out",
                                stagger: { each: 0.2 }
                            },
                            ">-0.6"
                        );
                }
            }
        };

        const handleCarousel = (self) => {
            const carousel = self.find(".owl-carousel");
            const next = self.find(".ar-r");
            const prev = self.find(".ar-l");

            const carouselInstance = carousel.owlCarousel({
                rewind: true,
                dots: true,
                dotsEach: true,
                margin: 24,
                autoplay: false,
                autoplayTimeout: 8000,
                autoplayHoverPause: true,
                responsive: {
                    0: {
                        items: 1,
                        autoWidth: false
                    },
                    768: {
                        autoWidth: true
                    }
                },
                onInitialized: () => {
                    baunfire.Global.screenSizeChange();
                },
                onResized: () => {
                    baunfire.Global.screenSizeChange();
                }
            });

            ScrollTrigger.create({
                trigger: carousel[0],
                start: baunfire.anim.start,
                onEnter: () => {
                    carousel.trigger('play.owl.autoplay', [8000]);
                },
                onLeave: () => {
                    carousel.trigger('stop.owl.autoplay');
                },
                onEnterBack: () => {
                    carousel.trigger('play.owl.autoplay', [8000]);
                },
                onLeaveBack: () => {
                    carousel.trigger('stop.owl.autoplay');
                }
            });

            next.click(function () {
                carousel.trigger('stop.owl.autoplay');
                carousel.trigger('next.owl.carousel');
                carousel.trigger('play.owl.autoplay', [8000]);
            });

            prev.click(function () {
                carousel.trigger('stop.owl.autoplay');
                carousel.trigger('prev.owl.carousel');
                carousel.trigger('play.owl.autoplay', [8000]);
            });
        };

        script();
    },
});
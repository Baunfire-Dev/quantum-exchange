baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-two-across-tiles-parallax");
            if (!els.length) return;

            els.each(function (index) {
                const self = $(this);
                handleParallax(self);
                handleEntranceAnim(self);
            });
        };

        const handleParallax = (self) => {
            let mm = gsap.matchMedia();
            const rellaxInstances = [];

            const leftCards = self.find('.item-cards.left');
            const rightCards = self.find('.item-cards.right');

            const createParallax = () => {
                if (leftCards.length) {
                    leftCards.each(function () {
                        rellaxInstances.push(new Rellax(this, {
                            speed: 1.2,
                            center: true
                        }));
                    });
                }

                if (rightCards.length) {
                    rightCards.each(function () {
                        rellaxInstances.push(new Rellax(this, {
                            speed: -1.2,
                            center: true
                        }));
                    });
                }
            }

            mm.add(
                {
                    isDesktop: `(min-width: 992px)`,
                    isMobile: `(max-width: 991.98px)`,
                },
                (context) => {
                    let { isDesktop, isMobile } = context.conditions;

                    if (isDesktop) {
                        createParallax();
                    }

                    if (isMobile && rellaxInstances.length) {
                        rellaxInstances.forEach(rellax => {
                            rellax.destroy();
                        });
                    }

                    return () => { };
                }
            );
        };

        const handleEntranceAnim = (self) => {
            const cards = self.find(".item-card");

            if (cards.length) {
                gsap.fromTo(cards,
                    {
                        autoAlpha: 0,
                        y: 40,
                    },
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.6,
                        ease: "power2.out",
                        stagger: { each: 0.2 },
                        scrollTrigger: {
                            trigger: self,
                            start: baunfire.anim.start
                        }
                    },
                );
            }
        };

        script();
    }
});
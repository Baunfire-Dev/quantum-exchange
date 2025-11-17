baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-two-across-tiles");
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
                            speed: -1.2,
                            center: true
                        }));
                    });
                }

                if (rightCards.length) {
                    rightCards.each(function () {
                        rellaxInstances.push(new Rellax(this, {
                            speed: 1.2,
                            center: true
                        }));
                    });
                }
            }

            mm.add(
                {
                    isDesktop: `(min-width: 768px)`,
                    isMobile: `(max-width: 767.98px)`,
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
            const logo = self.find(".block-logo");
            const heading = self.find(".block-heading");
            const cards = self.find(".item-card");
            const bg = self.find(".bg-graphic");

            gsap.fromTo(["main", self],
                {
                    background: "#F7F9FB"
                },
                {
                    background: "#206EEC",
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: self,
                        start: "top 40%",
                        // markers: true
                    }
                }
            )

            gsap.fromTo(bg,
                {
                    autoAlpha: 0,
                },
                {
                    autoAlpha: 1,
                    duration: 2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: self,
                        start: "top top",
                    },
                    onStart: () => {
                        gsap.set("main",
                            {
                                background: "#F7F9FB",
                                overwrite: true
                            }
                        )
                    }
                }
            )

            const elAnims = [logo, heading].filter(el => el.length > 0);

            const entranceAnim = gsap.timeline({
                scrollTrigger: {
                    trigger: self,
                    start: "top 20%"
                }
            })
                .fromTo(elAnims,
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

            if (cards.length) {
                entranceAnim
                    .fromTo(cards,
                        {
                            autoAlpha: 0,
                            y: 40,
                        },
                        {
                            autoAlpha: 1,
                            y: 0,
                            duration: 0.6,
                            ease: "power2.out",
                            stagger: { each: 0.2 }
                        },
                        ">-0.6"
                    );
            }
        };

        script();
    },
});
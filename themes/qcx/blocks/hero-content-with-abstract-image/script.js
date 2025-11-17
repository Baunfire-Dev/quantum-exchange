baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.hero-content-with-abstract-image");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                handleEntranceAnim(self);
                handleExitAnim(self);
            });
        }

        const handleEntranceAnim = (self) => {
            const title = self.find(".block-title");
            const para = self.find(".block-para");
            const image = self.find(".block-image");

            const elAnims = [title, para].filter(el => el.length > 0);

            const entranceAnim = gsap.timeline({
                scrollTrigger: {
                    trigger: self,
                    start: baunfire.anim.start
                }
            })
                .fromTo(image,
                    {
                        autoAlpha: 0
                    },
                    {
                        autoAlpha: 1,
                        duration: 0.8,
                        stagger: { each: 0.2 },
                        ease: "power2.out"
                    }
                )
                .fromTo([elAnims],
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
                    },
                    ">-0.5"
                );
        };

         const handleExitAnim = (self) => {
            const title = self.find("h1");
            const para = self.find("p");
            const image = self.find(".block-image-container");

            const elAnims = [title, para].filter(el => el.length > 0);

            const exitAnim = gsap.timeline({
                scrollTrigger: {
                    trigger: self,
                    start: "bottom 30%",
                    end: "bottom top",
                    // markers: true,
                    toggleActions: "play none reverse reverse"
                },
                defaults: {
                    ease: "linear"
                }
            })
                .fromTo(image,
                    {
                        autoAlpha: 1
                    },
                    {
                        autoAlpha: 0,
                    },
                    "slide-out"
                )
                .fromTo(elAnims,
                    {
                        color: "white",
                    },
                    {
                        color: "black",
                    },
                    "slide-out"
                );
        };

        script();
    }
});
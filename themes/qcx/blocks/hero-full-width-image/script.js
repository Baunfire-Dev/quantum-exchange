baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.hero-full-width-image");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                handleEntranceAnim(self);
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
                        ease: Power2.easeOut
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
                        ease: Power2.easeOut
                    },
                    ">-0.5"
                );
        };

        script();
    }
});
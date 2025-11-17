baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.resources-featured");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                handleEntranceAnim(self);
            });
        }

        const handleEntranceAnim = (self) => {
            const title = self.find(".block-title");
            const paraCTA = self.find(".block-duo");
            const cards = self.find('.rc-card');

            const elAnims = [title, paraCTA].filter(el => el.length > 0);

            const entranceAnim = gsap.timeline({
                scrollTrigger: {
                    trigger: self,
                    start: baunfire.anim.start
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
                            y: 40,
                            autoAlpha: 0
                        },
                        {
                            autoAlpha: 1,
                            y: 0,
                            duration: 0.6,
                            ease: "power2.out",
                            stagger: { each: 0.2 }
                        },
                        ">-0.8"
                    );
            }
        };

        script();
    }
});

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
            const itemsNav = self.find(".items-nav");
            const cards = self.find('.item-card');

            const entranceAnim = gsap.timeline({
                scrollTrigger: {
                    trigger: self,
                    start: baunfire.anim.start
                }
            })
                .fromTo([title, paraCTA, itemsNav],
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
                            ease: Power2.easeOut,
                            stagger: { each: 0.2 }
                        },
                        ">-0.8"
                    );
            }
        };

        script();
    }
});

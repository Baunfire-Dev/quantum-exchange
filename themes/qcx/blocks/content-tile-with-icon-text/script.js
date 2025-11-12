baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const sections = $("section.content-tile-with-icon-text");
            if (!sections.length) return;

            sections.each(function () {
                const self = $(this);
                handleEntranceAnim(self);
            });
        };

        const handleEntranceAnim = (self) => {
            const title = self.find(".block-title");
            const para = self.find(".block-para");
            const cards = self.find(".item");

            const entranceAnim = gsap.timeline({
                scrollTrigger: {
                    trigger: self,
                    start: baunfire.anim.start
                }
            })
                .fromTo([title, para],
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
                            y: 0,
                            autoAlpha: 1,
                            duration: 0.6,
                            stagger: { each: 0.14 },
                            ease: Power2.easeOut
                        },
                        ">-0.6"
                    );
            }
        };

        script();
    },
});

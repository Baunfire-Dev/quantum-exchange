baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const sections = $("section.partner-form");
            if (!sections.length) return;

            sections.each(function () {
                const self = $(this);
                handleEntranceAnim(self);
            });
        };

        const handleEntranceAnim = (self) => {
            const bg = self.find(".bg");
            const title = self.find(".block-title");
            const content = self.find(".block-content");
            const form = self.find(".block-form");

            const elAnims = [title, content, form].filter(el => el.length > 0);

            const entranceAnim = gsap.timeline({
                scrollTrigger: {
                    trigger: self,
                    start: baunfire.anim.start
                }
            })
                .fromTo(bg,
                    {
                        autoAlpha: 0
                    },
                    {
                        autoAlpha: 1,
                        duration: 0.8,
                        ease: Power2.easeOut
                    }
                )
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
                        ease: Power2.easeOut
                    },
                    ">-0.6"
                );
        };

        script();
    },
});

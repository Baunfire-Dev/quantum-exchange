baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const sections = $("section.content-cta-banner");
            if (!sections.length) return;

            sections.each(function () {
                const self = $(this);
                handleEntranceAnim(self);
            });
        };

        const handleEntranceAnim = (self) => {
            const title = self.find(".block-title");
            const para = self.find(".block-para");
            const cta = self.find(".block-cta");

            const elAnims = [title, para, cta].filter(el => el.length > 0);

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
        };

        script();
    },
});

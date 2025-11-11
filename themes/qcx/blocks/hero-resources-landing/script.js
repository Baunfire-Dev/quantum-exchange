baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.hero-resources-landing");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                handleEntranceAnim(self);
            });
        }

        const handleEntranceAnim = (self) => {
            const title = self.find(".block-title");
            const para = self.find(".block-para");
            const cards = self.find(".rc.at-hero:not(.ghost-card) .rc-card");
            const form = self.find(".block-form");

            const entranceAnim = gsap.timeline({
                scrollTrigger: {
                    trigger: self,
                    start: baunfire.anim.start
                }
            })
                .fromTo([title, para, cards, form],
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
        };

        script();
    }
});
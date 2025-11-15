baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.hero-title-one-line");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                handleEntranceAnim(self);
            });
        }

        const handleEntranceAnim = (self) => {
            const heading = $(".heading");
            const subtext = self.find(".subtext");

            const elAnims = [heading, subtext].filter(el => el.length > 0);

            const entranceAnim = gsap.timeline({
                scrollTrigger: {
                    trigger: self,
                    start: baunfire.anim.start
                }
            })
                .fromTo(elAnims,
                    {
                        y: "40",
                        autoAlpha: 0
                    },
                    {
                        y: 0,
                        autoAlpha: 1,
                        duration: 0.8,
                        stagger: { each: 0.2 },
                        ease: Power2.easeOut
                    }
                )
        };

        script();
    }
});

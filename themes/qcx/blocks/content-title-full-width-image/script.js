baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-title-full-width-image");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                handleEntranceAnim(self);
            });
        }

        const handleEntranceAnim = (self) => {
            const title = self.find(".block-title");
            const paraCTA = self.find(".block-duo");
            const media = self.find(".media-container");

            const entranceAnim = gsap.timeline({
                scrollTrigger: {
                    trigger: self,
                    start: baunfire.anim.start
                }
            })
                .fromTo([title, paraCTA, media],
                    {
                        y: 40,
                        autoAlpha: 0
                    },
                    {
                        y: 0,
                        autoAlpha: 1,
                        duration: 0.8,
                        stagger: { each: 0.14 },
                        ease: Power2.easeOut
                    }
                );
        };

        script();
    },
});
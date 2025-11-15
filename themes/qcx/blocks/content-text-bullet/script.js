baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const sections = $("section.content-text-bullet");
            if (!sections.length) return;

            sections.each(function () {
                const self = $(this);
                handleEntranceAnim(self);
            });
        };

        const handleEntranceAnim = (self) => {
            const inner = self.find(".inner");
            const title = self.find(".block-title");
            const para = self.find(".block-para");
            const bullets = self.find(".item");

            const elAnims = [title, para].filter(el => el.length > 0);

            const entranceAnim = gsap.timeline({
                scrollTrigger: {
                    trigger: inner,
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
                        ease: Power2.easeOut
                    }
                );

            if (bullets.length) {
                entranceAnim
                    .fromTo(bullets,
                        {
                            y: 20,
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

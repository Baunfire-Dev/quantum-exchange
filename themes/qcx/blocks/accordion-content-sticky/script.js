baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.accordion-content-sticky");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                handleEntranceAnim(self);
            });
        }

        const handleEntranceAnim = (self) => {
            const items = self.find(".item");
            if (!items.length) return;

            items.each(function () {
                const subSelf = $(this);

                const title = subSelf.find(".block-title");
                const para = subSelf.find(".block-para");
                const image = subSelf.find(".block-image");

                const elAnims = [title, para].filter(el => el.length > 0);

                const entranceAnim = gsap.timeline({
                    scrollTrigger: {
                        trigger: subSelf,
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
                        },
                        "slide"
                    )
                    .fromTo(image,
                        {
                            y: 40,
                            autoAlpha: 0
                        },
                        {
                            y: 0,
                            autoAlpha: 1,
                            duration: 0.8,
                            ease: "power2.out"
                        },
                        "slide"
                    );
            })
        };

        script();
    }
});
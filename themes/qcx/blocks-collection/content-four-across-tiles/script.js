baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-four-across-tiles");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);

                baunfire.Animation.headingParaAnimation(self.find(".block-heading"), self.find(".block-para"), {
                    trigger: self,
                    start: baunfire.anim.start,
                });

                handleItems(self);
            });
        }

        const handleItems = (self) => {
            const items = self.find(".item");
            if (!items.length) return;

            const tlParams = {
                scrollTrigger: {
                    trigger: self,
                    start: baunfire.anim.start
                }
            }

            const overlayTL = gsap.timeline({ ...tlParams });
            const contentTL = gsap.timeline({ ...tlParams });

            items.each(function () {
                const subSelf = $(this);
                const overlay = subSelf.find(".item-overlay");
                const content = subSelf.find(".item-content");

                overlayTL
                    .fromTo(overlay,
                        {
                            xPercent: 0,
                        },
                        {
                            xPercent: 104,
                            duration: 1.4,
                            ease: Power2.easeOut,
                        },
                        "<0.1"
                    )


                contentTL.fromTo(content,
                    {
                        autoAlpha: 0  
                    },
                    {
                        autoAlpha: 1,
                        duration: 1,
                        ease: Power2.easeOut
                    },
                    "<0.2"
                )
            });
        }

        script();
    }
});

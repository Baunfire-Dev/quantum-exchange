baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.accordion-with-image");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                handleEntranceAnim(self);
                handleAccordion(self);
            });
        }

        const handleEntranceAnim = (self) => {
            const title = self.find(".block-title");
            const para = self.find(".block-para");
            const acc = self.find(".block-accs");

            const elAnims = [title, para, acc].filter(el => el.length > 0);

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
                        ease: Power2.easeOut
                    }
                );
        };

        const handleAccordion = (self) => {
            const accs = self.find(".acc");
            if (!accs.length) return;

            const accImages = self.find(".acc-image:not(.main-image)");

            accs.each(function () {
                const subSelf = $(this);
                const head = subSelf.find(".acc-head");
                const index = subSelf.data("index");
                const targetImage = self.find(`.acc-image:not(.main-image)[data-index="${index}"]`);

                head.click(function () {
                    if (subSelf.hasClass("active")) return;
                    
                    accs.removeClass("active");
                    accImages.removeClass("active");
                    subSelf.addClass("active");
                    targetImage.addClass("active");

                    baunfire.Global.screenSizeChange();
                });
            });
        };

        script();
    }
});
baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-large-paragraph");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                handleTextHighlight(self);
            });
        }

        const handleTextHighlight = (self) => {
            const mainTitle = self.find("h3");
            const words = mainTitle.find(".word");
            if (!words.length) return;

            const mm = gsap.matchMedia();

            mm.add({
                isDesktop: `(min-width: 992px)`,
                isMobile: `(max-width: 991.98px)`,
            }, (context) => {
                let { isDesktop, isMobile } = context.conditions;

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: mainTitle,
                        scrub: isDesktop ? 2 : true,
                        start: isDesktop ? "top 80%" : "top 70%",
                        end: isDesktop ? "bottom 30%" : "bottom 70%",
                        // markers: true
                    },
                });

                words.each(function () {
                    const subSelf = $(this);

                    tl.to(subSelf, {
                        backgroundPositionX: 0,
                        ease: "none",
                    });
                })

                return () => { }
            });
        }

        script();
    }
});
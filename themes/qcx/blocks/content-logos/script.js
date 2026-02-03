baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-logos");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                // handleMarquee(self);
            });
        };

        const handleMarquee = (self) => {
            const marquees = self.find(".marquee-content");
            if (!marquees.length) return;

            gsap.fromTo(marquees,
                {
                    x: 0,
                },
                {
                    x: "-100%",
                    duration: 100,
                    ease: "linear",
                    repeat: -1,
                    scrollTrigger: {
                        trigger: self,
                        start: "top 100%",
                        end: "bottom top"
                    }
                }
            )
        }

        script();
    }
});

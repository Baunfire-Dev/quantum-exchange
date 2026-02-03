baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-logos");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                handleMarquee(self);
            });
        };

        const handleMarquee = (self) => {
            const marquee = self.find(".marquee");
            if (!marquee.length) return;

            gsap.fromTo(marquee,
                {
                    x: 0,
                },
                {
                    x: "-50%",
                    duration: 80,
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

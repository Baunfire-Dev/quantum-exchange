baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-cta");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                handleEntranceAnim(self);
                handleMarquee(self);
            });
        };

        const handleEntranceAnim = (self) => {
            const bg = self.find(".bg");
            const box = self.find(".box");

            const entranceAnim = gsap.timeline({
                scrollTrigger: {
                    trigger: self,
                    start: baunfire.anim.start
                }
            })
                .fromTo(bg,
                    {
                        autoAlpha: 0
                    },
                    {
                        autoAlpha: 1,
                        duration: 0.8,
                        ease: Power2.easeOut
                    }
                )
                .fromTo(box,
                    {
                        y: 40,
                        autoAlpha: 0
                    },
                    {
                        y: 0,
                        autoAlpha: 1,
                        duration: 0.8,
                        ease: Power2.easeOut
                    },
                    ">-0.6"
                );
        };

        const handleMarquee = (self) => {
            const marquee = self.find(".marquee");

            ScrollTrigger.create({
                trigger: marquee,
                start: "top 90%",
                end: "bottom top",
                onEnter: () => {
                    marquee.removeClass("paused");
                },
                onLeave: () => {
                    marquee.addClass("paused");
                },
                onEnterBack: () => {
                    marquee.removeClass("paused");
                },
                onLeaveBack: () => {
                    marquee.addClass("paused");
                }
            });
        }

        script();
    }
});

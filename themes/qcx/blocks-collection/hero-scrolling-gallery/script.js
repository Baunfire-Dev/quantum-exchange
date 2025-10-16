baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.hero-scrolling-gallery");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);

                setTimeout(() => {
                    baunfire.Animation.headingParaAnimation(self.find(".block-heading"), self.find(".block-para"), {
                        trigger: self,
                        start: baunfire.anim.start,
                    });
                }, 600);

                handleMarquee(self);
            });
        }

        const handleMarquee = (self) => {
            const inner = self.find(".marquee-inner");
            const marqueeWidth = inner.width() / 2;

            let scrollOffset = { x: 0 };

            let baseTween = gsap.to(inner, {
                x: -marqueeWidth,
                duration: 120,
                ease: "none",
                repeat: -1,
                paused: true, // start paused
                modifiers: {
                    x: gsap.utils.unitize(x => (parseFloat(x) + scrollOffset.x) % -marqueeWidth)
                }
            });

            // play/pause based on visibility
            ScrollTrigger.create({
                trigger: self,
                start: "top bottom",   // when the marquee enters viewport
                end: "bottom top",     // when it leaves viewport
                onEnter: () => baseTween.play(),
                onEnterBack: () => baseTween.play(),
                onLeave: () => baseTween.pause(),
                onLeaveBack: () => baseTween.pause()
            });

            // attach scroll influence
            ScrollTrigger.create({
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: true,
                onUpdate: (self) => {
                    let v = self.getVelocity();

                    if (v > 0) {
                        // scrolling down → speed up to the left
                        scrollOffset.x -= v * 0.01;
                    } else {
                        // scrolling up → move to the right
                        scrollOffset.x -= v * 0.01;
                    }
                }
            });
        };


        script();
    }
});
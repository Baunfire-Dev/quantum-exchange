typeof app !== 'undefined' && app.ready(() => {
    var $ = jQuery.noConflict();

    const script = () => {
        const els = $("section.content-title-full-width-image");
        if (!els.length) return;

        els.each(function () {
            const self = $(this);

            app.Animation.prototype.headingAnimation(self.find(".main-title .inner-word"), {
                trigger: self,
                start: "top 60%",
            }, {
                onStart: () => {
                    gsap.timeline()
                    .fromTo(self.find(".para-desc"),
                        {
                            autoAlpha: 0,
                            y: 30,
                        },
                        {
                            autoAlpha: 1,
                            y: 0,
                            delay: 0.2,
                            duration: 0.6,
                            ease: Power2.easeOut
                        }
                    )
                    .fromTo(self.find(".cta"),
                        {
                            autoAlpha: 0,
                            y: 30,
                        },
                        {
                            autoAlpha: 1,
                            y: 0,
                            duration: 0.6,
                            ease: Power2.easeOut
                        },
                        "<0.2"
                    )
                    .fromTo(self.find(".items"),
                        {
                            autoAlpha: 0,
                            x: 30,
                        },
                        {
                            autoAlpha: 1,
                            x: 0,
                            duration: 0.8,
                            ease: Power2.easeOut
                        },
                        "<0.06"
                    )
                }
            });
        });
    }
    
    script();
});

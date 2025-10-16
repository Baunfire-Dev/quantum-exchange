baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-four-across-logo-grid");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                
                baunfire.Animation.headingParaAnimation(self.find(".block-heading"), null, {
                    trigger: self,
                    start: baunfire.anim.start,
                });

                const marquee = self.find(".marquee");

                ScrollTrigger.create({
                    trigger: marquee,
                    start: "top 100%",
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
            });
        }

        script();
    }
});
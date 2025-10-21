baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-two-across-tiles");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                const leftColumn = self.find('.left-card');
                const rightColumn = self.find('.rigth-card');
                
                const mm = gsap.matchMedia();
                
                mm.add("(min-width: 768px)", () => {
                    gsap.fromTo(leftColumn, 
                        {
                            yPercent: 15
                        },
                        {
                            yPercent: -15,
                            ease: "none",
                            scrollTrigger: {
                                trigger: self,
                                start: "top bottom",
                                end: "bottom top",
                                scrub: 1.5
                            }
                        }
                    );
                    
                    gsap.fromTo(rightColumn,
                        {
                            yPercent: 15
                        },
                        {
                            yPercent: -20,
                            ease: "none",
                            scrollTrigger: {
                                trigger: self,
                                start: "top bottom",
                                end: "bottom top",
                                scrub: 1
                            }
                        }
                    );
                });
            });
        }

        script();
    }
});
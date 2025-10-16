(function () {
    const $ = baunfire.$;

    baunfire.Animation = {
        init() {
            this.handleButtonHover();
        },

        handleButtonHover() {
            const btn = $("a.btn");
            if (!btn.length) return;

            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

            btn.each(function () {
                const self = $(this);
                const frontSpans = self.find(".front");
                if (!frontSpans.length) return;

                let tweens = [];

                self.on('mouseenter', function () {
                    tweens.forEach(t => t.kill());
                    tweens = [];

                    frontSpans.each(function () {
                        const span = $(this);
                        const originalText = span.data('original');

                        const tween = gsap.to(span, {
                            duration: 0.4,
                            scrambleText: {
                                text: originalText,
                                chars,
                                speed: 0.4
                            },
                            ease: 'none'
                        });

                        tweens.push(tween);
                    });
                });

                self.on('mouseleave', function () {
                    tweens.forEach(t => t.kill());
                    tweens = [];

                    frontSpans.each(function () {
                        const span = $(this);
                        const originalText = span.data('original');

                        span.text(originalText);

                        const tween = gsap.to(span, {
                            duration: 0.4,
                            scrambleText: {
                                text: originalText,
                                chars,
                                revealDelay: 0.2,
                                tweenLength: false
                            },
                            ease: 'power2.out'
                        });

                        tweens.push(tween);
                    });
                });
            });
        }


    };

    baunfire.addModule(baunfire.Animation);
})();
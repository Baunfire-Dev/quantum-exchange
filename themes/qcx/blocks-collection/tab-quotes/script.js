baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.tab-quotes");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                handleItems(self);
            });
        }

        const handleItems = (self) => {
            const items = self.find(".item-nav");
            if (!items.length) return;

            const DURATION = 8;

            const quotes = self.find(".item-quote");
            const bars = self.find(".item-bar");

            const prevArrow = self.find(".arrow.prev");
            const nextArrow = self.find(".arrow.next");

            let activeIndex = 0;
            let count = items.length;
            let progressTween;

            const updateIndex = (forwards = true) => {
                if (forwards) {
                    activeIndex = activeIndex + 1 < count ? activeIndex + 1 : 0;
                } else {
                    activeIndex = activeIndex - 1 >= 0 ? activeIndex - 1 : count - 1;
                }
            }

            const updateQuote = (forwards = true) => {
                const targetNav = items.eq(activeIndex);
                const targetQuote = quotes.eq(activeIndex);

                items.removeClass("active");
                bars.css("width", 0);

                gsap.set(quotes, {
                    autoAlpha: 0,
                    overwrite: true
                });

                targetNav.addClass("active");
                targetQuote.addClass("active");

                gsap.fromTo(targetQuote,
                    {
                        autoAlpha: 0,
                        x: () => baunfire.Global.convertRemToPixels(2.5) * (forwards ? 1 : -1),
                    },
                    {
                        autoAlpha: 1,
                        x: 0,
                        duration: 0.8,
                        ease: Power2.easeOut,
                        overwrite: true
                    }
                )
            };

            const startCountdown = () => {
                const targetBar = bars.eq(activeIndex);

                progressTween = gsap.fromTo(targetBar,
                    { width: 0 },
                    {
                        width: "100%",
                        duration: DURATION,
                        ease: "linear",
                        onComplete: () => {
                            updateIndex();
                            updateQuote();
                            restartCountdown();
                        }
                    }
                );
            }

            const restartCountdown = () => {
                if (progressTween) progressTween.kill();
                startCountdown();
            }

            ScrollTrigger.create({
                trigger: self[0],
                start: baunfire.anim.start,
                end: "bottom top",
                onEnter: () => restartCountdown(),
                onEnterBack: () => restartCountdown(),
                onLeave: () => progressTween && progressTween.pause(),
                onLeaveBack: () => progressTween && progressTween.pause()
            });

            items.each(function (index) {
                const subSelf = $(this);

                subSelf.click(function () {
                    activeIndex = index;
                    updateQuote();
                    restartCountdown();
                });
            });

            nextArrow.click(function () {
                updateIndex();
                updateQuote();
                restartCountdown();
            });

            prevArrow.click(function () {
                updateIndex(false);
                updateQuote(false);
                restartCountdown();
            });
        };

        script();
    }
});

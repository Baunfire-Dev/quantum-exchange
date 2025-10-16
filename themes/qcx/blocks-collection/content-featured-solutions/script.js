baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-featured-solutions");
            if (!els.length) return;

            els.each(function (index) {
                const self = $(this);

                baunfire.Animation.headingParaAnimation(self.find(".block-heading"), self.find(".block-para"), {
                    trigger: self,
                    start: baunfire.anim.start,
                });

                handleCarousel(self);
            });
        }

        const handleCarousel = (self) => {
            const carousel = self.find(".carousel-container");
            const allItems = self.find(".card.carousel");
            const baseItems = self.find(".card.carousel:not(.clone)");
            if (!carousel.length || !baseItems.length) return;

            let progressTween;
            let currentIndex = 1;
            let spaceMultiplier = 50;

            const itemCount = baseItems.length;

            const prevArrow = self.find(".arrow.prev");
            const nextArrow = self.find(".arrow.next");

            const circle = nextArrow.find("circle.foreground").get(0);
            const radius = circle.r.baseVal.value;
            const circumference = 2 * Math.PI * radius;

            circle.style.strokeDasharray = circumference;
            circle.style.strokeDashoffset = circumference;

            const DURATION = 6;

            const animProps = {
                duration: 1,
                ease: Power2.easeOut
            }

            const mm = gsap.matchMedia();

            mm.add({
                isDesktop: `(min-width: 992px)`,
                isMobile: `(max-width: 991.98px)`,
            }, (context) => {
                let { isDesktop, isMobile } = context.conditions;

                currentIndex = 1;

                gsap.set(carousel, {
                    clearProps: true
                });

                allItems.removeClass("active");
                baseItems.first().addClass("active");

                if (isDesktop) {
                    spaceMultiplier = 50;
                } else {
                    spaceMultiplier = 100;
                }

                return () => {
                }
            });

            const moveCarousel = (forwards = true) => {
                const activeEL = self.find(".card.carousel.active");
                allItems.removeClass("active");

                let targetEL = null;

                if (forwards) {
                    if (currentIndex == (itemCount + 1)) {
                        currentIndex = 2;
                        targetEL = baseItems.first().next();

                        gsap.fromTo(carousel,
                            {
                                x: () => 0,
                            },
                            {
                                x: () => `-${(currentIndex - 1) * spaceMultiplier}%`,
                                ...animProps
                            }
                        );
                    } else {
                        currentIndex++;
                        targetEL = activeEL.next();

                        gsap.fromTo(carousel,
                            {
                                x: () => `-${(currentIndex - 2) * spaceMultiplier}%`,
                            },
                            {
                                x: () => `-${(currentIndex - 1) * spaceMultiplier}%`,
                                ...animProps
                            }
                        );
                    }
                } else {
                    if (currentIndex == 1) {
                        currentIndex = itemCount;
                        targetEL = baseItems.last();

                        gsap.fromTo(carousel,
                            {
                                x: () => `-${itemCount * spaceMultiplier}%`,
                            },
                            {
                                x: () => `-${(itemCount - 1) * spaceMultiplier}%`,
                                ...animProps
                            }
                        );
                    } else {
                        currentIndex--;
                        targetEL = activeEL.prev();

                        gsap.fromTo(carousel,
                            {
                                x: () => `-${currentIndex * spaceMultiplier}%`,
                            },
                            {
                                x: () => `-${(currentIndex - 1) * spaceMultiplier}%`,
                                ...animProps
                            }
                        );
                    }
                }

                targetEL.addClass('active');

                gsap.timeline()
                .fromTo(targetEL.find(".card-image"),
                    {
                        scaleX: 0,
                        autoAlpha: 0,
                        transformOrigin: forwards ? "right" : "left"
                    },
                    {
                        scaleX: 1,
                        autoAlpha: 1,
                        duration: 1,
                        ease: Power2.easeOut
                    }
                )
                .fromTo(targetEL.find(".card-content"),
                    {
                        y: 40,
                        autoAlpha: 0
                    },
                    {
                        y: 0,
                        autoAlpha: 1,
                        duration: 1,
                        ease: Power2.easeOut
                    },
                    "<0.3"
                )
            }

            nextArrow.click(function () {
                moveCarousel();
                restartCountdown();
            });

            prevArrow.click(function () {
                moveCarousel(false);
                restartCountdown();
            });

            const startCountdown = () => {
                progressTween = gsap.fromTo(circle,
                    { strokeDashoffset: circumference },
                    {
                        strokeDashoffset: 0,
                        duration: DURATION,
                        ease: "linear",
                        onComplete: () => {
                            moveCarousel();
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
        };

        script();
    }
});

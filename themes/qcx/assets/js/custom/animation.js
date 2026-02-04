(function () {
    const $ = baunfire.$;

    baunfire.Animation = {
        init() {
            this.handleNav();
            this.handleButtonHover();
            this.handleResourceAnim();
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
        },

        handleNav() {
            const nav = $("nav");
            if (!nav.length) return;

            const parents = nav.find(".nav-item.parent");
            const allNavItems = nav.find(".nav-item");

            const toggleNav = () => {
                let lastScroll = 0;
                let ticking = false;

                function onScroll() {
                    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

                    if (currentScroll === lastScroll) {
                        ticking = false;
                        return;
                    }

                    if (currentScroll > lastScroll) {
                        if (!(nav.hasClass("nav-hidden") || nav.hasClass("mob-active"))) {
                            nav.addClass("nav-hidden");
                        }
                    } else {
                        if (nav.hasClass("nav-hidden")) {
                            nav.removeClass("nav-hidden");
                        }
                    }

                    lastScroll = Math.max(0, currentScroll);
                    ticking = false;
                }

                window.addEventListener("scroll", function () {
                    if (!ticking) {
                        window.requestAnimationFrame(onScroll);
                        ticking = true;
                    }
                });

            }

            const toggleBGOnScroll = () => {
                function updateNavScroll() {
                    const nav = document.querySelector("nav");
                    if (!nav) return;

                    if (window.scrollY > 20) {
                        nav.classList.add("nav-scrolled");
                    } else {
                        nav.classList.remove("nav-scrolled");
                    }
                }

                document.addEventListener("scroll", updateNavScroll);
                document.addEventListener("DOMContentLoaded", updateNavScroll);
                window.addEventListener("load", updateNavScroll);
            }

            const desktopDDPanel = () => {
                let activeDropdown = null;
                let hideTimeout = null;
                let timeoutDuration = 300;

                const isBigScreen = () => window.matchMedia("(min-width: 992px)").matches;

                parents.on('mouseenter', function () {
                    if (!isBigScreen()) return;
                    const self = $(this);

                    clearTimeout(hideTimeout);

                    if (activeDropdown && activeDropdown !== this) {
                        $(activeDropdown).removeClass('open');
                    }

                    self.addClass('open');
                    activeDropdown = this;
                });

                parents.on('mouseleave', function () {
                    if (!isBigScreen()) return;
                    const self = $(this);

                    hideTimeout = setTimeout(() => {
                        self.removeClass('open');
                        if (activeDropdown === this) activeDropdown = null;
                    }, timeoutDuration);
                });

                allNavItems.not('.parent').on('mouseenter', function () {
                    if (!isBigScreen()) return;
                    clearTimeout(hideTimeout);

                    if (activeDropdown) {
                        $(activeDropdown).removeClass('open');
                        activeDropdown = null;
                    }
                });
            }

            const mobileDDPanel = () => {
                // const navPanel = nav.find(".nav-panel");

                parents.each(function () {
                    const subSelf = $(this);
                    const inner = subSelf.find(".nav-item-inner");

                    inner.click(function () {
                        if (!window.matchMedia("(max-width: 992px)").matches) return;

                        if (subSelf.hasClass("open")) {
                            subSelf.removeClass("open");
                        } else {
                            parents.removeClass("open");
                            subSelf.addClass("open");

                            // gsap.to(navPanel, {
                            //     duration: 0.6,
                            //     scrollTo: { y: subSelf, offsetY: 0, autoKill: true },
                            //     ease: Power1.easeInOut,
                            //     overwrite: true
                            // });
                        }
                    })
                })
            }

            const burgerEvent = () => {
                const burger = nav.find(".nav-burger");

                let mm = gsap.matchMedia();

                mm.add(
                    {
                        isDesktop: `(min-width: 992px)`,
                        isMobile: `(max-width: 991.98px)`,
                    },
                    (context) => {
                        let { isDesktop, isMobile } = context.conditions;

                        if (isDesktop || isMobile) {
                            parents.removeClass("open");
                        }

                        if (isDesktop) {
                            nav.removeClass("mob-active");
                            baunfire.Global.siteScrolling();

                            burger.off("click");
                        }

                        if (isMobile) {
                            burger.click(function () {
                                if (!nav.hasClass("mob-active")) {
                                    showMobileNav();
                                } else {
                                    hideMobileNav();
                                }
                            });
                        }

                        return () => { };
                    }
                );
            }

            const showMobileNav = () => {
                nav.addClass("mob-active");
                baunfire.Global.siteScrolling(false);
            }

            const hideMobileNav = () => {
                nav.removeClass("mob-active");
                baunfire.Global.siteScrolling();
                parents.removeClass("open");
            }

            toggleNav();
            toggleBGOnScroll();
            burgerEvent();
            desktopDDPanel();
            mobileDDPanel();
        },

        handleResourceAnim() {
            const el = $(".rs");
            if (!el.length) return;

            const resourceHero = () => {
                const self = el.find("section.rs-head");
                if (!self.length) return;

                const handleEntranceAnim = (self) => {
                    const left = self.find(".block-left");
                    const right = self.find(".block-right");

                    const elAnims = [left, right].filter(el => el.length > 0);

                    const entranceAnim = gsap.timeline({
                        scrollTrigger: {
                            trigger: self,
                            start: baunfire.anim.start
                        }
                    })
                        .fromTo(elAnims,
                            {
                                y: 40,
                                autoAlpha: 0
                            },
                            {
                                y: 0,
                                autoAlpha: 1,
                                duration: 0.8,
                                stagger: { each: 0.2 },
                                ease: "power2.out"
                            }
                        );
                };

                handleEntranceAnim(self);
            };

            const resourceBody = () => {
                const self = el.find("section.rs-body");
                if (!self.length) return;

                gsap.fromTo(self,
                    {
                        autoAlpha: 0
                    },
                    {
                        autoAlpha: 1,
                        duration: 0.8,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: self,
                            start: baunfire.anim.start
                        }
                    }
                );
            };

            const subscribeCTA = () => {
                const self = el.find("section.subscribe-cta");
                if (!self.length) return;

                const handleEntranceAnim = (self) => {
                    const title = self.find(".block-heading");
                    const para = self.find(".block-para");
                    const form = self.find(".block-form");
                    const envelopes = self.find('.envelope');

                    const elAnims = [title, para, form, envelopes].filter(el => el.length > 0);

                    const entranceAnim = gsap.timeline({
                        scrollTrigger: {
                            trigger: self,
                            start: baunfire.anim.start
                        }
                    })
                        .fromTo(elAnims,
                            {
                                y: 40,
                                autoAlpha: 0
                            },
                            {
                                y: 0,
                                autoAlpha: 1,
                                duration: 0.8,
                                stagger: { each: 0.2 },
                                ease: "power2.out"
                            }
                        );
                };

                handleEntranceAnim(self);
            };

            const featuredResources = () => {
                const self = el.find("section.resources-featured");
                if (!self.length) return;

                const handleEntranceAnim = (self) => {
                    const title = self.find(".block-title");
                    const paraCTA = self.find(".block-duo");
                    const cards = self.find('.rc-card');

                    const elAnims = [title, paraCTA].filter(el => el.length > 0);

                    const entranceAnim = gsap.timeline({
                        scrollTrigger: {
                            trigger: self,
                            start: baunfire.anim.start
                        }
                    })
                        .fromTo(elAnims,
                            {
                                y: 40,
                                autoAlpha: 0
                            },
                            {
                                y: 0,
                                autoAlpha: 1,
                                duration: 0.8,
                                stagger: { each: 0.2 },
                                ease: "power2.out"
                            }
                        );

                    if (cards.length) {
                        entranceAnim
                            .fromTo(cards,
                                {
                                    y: 40,
                                    autoAlpha: 0
                                },
                                {
                                    autoAlpha: 1,
                                    y: 0,
                                    duration: 0.6,
                                    ease: "power2.out",
                                    stagger: { each: 0.2 }
                                },
                                ">-0.8"
                            );
                    }
                };

                handleEntranceAnim(self);
            };

            const contentCTA = () => {
                const self = el.find("section.content-cta");
                if (!self.length) return;

                const handleEntranceAnim = (self) => {
                    const bg = self.find(".bg");
                    const box = self.find(".box");
                    const marquee = self.find(".marquee-inner");

                    const elAnims = [box, marquee].filter(el => el.length > 0);

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
                                ease: "power2.out"
                            }
                        )
                        .fromTo(elAnims,
                            {
                                y: 40,
                                autoAlpha: 0
                            },
                            {
                                y: 0,
                                autoAlpha: 1,
                                duration: 0.8,
                                ease: "power2.out",
                                stagger: { each: 0.2 }
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
                };

                handleEntranceAnim(self);
                handleMarquee(self);
            }

            resourceHero();
            resourceBody();
            subscribeCTA();
            featuredResources();
            contentCTA();
        }
    };

    baunfire.addModule(baunfire.Animation);
})();
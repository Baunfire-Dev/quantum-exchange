(function () {
    const $ = baunfire.$;

    baunfire.Animation = {
        init() {
            this.handleNav();
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
        },

        handleNav() {
            const nav = $("nav");
            if (!nav.length) return;

            const parents = nav.find(".nav-item.parent");

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

                parents.on('mouseenter', function () {
                    if (!window.matchMedia("(min-width: 1200px)").matches) return;
                    const self = $(this);

                    clearTimeout(hideTimeout);

                    if (activeDropdown && activeDropdown !== this) {
                        $(activeDropdown).removeClass('open');
                    }

                    self.addClass('open');
                    activeDropdown = this;
                });

                parents.on('mouseleave', function () {
                    if (!window.matchMedia("(min-width: 1200px)").matches) return;
                    const self = $(this);

                    hideTimeout = setTimeout(() => {
                        self.removeClass('open');
                        if (activeDropdown === this) activeDropdown = null;
                    }, timeoutDuration);
                });
            }

            const mobileDDPanel = () => {
                // const navPanel = nav.find(".nav-panel");

                parents.each(function () {
                    const subSelf = $(this);
                    const inner = subSelf.find(".nav-item-inner");

                    inner.click(function () {
                        if (!window.matchMedia("(max-width: 1200px)").matches) return;

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
                        isDesktop: `(min-width: 1200px)`,
                        isMobile: `(max-width: 1199.98px)`,
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
    };

    baunfire.addModule(baunfire.Animation);
})();
(function () {
    const $ = baunfire.$;

    baunfire.Animation = {
        init() {
            this.handleNav();
            this.handleSearch();
            this.handleButtonHover();
            this.handleResourceAnim();
            this.handleAuthorsPage();
        },

        handleButtonHover() {
            const btn = $("a.btn, #search-load-more");
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

            const handleAnnouncement = () => {
                const anmt = nav.find(".nav__anmt");
                if (!anmt.length) return;

                const CAROUSEL_CONFIG = {
                    autoplayDelay: 10000,
                    animDuration: 0.5,
                    ease: "power2.inOut",
                };

                const inner = anmt.find(".nav__anmt-inner");
                const itemsWrap = inner.find(".nav__anmt-items");
                const items = itemsWrap.find(".nav__anmt-item");
                const count = items.length;

                if (count < 2) return;

                const dotsWrap = inner.find(".nav__anmt-dots").empty();

                for (let i = 0; i < count; i++) {
                    $("<div>", { class: "nav__anmt-dot" + (i === 0 ? " active" : "") }).data("index", i).appendTo(dotsWrap);
                }

                let current = 0;
                let timer = null;
                let isAnimating = false;

                items.each(function (i) {
                    gsap.set(this, {
                        position: i === 0 ? "relative" : "absolute",
                        top: 0, left: 0, width: "100%",
                        opacity: i === 0 ? 1 : 0,
                        yPercent: i === 0 ? 0 : 100,
                        zIndex: i === 0 ? 2 : 1,
                    });
                });

                gsap.set(itemsWrap[0], { position: "relative" });
                anmt.addClass("active");

                const goTo = (next) => {
                    if (isAnimating || next === current) return;
                    isAnimating = true;

                    const curr = items.eq(current);
                    const nextItem = items.eq(next);
                    const { animDuration, ease } = CAROUSEL_CONFIG;

                    gsap.set(nextItem[0], { yPercent: 100, opacity: 1, zIndex: 3 });
                    gsap.set(curr[0], { zIndex: 2 });

                    gsap.timeline({
                        onComplete() {
                            gsap.set(curr[0], { opacity: 0, yPercent: 100, zIndex: 1, position: "absolute" });
                            gsap.set(nextItem[0], { zIndex: 2, position: "relative" });
                            current = next;
                            isAnimating = false;
                        },
                    })
                        .to(curr[0], { yPercent: -80, opacity: 0, duration: animDuration, ease }, 0)
                        .to(nextItem[0], { yPercent: 0, opacity: 1, duration: animDuration, ease }, 0);

                    dotsWrap.find(".nav__anmt-dot").removeClass("active").eq(next).addClass("active");
                };

                const startTimer = () => {
                    stopTimer();
                    timer = setInterval(() => goTo((current + 1) % count), CAROUSEL_CONFIG.autoplayDelay);
                };

                const stopTimer = () => {
                    clearInterval(timer);
                    timer = null;
                };

                dotsWrap.on("click", ".nav__anmt-dot", function () {
                    stopTimer();
                    goTo($(this).data("index"));
                    startTimer();
                });

                inner
                    .on("mouseenter", stopTimer)
                    .on("mouseleave", startTimer);

                startTimer();
            };

            toggleNav();
            toggleBGOnScroll();
            burgerEvent();
            desktopDDPanel();
            mobileDDPanel();
            handleAnnouncement();
        },

        handleSearch() {
            const toggleSearch = () => {
                const nav = $("nav");
                if (!nav.length) return;

                const searchBtn = $(".nav-search-btn");

                searchBtn.click(function () {
                    nav.toggleClass("is-searching");
                });
            }

            const handleSearch = () => {
                const searchInput = $(".nav-search-input input");

                searchInput.each(function () {
                    const self = $(this);

                    self.on('keydown', function (e) {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            const action = self.data("action");
                            window.location.href = `${action}${self.val()}`;
                        }
                    });
                })
            };

            const handleSearchResults = () => {
                const searchItems = $(".search-item");
                if (!searchItems.length) return;

                const loadMore = $("#search-load-more");
                let baseVisibleCount = 7;
                let visibleCount = baseVisibleCount;
                let itemsPerPage = baseVisibleCount;

                loadMore.on("click", function () {
                    visibleCount += itemsPerPage;
                    updateDisplayLoadMore();
                });

                const updateDisplayLoadMore = (isInitial = false) => {
                    const visibleItems = searchItems.slice(0, visibleCount);
                    visibleItems.addClass("active");

                    const newItems = isInitial ? searchItems : searchItems.slice(visibleCount - itemsPerPage, visibleCount);

                    gsap.fromTo(newItems,
                        { autoAlpha: 0, x: 20 },
                        { autoAlpha: 1, x: 0, overwrite: true, duration: 0.6, stagger: 0.032, ease: "power2.out" }
                    );

                    baunfire.Global.screenSizeChange();

                    if (visibleCount < searchItems.length) {
                        loadMore.addClass("active");
                    } else {
                        loadMore.removeClass("active");
                    }
                };

                updateDisplayLoadMore(true);
            }

            toggleSearch();
            handleSearch();
            handleSearchResults();
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
            };

            resourceHero();
            resourceBody();
            subscribeCTA();
            featuredResources();
            contentCTA();
        },

        handleAuthorsPage() {
            const authorHead = () => {
                const script = () => {
                    const el = $(".auth-head");
                    if (!el.length) return;

                    handleEntranceAnim(el);
                };

                const handleEntranceAnim = (self) => {
                    const title = self.find(".block-title");
                    const para = self.find(".block-para");
                    const bio = self.find(".block-bio");

                    const elAnims = [title, para, bio].filter(el => el.length > 0);

                    gsap.fromTo(elAnims,
                        {
                            y: 40,
                            autoAlpha: 0
                        },
                        {
                            y: 0,
                            autoAlpha: 1,
                            duration: 0.8,
                            stagger: { each: 0.2 },
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: self,
                                start: baunfire.anim.start
                            }
                        },
                    )
                };

                script();
            };

            const authorBody = () => {
                const script = () => {
                    const el = $(".auth-body");
                    if (!el.length) return;

                    const cardsContainer = el.find(".cards-container");
                    const baseVisibleCount = cardsContainer.data("per-page");

                    const items = el.find(".rc");
                    if (!items.length) return;

                    const resData = {
                        parent: el,
                        items: items,
                        baseVisibleCount: baseVisibleCount,
                        activeVisibleCount: baseVisibleCount,
                        loadMore: el.find(".load-more"),
                        emptyText: el.find(".empty"),
                        reset: el.find(".reset"),
                    }

                    handleLoadMore(resData);
                    refreshVisibleItems(resData);
                };

                const handleLoadMore = (resData) => {
                    const { loadMore, baseVisibleCount } = resData;

                    loadMore.click(function () {
                        resData.activeVisibleCount += baseVisibleCount;
                        refreshVisibleItems(resData);
                    });
                };

                const refreshVisibleItems = (resData, reset = false) => {
                    const { parent, activeVisibleCount, loadMore, emptyText } = resData;
                    emptyText.removeClass("active");

                    const items = (resData.items || $()).filter(".in-filter");

                    if (items.length) {
                        items.removeClass("active");
                        const visibleItems = items.slice(0, activeVisibleCount).addClass("active");

                        visibleItems.find(".rc-thumbnail img[data-src]").each(function () {
                            const image = $(this);
                            image.attr("src", image.data("src")).removeAttr("data-src");
                            image.closest(".rc-thumbnail").addClass("active");
                        });

                        loadMore.toggleClass("active", activeVisibleCount < items.length);
                    } else {
                        loadMore.removeClass("active");
                        emptyText.addClass("active");
                    }

                    baunfire.Global.screenSizeChange();

                    if (reset) repositionScroll(parent);
                };

                const repositionScroll = (el) => {
                    baunfire.lenis?.scrollTo(el.get(0), {
                        duration: 1,
                        offset: 0,
                        lock: false
                    })
                };

                script();
            };

            authorHead();
            authorBody();
        },
    };

    baunfire.addModule(baunfire.Animation);
})();
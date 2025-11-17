baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.tabs-expanding-tiles");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                const data = {
                    items: self.find(".tab-item"),
                    panels: self.find(".tab-panel")
                }

                handleCarousels(self, data);
                handleEntranceAnim(self);
                handleSelect(self, data);
                handleTabs(self, data);
            });
        };

        const handleEntranceAnim = (self) => {
            const title = self.find(".block-title");
            const tabsNav = self.find(".block-duo");
            const cards = self.find('.tab-panel.active .item-card');

            const elAnims = [title, tabsNav].filter(el => el.length > 0);

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
                        ">-1.2"
                    );
            }
        };

        const handleCarousels = (self, data) => {
            const panels = data.panels;

            panels.each(function () {
                const subSelf = $(this);
                const carousel = subSelf.find(".owl-carousel");

                const next = subSelf.find(".ar-r");
                const prev = subSelf.find(".ar-l");

                const carouselInstance = carousel.owlCarousel({
                    rewind: true,
                    dots: true,
                    dotsEach: true,
                    margin: 24,
                    autoplay: false,
                    responsive: {
                        0: {
                            items: 1,
                        },
                        768: {
                            items: 2,
                        },
                        1024: {
                            items: 3,
                        },
                    },
                    onInitialized: () => {
                        baunfire.Global.screenSizeChange();
                    },
                    onResized: () => {
                        baunfire.Global.screenSizeChange();
                    }
                });

                next.click(function () {
                    carousel.trigger('next.owl.carousel');
                });

                prev.click(function () {
                    carousel.trigger('prev.owl.carousel');
                });
            })
        };

        const handleSelect = (self, data) => {
            const select = self.find(".tab-select select");

            if (select.length) {
                select.select2({
                    minimumResultsForSearch: -1,
                    width: "100%",
                    dropdownParent: select.parent()
                });

                select.on("change", function () {
                    const tabIndex = $(this).val();
                    self.find(`.tab-item[data-index="${tabIndex}"]`).trigger("click");
                });
            }
        };

        const handleTabs = (self, data) => {
            const { items, panels } = data;

            items.click(function () {
                const subSelf = $(this);
                if (subSelf.hasClass("active")) return;

                const tabIndex = subSelf.data("index");
                panels.removeClass("active");
                items.removeClass("active");
                subSelf.addClass("active");

                switchTab(self, tabIndex);
                updateSelect(self, tabIndex);
            });
        };

        const switchTab = (self, tabIndex) => {
            const targetPanel = self.find(`.tab-panel[data-index="${tabIndex}"]`);
            targetPanel.addClass("active");

            const carousel = targetPanel.find(".owl-carousel");

            if (carousel.length && carousel.data("owl.carousel")) {
                carousel.trigger("refresh.owl.carousel");
                baunfire.Global.screenSizeChange();
            }
        };

        const updateSelect = (self, tabIndex) => {
            const select = self.find(".tab-select select");
            
            if (select.length) {
                select.val(tabIndex).trigger("change.select2");
            }
        };

        script();
    },
});

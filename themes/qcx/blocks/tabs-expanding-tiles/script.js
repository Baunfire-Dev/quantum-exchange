baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.tabs-expanding-tiles");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                handleEntranceAnim(self);
                initSelect2(self);
                handleTabContent(self);
                handleCarousel(self);
                animateInitialCards(self);
            });
        }

        const initSelect2 = (self) => {
            const select = self.find(".tab-select");
            
            if (select.length) {
                select.select2({
                    minimumResultsForSearch: -1,
                    width: '100%'
                });

                const arrowSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M8.70703 0.707031L4.70703 4.70703L0.707031 0.707032" stroke="white" stroke-linecap="square"/>
                </svg>`;

                select.data('select2').$container.find('.select2-selection__arrow b').replaceWith(arrowSvg);

                select.on('change', function() {
                    const tabIndex = $(this).val();
                    switchTab(self, tabIndex);
                });
            }
        };

        const switchTab = (self, tabIndex) => {
            const tabPanels = self.find(".tab-panel");
            const targetPanel = self.find(`.tab-panel[data-panel="${tabIndex}"]`);
            const currentPanel = self.find(".tab-panel.active");

            if (currentPanel.data("panel") == tabIndex) return;

            tabPanels.removeClass("active").hide();
            targetPanel.addClass("active").show();

            const carousel = targetPanel.find(".owl-carousel");
            if (carousel.length && carousel.data('owl.carousel')) {
                carousel.trigger('refresh.owl.carousel');
            }
        };

        const handleEntranceAnim = (self) => {
            const blockTitle = self.find(".block-title");
            const categoryTabs = self.find(".category-tabs");
            const pagination = self.find(".pagination").first();

            const entranceAnim = gsap.timeline({
                scrollTrigger: {
                    trigger: self,
                    start: baunfire.anim.start
                }
            })
                .fromTo([blockTitle, categoryTabs, pagination],
                    {
                        y: "40",
                        autoAlpha: 0
                    },
                    {
                        y: 0,
                        autoAlpha: 1,
                        duration: 0.8,
                        stagger: { each: 0.2 },
                        ease: Power2.easeOut
                    }
                );
        };

        const animateInitialCards = (self) => {
            const activePanel = self.find(".tab-panel.active");
            const items = activePanel.find('.owl-item:not(.cloned) .item-content');
            
            ScrollTrigger.create({
                trigger: self,
                start: "top 80%",
                once: true,
                onEnter: () => {
                    items.each(function(index) {
                        const card = $(this);
                        
                        gsap.fromTo(card, 
                            { opacity: 0, y: 30 },
                            { opacity: 1, y: 0, duration: 0.6, delay: index * 0.2, ease: "power2.out" }
                        );
                    });
                }
            });
        };

        const handleTabContent = (self) => {
            const tabBtns = self.find(".tab-btn");
            const tabPanels = self.find(".tab-panel");

            tabBtns.on("click", function() {
                const btn = $(this);
                const tabIndex = btn.data("tab");

                tabBtns.removeClass("active");
                btn.addClass("active");

                switchTab(self, tabIndex);
            });

            tabPanels.each(function(index) {
                if (index !== 0) {
                    $(this).hide();
                }
            });
        }

        const handleCarousel = (self) => {
            const tabPanels = self.find(".tab-panel");

            tabPanels.each(function() {
                const panel = $(this);
                const carousel = panel.find(".owl-carousel");
                const next = panel.find(".ar-r");
                const prev = panel.find(".ar-l");

                if (!carousel.length) return;

                carousel.owlCarousel({
                    loop: true,
                    rewind: true,
                    dots: true,
                    dotsEach: true,
                    items: 3,
                    margin: 24,
                    center: true,
                    autoWidth: false,
                    responsive: {
                        0: {
                            items: 1,
                            center: true
                        },
                        768: {
                            items: 2,
                            center: true
                        },
                        1024: {
                            items: 3,
                            center: true
                        }
                    }
                });

                next.on("click", function () {
                    carousel.trigger('next.owl.carousel');
                });

                prev.on("click", function () {
                    carousel.trigger('prev.owl.carousel');
                });
            });
        };

        script();
    }
});
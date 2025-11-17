baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.tabs-team-grid");
            if (!els.length) return;

            els.each(function (index) {
                const self = $(this);

                const items = self.find(".item");
                if (!items.length) return;

                const resData = {
                    parent: self,
                    items: items,
                    activeType: null,
                    tabs: self.find(".tab-item"),
                    emptyText: self.find(".empty"),
                    typeSelect: self.find("select"),
                }

                handleSelect(resData);
                handleTabs(resData);
                refreshVisibleItems(resData);
                handleEntranceAnim(self);
                handleBio(resData);
            });
        };

        const handleBio = (resData) => {
            const { items } = resData;

            items.each(function () {
                const subSelf = $(this);
                const cta = subSelf.find(".item-cta");
                const dialog = subSelf.find("dialog");
                const close = subSelf.find(".dg-close");

                cta.click(function () {
                    dialog.get(0).showModal();
                    baunfire.Global.siteScrolling(false);
                });

                close.click(function () {
                    dialog.get(0).close();
                    baunfire.Global.siteScrolling();
                });
            });
        };

        const handleEntranceAnim = (self) => {
            const title = self.find(".block-title");
            const tabs = self.find(".block-tabs");
            const items = self.find('.item');

            const elAnims = [title, tabs].filter(el => el.length > 0);

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

            if (items.length) {
                entranceAnim
                    .fromTo(items,
                        {
                            y: 40,
                            autoAlpha: 0
                        },
                        {
                            autoAlpha: 1,
                            y: 0,
                            duration: 0.6,
                            ease: "power2.out",
                            stagger: { each: 0.2 },
                            onComplete: () => {
                                gsap.set(items, { clearProps: true })
                            }
                        },
                        ">-0.8"
                    );
            }
        };

        const handleSelect = (resData) => {
            const { typeSelect } = resData;

            if (typeSelect.length) {
                typeSelect.select2({
                    width: "100%",
                    placeholder: typeSelect.attr("placeholder"),
                    minimumResultsForSearch: -1,
                    dropdownParent: typeSelect.parent()
                });

                typeSelect.on("change.select2", function () {
                    const selectedValue = $(this).val();
                    resData.activeType = selectedValue && selectedValue !== 'all' ? selectedValue : null;
                    processItems(resData);
                });
            }
        };

        const handleTabs = (resData) => {
            const { tabs } = resData;
            if (!tabs.length) return;

            tabs.click(function () {
                const subSelf = $(this);
                if (subSelf.hasClass("active")) return;

                const value = subSelf.data("value");
                tabs.removeClass("active");
                subSelf.addClass("active");

                updateSelect(resData, value);
            });
        };

        const updateSelect = (resData, value) => {
            const { typeSelect } = resData;

            if (typeSelect.length) {
                typeSelect.val(value).trigger("change.select2");
            }
        };

        const processItems = (resData) => {
            const { items, activeType } = resData;
            items.removeClass("active in-filter");

            items.each(function () {
                const self = $(this);
                let matchesFilter = true;

                if (activeType) {
                    const itemType = self.data("type");
                    matchesFilter = itemType === activeType;
                }

                if (matchesFilter) {
                    self.addClass("in-filter");
                }
            });

            refreshVisibleItems(resData, true);
        };

        const refreshVisibleItems = (resData, reset = false) => {
            const { parent, emptyText } = resData;
            emptyText.removeClass("active");

            const items = (resData.items || $()).filter(".in-filter");

            if (items.length) {
                items.addClass("active");
            } else {
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
    }
});
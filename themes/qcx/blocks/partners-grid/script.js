baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.partners-grid");
            if (!els.length) return;

            els.each(function (index) {
                const self = $(this);

                const cardsContainer = self.find(".cards-container");
                const baseVisibleCount = cardsContainer.data("per-page");

                const items = self.find(".pc");
                if (!items.length) return;

                const resData = {
                    parent: self,
                    items: items,
                    activeCategory: "all",
                    baseVisibleCount: baseVisibleCount,
                    activeVisibleCount: baseVisibleCount,
                    loadMore: self.find(".load-more"),
                    emptyText: self.find(".empty"),
                    tabItems: self.find(".tab-item"),
                }

                handleLoadMore(resData);
                handleFilter(resData);
                refreshVisibleItems(resData);
            });
        }

        const handleLoadMore = (resData) => {
            const { loadMore, baseVisibleCount } = resData;

            loadMore.click(function () {
                resData.activeVisibleCount += baseVisibleCount;
                refreshVisibleItems(resData);
            });
        };

        const handleFilter = (resData) => {
            const { tabItems } = resData;

            tabItems.click(function () {
                const clickedTab = $(this);
                const slug = clickedTab.data("slug");

                tabItems.removeClass("active");
                clickedTab.addClass("active");

                resData.activeCategory = slug;
                processItems(resData);
            });
        };

        const processItems = (resData) => {
            const { items, baseVisibleCount, activeCategory } = resData;
            items.removeClass("active in-filter");

            items.each(function () {
                const self = $(this);
                let matchesFilter = true;

                if (activeCategory && activeCategory !== "all") {
                    const itemCategory = self.data("category") || self.data("slug");
                    matchesFilter = itemCategory === activeCategory;
                }

                if (matchesFilter) {
                    self.addClass("in-filter");
                }
            });

            resData.activeVisibleCount = baseVisibleCount;
            refreshVisibleItems(resData, true);
        };

        const refreshVisibleItems = (resData, reset = false) => {
            const { parent, activeVisibleCount, loadMore, emptyText } = resData;
            emptyText.removeClass("active");

            const items = (resData.items || $()).filter(".in-filter");

            if (items.length) {
                items.removeClass("active");
                const visibleItems = items.slice(0, activeVisibleCount).addClass("active");

                visibleItems.find(".pc-logo img[data-src]").each(function () {
                    const image = $(this);
                    image.attr("src", image.data("src")).removeAttr("data-src");
                    image.closest(".pc-logo").addClass("active");
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
    }
});
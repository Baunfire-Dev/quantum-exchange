baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.grid-solutions");
            if (!els.length) return;

            els.each(function (index) {
                const self = $(this);

                baunfire.Animation.headingParaAnimation(self.find(".block-heading"), null, {
                    trigger: self,
                    start: baunfire.anim.start,
                });

                const cardsContainer = self.find(".cards-container");
                const baseVisibleCount = cardsContainer.data("per-page");

                const items = self.find(".card");
                if (!items.length) return;

                const resData = {
                    parent: self,
                    items: items,
                    activeQuery: '',
                    activeCategory: [],
                    search: self.find(".search input"),
                    baseVisibleCount: baseVisibleCount,
                    activeVisibleCount: baseVisibleCount,
                    filters: self.find(".filter-item input[type='checkbox']"),
                    loadMore: self.find(".load-more"),
                    emptyText: self.find(".empty"),
                    reset: self.find(".reset"),
                    applyFilter: self.find(".apply"),
                }

                handleLoadMore(resData);
                handleSearch(resData);
                handleReset(resData);
                handleFilter(resData);
                handlePreFilter(resData);
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

        const handlePreFilter = (resData) => {
            const { parent, filters } = resData;
            if (!filters.length) return;

            const raw = new URLSearchParams(window.location.search).get("category");
            const params = raw ? raw.split(",") : [];
            if (!params.length) return;

            const validFilters = [];

            params.forEach(param => {
                const targetFilter = parent.find(`input[type="checkbox"][value="${param}"]`);

                if (targetFilter.length) {
                    targetFilter.prop("checked", true);
                    validFilters.push(param);
                }
            });

            if (validFilters.length) {
                resData.activeCategory = validFilters;
                processItems(resData);
            }
        };

        const handleFilter = (resData) => {
            const { parent, filters, applyFilter, baseVisibleCount } = resData;
            if (!filters.length) return;

            const dd = parent.find(".filter-dd");
            const btn = parent.find(".filter-btn");

            btn.click(function () {
                dd.toggleClass("active");
                baunfire.Global.screenSizeChange();
            });

            applyFilter.click(function () {
                resData.activeCategory = filters.filter(":checked").map(function () { return this.value }).get();
                processItems(resData);
            });
        };

        const handleSearch = (resData) => {
            const { search } = resData;

            const runSearch = baunfire.Global.debounce((value) => {
                resData.activeQuery = value.toLowerCase().trim();
                processItems(resData);
            }, 300);

            search.on("keyup", function (e) {
                e.preventDefault();
                runSearch(this.value);
            });
        };

        const processItems = (resData) => {
            const { items, baseVisibleCount, activeQuery, activeCategory } = resData;
            items.removeClass("active in-filter");

            items.each(function () {
                const self = $(this);

                let matchesQuery = true;

                if (activeQuery) {
                    const title = self.find(".title").text().toLowerCase();
                    matchesQuery = title.includes(activeQuery.toLowerCase());
                }

                let matchesCategory = true;

                if (activeCategory.length > 0) {
                    const categoryArray = Object.values(self.data("category") || {});
                    matchesCategory = activeCategory.some(cat => categoryArray.includes(cat));
                }

                if (matchesQuery && matchesCategory) {
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

                visibleItems.find(".card-image img[data-src]").each(function () {
                    const image = $(this);
                    image.attr("src", image.data("src")).removeAttr("data-src");
                    image.closest(".card-image").addClass("active");
                });

                loadMore.toggleClass("active", activeVisibleCount < items.length);
            } else {
                loadMore.removeClass("active");
                emptyText.addClass("active");
            }

            baunfire.Global.screenSizeChange();

            if (reset) repositionScroll(parent);
        };

        const handleReset = (resData) => {
            const { items, reset, emptyText, filters, loadMore, baseVisibleCount } = resData;

            reset.on("click", function () {
                resData.activeVisibleCount = baseVisibleCount;
                resData.activeQuery = "";
                resData.activeCategory = [];
                resData.search.val("");

                loadMore.removeClass("active");
                emptyText.removeClass("active");
                items.removeClass("active").addClass("in-filter");
                filters.prop("checked", false);
                refreshVisibleItems(resData, true);
            });
        };

        const repositionScroll = (el) => {
            // gsap.to(window, {
            //     duration: 1,
            //     overwrite: true,
            //     scrollTo: { y: el, offsetY: 0, autoKill: true },
            //     ease: "circ.out",
            // });

            baunfire.lenis?.scrollTo(el.get(0), {
                duration: 1,
                offset: 0,
                lock: false
            })
        };

        script();
    }
});

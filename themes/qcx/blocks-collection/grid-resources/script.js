baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.grid-resources");
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
                    filterGroups: self.find(".filter-group"),
                    filters: self.find(".filter-item input[type='checkbox']"),
                    loadMore: self.find(".load-more"),
                    emptyText: self.find(".empty"),
                    reset: self.find(".reset"),
                }

                handleLoadMore(resData);
                handleSearch(resData);
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
            const { parent, filters, filterGroups } = resData;
            if (!filters.length) return;

            const handleFilterChange = baunfire.Global.debounce(() => {
                resData.activeCategory = filters
                    .filter(":checked")
                    .map(function () { return this.value })
                    .get();

                processItems(resData);
            }, 100);

            const handleFilterGroups = () => {
                filterGroups.each(function () {
                    const subSelf = $(this);

                    const childFilters = subSelf.find(".filter-item input[type='checkbox']");
                    const select = subSelf.find(".filter-dd select");
                    const clear = subSelf.find(".filter-clear");

                    clear.on("click", function () {
                        childFilters.prop("checked", false);
                        select.val(null).trigger("change");
                        handleFilterChange();
                    });

                    const instance = select.select2({
                        width: "100%",
                        placeholder: select.attr("placeholder"),
                        minimumResultsForSearch: -1,
                        dropdownParent: select.parent(),
                        multiple: true
                    });

                    instance.val(null).trigger("change");

                    instance.on("change", function () {
                        const selectedValues = $(this).val() || [];
                        childFilters.each(function () {
                            $(this).prop("checked", selectedValues.includes(this.value));
                        });

                        handleFilterChange();
                    });

                    childFilters.on("change", function () {
                        const checkedValues = childFilters.filter(":checked").map(function () {
                            return this.value;
                        }).get();

                        select.val(checkedValues).trigger("change.select2");
                        handleFilterChange();
                    });
                });
            }

            const handlePreFilter = () => {
                const raw = new URLSearchParams(window.location.search).get("category");
                const params = raw ? raw.split(",") : [];
                if (!params.length) return;

                const validFilters = [];
                const missing = [];

                params.forEach(param => {
                    const targetFilter = parent.find(`input[type="checkbox"][value="${param}"]`);

                    if (targetFilter.length) {
                        targetFilter.prop("checked", true);
                        validFilters.push(param);
                    } else {
                        missing.push(param);
                    }
                });

                if (validFilters.length) {
                    const select = parent.find(".filter-dd select");
                    select.val(validFilters).trigger("change.select2");

                    handleFilterChange();
                }

                if (missing.length) {
                    createToast(`Some of the specified categories could not be found: ${missing.join(", ")}.`);
                }
            };


            handleFilterGroups();
            handlePreFilter();
        };

        const createToast = (message) => {
            Toastify({
                text: message,
                duration: 5000,
                close: true,
                offset: {
                    y: "6em",
                },
                style: {
                    background: "#EE5833",
                },
                gravity: "top",
                position: "center",
            }).showToast();
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

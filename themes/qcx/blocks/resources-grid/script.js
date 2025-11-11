baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.resources-grid");
            if (!els.length) return;

            els.each(function (index) {
                const self = $(this);

                const cardsContainer = self.find(".cards-container");
                const baseVisibleCount = cardsContainer.data("per-page");

                const items = self.find(".rc");
                if (!items.length) return;

                const resData = {
                    parent: self,
                    items: items,
                    activeType: null,
                    activeCategory: null,
                    baseVisibleCount: baseVisibleCount,
                    activeVisibleCount: baseVisibleCount,
                    loadMore: self.find(".load-more"),
                    emptyText: self.find(".empty"),
                    reset: self.find(".reset"),
                    typeSelect: self.find("select[placeholder='type']"),
                    categorySelect: self.find("select[placeholder='category']"),
                }

                handleSelect(resData);
                handleLoadMore(resData);
                handleFilter(resData);
                refreshVisibleItems(resData);
            });
        }

        const handleSelect = (resData) => {
            const { typeSelect, categorySelect } = resData;
            
            if (typeSelect.length) {
                const typeInstance = typeSelect.select2({
                    width: "100%",
                    placeholder: typeSelect.attr("placeholder"),
                    minimumResultsForSearch: -1,
                    dropdownParent: typeSelect.parent()
                });

                typeInstance.val(null).trigger("change");
            }

            if (categorySelect.length) {
                const categoryInstance = categorySelect.select2({
                    width: "100%",
                    placeholder: categorySelect.attr("placeholder"),
                    minimumResultsForSearch: -1,
                    dropdownParent: categorySelect.parent()
                });

                categoryInstance.val(null).trigger("change");
            }
        };

        const handleLoadMore = (resData) => {
            const { loadMore, baseVisibleCount } = resData;

            loadMore.click(function () {
                resData.activeVisibleCount += baseVisibleCount;
                refreshVisibleItems(resData);
            });
        };

        const handleFilter = (resData) => {
            const { typeSelect, categorySelect, reset } = resData;

            if (typeSelect.length) {
                typeSelect.on("change", function () {
                    const selectedValue = $(this).val();
                    resData.activeType = selectedValue && selectedValue !== 'all' ? selectedValue : null;
                    processItems(resData);
                });
            }

            if (categorySelect.length) {
                categorySelect.on("change", function () {
                    const selectedValue = $(this).val();
                    resData.activeCategory = selectedValue && selectedValue !== 'all' ? selectedValue : null;
                    processItems(resData);
                });
            }

            // if (reset.length) {
            //     reset.click(function () {
            //         resData.activeType = null;
            //         resData.activeCategory = null;
                    
            //         if (typeSelect.length) {
            //             typeSelect.val(null).trigger("change");
            //         }
                    
            //         if (categorySelect.length) {
            //             categorySelect.val(null).trigger("change");
            //         }
                    
            //         processItems(resData);
            //     });
            // }
        };

        const processItems = (resData) => {
            const { items, baseVisibleCount, activeType, activeCategory } = resData;
            items.removeClass("active in-filter");

            items.each(function () {
                const self = $(this);
                let matchesFilter = true;

                if (activeType) {
                    const itemType = self.data("type");
                    matchesFilter = itemType === activeType;
                }

                else if (activeCategory) {
                    const itemCategory = self.data("category");
                    
                    if (typeof itemCategory === 'string') {
                        matchesFilter = itemCategory === activeCategory;
                    } else if (Array.isArray(itemCategory)) {
                        matchesFilter = itemCategory.includes(activeCategory);
                    } else if (typeof itemCategory === 'object') {
                        const categoryArray = Object.values(itemCategory || {});
                        matchesFilter = categoryArray.includes(activeCategory);
                    }
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
    }
});
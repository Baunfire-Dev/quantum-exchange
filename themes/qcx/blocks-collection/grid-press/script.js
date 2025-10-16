baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.grid-press");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);

                baunfire.Animation.headingParaAnimation(self.find(".block-heading"), self.find(".block-para"), {
                    trigger: self,
                    start: baunfire.anim.start,
                });

                handlePagination(self);
            });
        }

        const handlePagination = (self) => {
            const itemsContainer = self.find(".items-container");
            if (!itemsContainer.length) return;

            const itemsPerPage = itemsContainer.data("per-page");
            const items = itemsContainer.find(".item");
            const totalItems = items.length;
            const totalPages = Math.ceil(totalItems / itemsPerPage);

            const pagination = itemsContainer.find(".pagination");

            if (totalPages <= 1) {
                pagination.hide();
                itemsContainer.addClass("active");
                baunfire.Global.screenSizeChange();
                return;
            }

            let currentPage = 1;

            const showPage = (page, init = false) => {
                currentPage = page;
                items.hide();

                const start = (page - 1) * itemsPerPage;
                const end = start + itemsPerPage;

                items.hide();

                const currentItems = items.slice(start, end).show();

                gsap.fromTo(currentItems,
                    { autoAlpha: 0, x: 20 },
                    { autoAlpha: 1, x: 0, duration: 0.6, stagger: 0.032, ease: Power2.easeOut }
                );

                renderPagination();

                if (init) {
                    itemsContainer.addClass("active");
                } else {
                    baunfire.lenis?.scrollTo(self.get(0), {
                        duration: 1,
                        offset: 0,
                        lock: true
                    })
                }

                baunfire.Global.screenSizeChange();
            };

            const renderPagination = () => {
                pagination.empty();

                pagination.append(`<span class="page prev ${currentPage === 1 ? "disabled" : ""}"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 12L12 18L12.6677 17.3323L7.80756 12.4722H18V11.5278H7.80756L12.6677 6.66769L12 6L6 12Z" fill="#121212"/></svg></span>`);
                pagination.append(`<span class="page ${currentPage === 1 ? "active" : ""}">1</span>`);

                let startPage, endPage;

                if (totalPages <= 6) {
                    startPage = 2;
                    endPage = totalPages - 1;
                    pagination.append(renderRange(startPage, endPage));
                } else {
                    if (currentPage <= 3) {
                        startPage = 2;
                        endPage = 4;
                        pagination.append(renderRange(startPage, endPage));
                        pagination.append(`<span class="dots">...</span>`);
                    } else if (currentPage >= totalPages - 2) {
                        pagination.append(`<span class="dots">...</span>`);
                        startPage = totalPages - 3;
                        endPage = totalPages - 1;
                        pagination.append(renderRange(startPage, endPage));
                    } else {
                        pagination.append(`<span class="dots">...</span>`);
                        startPage = currentPage - 1;
                        endPage = currentPage + 1;
                        pagination.append(renderRange(startPage, endPage));
                        pagination.append(`<span class="dots">...</span>`);
                    }
                }

                if (totalPages > 1) {
                    pagination.append(`<span class="page ${currentPage === totalPages ? "active" : ""}">${totalPages}</span>`);
                }

                pagination.append(`<span class="page next ${currentPage === totalPages ? "disabled" : ""}"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 12L12 18L11.3323 17.3323L16.1924 12.4722H6V11.5278H16.1924L11.3323 6.66769L12 6L18 12Z" fill="#121212"/></svg></span>`);
            };

            const renderRange = (start, end) => {
                let html = "";
                for (let i = start; i <= end; i++) {
                    html += `<span class="page ${i === currentPage ? "active" : ""}">${i}</span>`;
                }
                return html;
            };

            pagination.on("click", ".page", function () {
                const subSelf = $(this);
                const text = subSelf.text();

                if (subSelf.hasClass("disabled")) {
                    return;
                }

                if (subSelf.hasClass("prev")) {
                    showPage(currentPage - 1);
                } else if (subSelf.hasClass("next")) {
                    showPage(currentPage + 1);
                } else if ($.isNumeric(text)) {
                    showPage(parseInt(text, 10));
                }
            });

            showPage(1, true);
        };


        script();
    }
});
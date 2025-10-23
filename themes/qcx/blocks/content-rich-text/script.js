baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-rich-text-rc-start");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                const end = self.nextAll('section.content-rich-text-rc-end').first();
                const container = self.find('.content');

                if (!end.length || !container.length) return;

                let node = self[0].nextSibling;
                while (node && node !== end[0]) {
                    const next = node.nextSibling;
                    container[0].appendChild(node);
                    node = next;
                }

                self.removeClass('content-rich-text-rc-start').addClass('content-rich-text');
                end.remove();
            });

            richTexts();
            baunfire.Global.screenSizeChange();
        }

        const richTexts = () => {
            const els = $("section.content-rich-text");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);

                // stylizeButtons(contentArea);

                if (self.hasClass("is-resource")) {
                    handleTOC(self);
                }
            });
        }

        const handleTOC = (self) => {
            const container = self.find(".content-toc");
            const headings = self.find(".content > :header");
            if (!container.length || !headings.length) return;

            const generateTOCS = () => {
                const tocItemsRaw = [];

                headings.each(function (index) {
                    const subSelf = $(this);
                    const key = `toc-heading-${index}`;

                    subSelf.append(`<span class="heading-anchor" id="${key}"></span>`);
                    tocItemsRaw.push(`<div class="content-toc-item ${index == 0 && 'active'}" data-anchor="${key}"><p>${subSelf.text()}</p></div>`);
                });

                container.append(tocItemsRaw.join(""));

                const tocItems = self.find(".content-toc-item");

                tocItems.each(function () {
                    const subSelf = $(this);
                    const anchor = subSelf.data("anchor");
                    const target = self.find(`.heading-anchor#${anchor}`);

                    if (anchor.length && target.length) {
                        subSelf.click(function () {
                            baunfire.lenis?.scrollTo(target.get(0), {
                                duration: 0.6,
                                offset: 1,
                                lock: false
                            })
                        })
                    }
                })
            };

            const highlightTOC = () => {
                const mm = gsap.matchMedia();
                const anchors = self.find(".heading-anchor");
                const items = self.find(".content-toc-item");

                const activate = (target) => {
                    items.removeClass("active");
                    target.addClass("active");
                };

                mm.add({
                    isDesktop: `(min-width: 992px)`,
                    isMobile: `(max-width: 991.98px)`,
                }, (context) => {
                    let { isDesktop, isMobile } = context.conditions;

                    if (isDesktop) {
                        anchors.each(function () {
                            const subSelf = $(this);

                            const index = subSelf.attr("id");
                            const target = self.find(`.content-toc-item[data-anchor='${index}']`);

                            ScrollTrigger.create({
                                trigger: subSelf,
                                start: "top top",
                                end: "bottom top",
                                // markers: true,
                                onEnter: () => activate(target),
                                onEnterBack: () => activate(target),
                            });
                        })
                    }

                    return () => {
                    }
                });
            }

            generateTOCS();
            highlightTOC();
        };

        script();
    }
});
baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-flexible-table-with-toc");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                handleTOC(self);
            });
        }

        const handleTOC = (self) => {
            const items = self.find(".item");
            const anchors = self.find(".group-anchor");
            if (!items.length || !anchors.length) return;

            const mm = gsap.matchMedia();

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

                        const key = subSelf.attr("id");
                        const target = self.find(`.item[href='#${key}']`);

                        ScrollTrigger.create({
                            trigger: subSelf,
                            start: "top 100px",
                            end: "bottom 100px",
                            onEnter: () => activate(target),
                            onEnterBack: () => activate(target),
                        });
                    })
                }

                return () => {
                }
            });
        };

        script();
    }
});
baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-text-bullet-image-toc");
            if (!els.length) return;

            els.each(function (instanceIndex) {
                const self = $(this);
                const items = self.find(".item");
                const contents = self.find(".content-group");
                const mm = gsap.matchMedia();

                const activate = (target) => {
                    items.removeClass("active");
                    target.addClass("active");
                };

                items.each(function () {
                    const subSelf = $(this);
                    const index = subSelf.data("index");
                    const target = self.find(`.content-group[data-index='${index}']`);
                    subSelf.attr("href", `#cwtbai-${instanceIndex}${index}`);
                    target.attr("id", `cwtbai-${instanceIndex}${index}`);
                });

                mm.add({
                    isDesktop: `(min-width: 992px)`,
                    isMobile: `(max-width: 991.98px)`,
                }, (context) => {
                    let { isDesktop, isMobile } = context.conditions;

                    if (isDesktop) {
                        contents.each(function () {
                            const subSelf = $(this);

                            const index = subSelf.data("index");
                            const target = self.find(`.item[data-index='${index}']`);

                            ScrollTrigger.create({
                                trigger: subSelf,
                                start: "top center",
                                end: "bottom center",
                                onEnter: () => activate(target),
                                onEnterBack: () => activate(target),
                            });
                        })
                    }

                    return () => {
                    }
                });

            });
        }

        script();
    }
});
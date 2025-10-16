baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.accordion-faq");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);

                baunfire.Animation.headingParaAnimation(self.find(".block-heading"), null, {
                    trigger: self,
                    start: baunfire.anim.start,
                });

                handleAccordion(self);
            });
        }

        const handleAccordion = (self) => {
            const accs = self.find(".acc");
            if (!accs.length) return;

            accs.each(function () {
                const subSelf = $(this);
                const head = subSelf.find(".acc-head");

                head.click(function () {
                    if (subSelf.hasClass("active")) {
                        subSelf.removeClass("active");
                    } else {
                        accs.removeClass("active");
                        subSelf.addClass("active");
                    }

                    baunfire.Global.screenSizeChange();
                });
            });
        }

        script();
    }
});
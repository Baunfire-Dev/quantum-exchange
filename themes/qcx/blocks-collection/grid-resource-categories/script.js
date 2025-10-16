baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.grid-resource-categories");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                handleHeadings(self);
            });
        }

        const handleHeadings = (self) => {
            const headings = self.find(".block-heading");
            if (!headings.length) return;

            headings.each(function () {
                const subSelf = $(this);

                baunfire.Animation.headingParaAnimation(subSelf, null, {
                    trigger: subSelf,
                    start: subSelf.hasClass("main-heading") ? baunfire.anim.start : "top 80%"
                });
            });
        };

        script();
    }
});
baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-stats");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);

                baunfire.Animation.headingParaAnimation(self.find(".block-heading"), null, {
                    trigger: self,
                    start: baunfire.anim.start,
                }, () => {
                    setTimeout(() => handleCounters(self), 300);
                });
            });
        }

        const handleCounters = (self) => {
            const items = self.find(".item");
            if (!items.length) return;

            items.each(function () {
                const subSelf = $(this);
                baunfire.Global.handleTextCount(subSelf);
            });
        }

        script();
    }
});

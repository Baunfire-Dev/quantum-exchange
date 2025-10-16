baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.resource-stats");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);

                setTimeout(() => {
                    ScrollTrigger.create({
                        trigger: self,
                        start: baunfire.anim.start,
                        once: true,
                        onEnter: () => handleCounters(self),
                        onEnterBack: () => handleCounters(self),
                    })
                }, 600);
            });
        }
                
        const handleCounters = (self) => {
            const items = self.find(".stat-item");
            if (!items.length) return;

            items.each(function () {
                const subSelf = $(this);
                baunfire.Global.handleTextCount(subSelf);
            });
        }

        script();
    }
});
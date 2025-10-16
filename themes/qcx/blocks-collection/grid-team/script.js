baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.grid-team");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);

                baunfire.Animation.headingParaAnimation(self.find(".block-heading"), self.find(".block-para"), {
                    trigger: self,
                    start: baunfire.anim.start,
                });

                handleTabs(self);
            });
        };

        const handleTabs = (self) => {
            const tabs = self.find(".tab");
            const panels = self.find(".panel");
            if (!tabs.length || !panels.length) return;

            tabs.click(function() {
                const subSelf = $(this);
                const index = subSelf.data("index");
                const target = self.find(`.panel[data-index="${index}"]`);

                if (subSelf.hasClass("active") || !target.length) return;

                tabs.removeClass("active");
                panels.removeClass("active");

                subSelf.addClass("active");
                target.addClass("active");

                baunfire.Global.screenSizeChange();
            });
        };

        script();
    }
});
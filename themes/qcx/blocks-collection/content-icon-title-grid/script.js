baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-icon-title-grid");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                
                baunfire.Animation.headingParaAnimation(self.find(".block-heading"), null, {
                    trigger: self,
                    start: baunfire.anim.start,
                });
            });
        }

        script();
    }
});
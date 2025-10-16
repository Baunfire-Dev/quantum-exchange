baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-hero-title");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);

                baunfire.Animation.headingParaAnimation(self.find(".block-heading"), self.find(".block-para"), {
                    trigger: self,
                    start: baunfire.anim.start,
                });
            });
        }

        script();
    }
});

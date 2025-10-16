baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.grid-job-postings");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);

                baunfire.Animation.headingParaAnimation(self.find(".block-heading"), null, {
                    trigger: self,
                    start: baunfire.anim.start,
                });

                handleIframe(self);
            });
        }

        const handleIframe = (self) => {
            const iframe = self.find("iframe");
            if (!iframe.length) return;

            iframe.get(0).addEventListener("load", () => {
                baunfire.Global.screenSizeChange();
            });
        }

        script();
    }
});
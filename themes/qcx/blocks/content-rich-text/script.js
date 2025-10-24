baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-rich-text-rc-start");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                const end = self.nextAll('section.content-rich-text-rc-end').first();
                const container = self.find('.content');

                if (!end.length || !container.length) return;

                let node = self[0].nextSibling;
                while (node && node !== end[0]) {
                    const next = node.nextSibling;
                    container[0].appendChild(node);
                    node = next;
                }

                self.removeClass('content-rich-text-rc-start').addClass('content-rich-text');
                end.remove();
            });

            richTexts();
            baunfire.Global.screenSizeChange();
        }

        const richTexts = () => {
            const els = $("section.content-rich-text");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
            });
        }

        script();
    }
});
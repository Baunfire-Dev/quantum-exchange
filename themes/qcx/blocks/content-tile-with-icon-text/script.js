baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-tile-with-icon-text");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                /* Add your logic here */
            });
        }

        script();
    }
});
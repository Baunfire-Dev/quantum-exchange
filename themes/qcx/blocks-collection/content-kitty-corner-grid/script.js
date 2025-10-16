baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-kitty-corner-grid");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                /* Add your logic here */
            });
        }

        script();
    }
});
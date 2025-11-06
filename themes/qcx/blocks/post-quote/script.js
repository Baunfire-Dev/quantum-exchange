baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.post-quote");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                /* Add your logic here */
            });
        }

        script();
    }
});
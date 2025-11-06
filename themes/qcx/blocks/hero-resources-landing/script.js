baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.hero-resources-landing");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                /* Add your logic here */
            });
        }

        script();
    }
});
baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.hero-text-small-video");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                /* Add your logic here */
            });
        }

        script();
    }
});
baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-large-text-paragraph");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                handleTyping(self);
            });
        }

        const handleTyping = (self) => {
            const heading = self.find("h5.front");
            if (!heading.length) return;

            const text = heading.data("text");
            const content = self.find(".content");

            gsap.to(content, {
                text: {
                    value: text
                },
                scrollTrigger: {
                    trigger: self,
                    start: "center 60%",
                    end: "center 30%",
                    scrub: 1,
                    // markers: true
                }
            });
        }

        script();
    }
});
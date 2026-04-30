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
            const contentContainer = self.find(".back");
            if (!contentContainer.length) return;

            const fullHTML = contentContainer.html().trim();
            const content = self.find(".content");
            const bar = self.find(".bar");

            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = fullHTML;
            const plainText = tempDiv.textContent;
            const totalChars = plainText.length;

            const proxy = { progress: 0 };

            gsap.to(proxy, {
                progress: 1,
                ease: "none",
                onUpdate() {
                    const charsToShow = Math.floor(proxy.progress * totalChars);
                    const sliced = sliceHTML(fullHTML, charsToShow);
                    content.html(sliced + '<span class="bar">_</span>');
                },
                scrollTrigger: {
                    trigger: self,
                    start: "center 60%",
                    end: "center 30%",
                    scrub: 1,
                }
            });
        }

        function sliceHTML(html, count) {
            let visible = 0;
            let result = "";
            let i = 0;

            while (i < html.length) {
                if (html[i] === "<") {
                    const tagEnd = html.indexOf(">", i);
                    if (tagEnd === -1) break;

                    const tag = html.slice(i, tagEnd + 1);
                    result += tag;
                    i = tagEnd + 1;

                } else if (html[i] === "&") {
                    const entityEnd = html.indexOf(";", i);
                    if (entityEnd !== -1 && entityEnd - i <= 8) {
                        if (visible < count) {
                            result += html.slice(i, entityEnd + 1);
                            visible++;
                        }
                        i = entityEnd + 1;
                    } else {
                        if (visible < count) {
                            result += html[i];
                            visible++;
                        }
                        i++;
                    }
                } else {
                    if (visible < count) {
                        result += html[i];
                        visible++;
                    }
                    i++;
                }
            }

            return result;
        }

        script();
    }
});
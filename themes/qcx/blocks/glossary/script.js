baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.glossary");
            if (!els.length) return;

            els.each(function (index) {
                const self = $(this);
                handleLetterState(self);
                handleLetterItemLinkCopy(self);
                handleEntranceAnim(self);
            });
        };

        const handleEntranceAnim = (self) => {
            const inner = self.find(".inner");
            const groups = self.find(".letter-group");

            const entranceAnim = gsap.timeline({
                scrollTrigger: {
                    trigger: self,
                    start: baunfire.anim.start
                }
            })
                .fromTo(inner,
                    {
                        x: 40,
                        autoAlpha: 0
                    },
                    {
                        x: 0,
                        autoAlpha: 1,
                        duration: 0.8,
                        ease: "power2.out",
                    },
                )
                .fromTo(groups,
                    {
                        x: 40,
                        autoAlpha: 0
                    },
                    {
                        x: 0,
                        autoAlpha: 1,
                        duration: 0.8,
                        stagger: { each: 0.2 },
                        ease: "power2.out",
                    },
                    "<0.2"
                );
        };

        const handleLetterState = (self) => {
            const letters = self.find(".letter");
            const letterGroupAnchors = self.find(".letter-group > .letter-anchor");

            const activate = (target) => {
                letters.removeClass("active");
                target.addClass("active");
            };

            letterGroupAnchors.each(function () {
                const subSelf = $(this);

                const id = subSelf.attr("id");
                const target = self.find(`.letter[href='#${id}']`);

                ScrollTrigger.create({
                    trigger: subSelf,
                    start: "top 20%",
                    end: "bottom 20%",
                    onEnter: () => activate(target),
                    onEnterBack: () => activate(target),
                });
            })
        };

        const handleLetterItemLinkCopy = (self) => {
            const els = self.find(".letter-anchor-copy");
            if (!els.length) return;

            const showToast = (message) => {
                Toastify({
                    text: message,
                    duration: 3000,
                    close: true,
                    offset: {
                        y: '4em'
                    },
                    style: {
                        background: "#206EEC",
                    },
                    gravity: "bottom",
                    position: "center"
                }).showToast();
            };

            els.each(function () {
                const subSelf = $(this);
                const value = subSelf.data("anchor");

                subSelf.click(function () {
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(value).then(() => {
                            showToast("Glossary item link copied to clipboard.");
                        }).catch(err => {
                            console.error(err);
                        });
                    } else {
                        const tempInput = $('<input type="hidden">');
                        $('body').append(tempInput);
                        tempInput.val(value).select();
                        document.execCommand('copy');
                        tempInput.remove();
                        showToast("Glossary item link copied to clipboard..");
                    }
                });
            });
        }

        script();
    }
});
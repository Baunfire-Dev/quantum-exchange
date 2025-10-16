baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-accordion-image-video");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);

                baunfire.Animation.headingParaAnimation(self.find(".block-heading"), null, {
                    trigger: self,
                    start: baunfire.anim.start,
                });

                handleItems(self);
                handleVideos(self);
            });
        }

        const handleItems = (self) => {
            const items = self.find(".item");
            if (!items.length) return;

            const container = self.find(".section-inner");
            const itemsOuter = self.find(".items-outer");

            const mm = gsap.matchMedia();

            mm.add({
                isDesktop: `(min-width: 992px)`,
                isMobile: `(max-width: 991.98px)`,
            }, (context) => {
                let { isDesktop, isMobile } = context.conditions;

                if (isDesktop) {
                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: container,
                            endTrigger: itemsOuter,
                            pin: container,
                            start: () => "top top",
                            end: () => `+=${items.length * 1000}`,
                            scrub: 1,
                            refreshPriority: 1,
                            // markers: true,
                        }
                    });

                    baunfire.Global.screenSizeChange();

                    items.each((i, el) => {
                        if (i === 0) return;

                        tl.to(el, {
                            y: 0,
                            z: 0,
                            rotateY: 0,
                            rotateX: 0,
                            duration: 1
                        }, "+=0.5");

                        tl.to(items[i - 1], { scale: 1 - 0.1, y: () => -1 * (baunfire.Global.convertRemToPixels(1)), duration: 1 }, "<");

                        if (i > 1) {
                            tl.to(items[i - 2], { scale: 1 - 0.2, opacity: 0.6, y: () => -1 * (baunfire.Global.convertRemToPixels(2)), duration: 1 }, "<");
                        }
                    });
                }

                return () => {
                    gsap.set(items, {
                        clearProps: true
                    })
                }
            });
        }

        const handleVideos = (self) => {
            const videoContainers = self.find(".media-container.video");
            if (!videoContainers.length) return;

            videoContainers.each(function (index) {
                const subSelf = $(this);

                ScrollTrigger.create({
                    trigger: self,
                    start: baunfire.anim.start,
                    once: true,
                    onEnter: () => setupVideo(self, subSelf),
                    onEnterBack: () => setupVideo(self, subSelf)
                })
            });
        };

        const setupVideo = (self, videoContainer) => {
            baunfire.Global.importVimeoScript(() => {
                const videoID = videoContainer.data("video");
                videoContainer.append(baunfire.Global.generateVimeoIframe(videoID, true));

                const playerContainer = videoContainer.find("iframe");
                if (!playerContainer.length) return;

                const playerInstance = new Vimeo.Player(playerContainer.get(0));

                ScrollTrigger.create({
                    trigger: videoContainer,
                    start: "bottom bottom",
                    end: "bottom top-=10%",
                    onEnter: () => playerInstance.play(),
                    onEnterBack: () => playerInstance.play(),
                    onLeave: () => playerInstance.pause(),
                    onLeaveBack: () => playerInstance.pause()
                });
            });
        };

        script();
    }
});

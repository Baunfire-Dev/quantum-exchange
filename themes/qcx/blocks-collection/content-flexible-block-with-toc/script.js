baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.flexible-content");
            if (!els.length) return;

            els.each(function (instanceIndex) {
                const self = $(this);

                handleHeadings(self);
                handleTOC(self, "cfbwt", instanceIndex);
                handleAccordion(self);
            });
        }

        const handleAccordion = (self) => {
            const accs = self.find(".acc");
            if (!accs.length) return;

            const images = self.find(".acc-image");

            accs.each(function () {
                const subSelf = $(this);
                const index = subSelf.data("index");
                const head = subSelf.find(".acc-head");
                const target = self.find(`.acc-image[data-index="${index}"]`);

                head.click(function () {
                    if (subSelf.hasClass("active")) return;
                    images.removeClass("active");
                    accs.removeClass("active");
                    subSelf.addClass("active");
                    target.addClass("active");

                    baunfire.Global.screenSizeChange();
                });
            });
        }

        const handleHeadings = (self) => {
            const headings = self.find(".block-heading");
            if (!headings.length) return;

            headings.each(function () {
                const subSelf = $(this);

                baunfire.Animation.headingParaAnimation(subSelf, null, {
                    trigger: subSelf,
                    start: "top 70%",
                }, () => {
                    setTimeout(() => handleVideos(self), 600);

                    if (!subSelf.hasClass("is-stats")) return;
                    setTimeout(() => handleCounters(), 600);
                });
            });

            const handleCounters = () => {
                const items = self.find(".stat-item");
                if (!items.length) return;

                items.each(function () {
                    const subSelf = $(this);
                    baunfire.Global.handleTextCount(subSelf);
                });
            }
        };

        const handleTOC = (self, key, instanceIndex) => {
            const items = self.find(".item");
            const contents = self.find(".content-group");
            const mm = gsap.matchMedia();

            const activate = (target) => {
                items.removeClass("active");
                target.addClass("active");
            };

            items.each(function () {
                const subSelf = $(this);
                const index = subSelf.data("index");
                const target = self.find(`.content-group[data-index='${index}']`);
                subSelf.attr("href", `#${key}-${instanceIndex}${index}`);
                target.attr("id", `${key}-${instanceIndex}${index}`);
            });

            mm.add({
                isDesktop: `(min-width: 992px)`,
                isMobile: `(max-width: 991.98px)`,
            }, (context) => {
                let { isDesktop, isMobile } = context.conditions;

                if (isDesktop) {
                    contents.each(function () {
                        const subSelf = $(this);

                        const index = subSelf.data("index");
                        const target = self.find(`.item[data-index='${index}']`);

                        ScrollTrigger.create({
                            trigger: subSelf,
                            start: "top 20%",
                            end: "bottom 20%",
                            onEnter: () => activate(target),
                            onEnterBack: () => activate(target),
                        });
                    })
                }

                return () => {
                }
            });
        };

        const handleVideos = (self) => {
            const videoContainers = self.find(".media-container.video");
            if (!videoContainers.length) return;

            baunfire.Global.importVimeoScript(() => {
                videoContainers.each(function (index) {
                    const subSelf = $(this);
                    setupVideo(self, subSelf);
                });
            });
        }

        const setupVideo = (self, videoContainer) => {
            const videoID = videoContainer.data("video");
            const videoPlay = self.find(".media-play");
            const videoThumbnail = self.find(".media-thumbnail");

            let playerInstance = null;

            baunfire.Global.importVimeoThumbnail(videoID, videoThumbnail);

            videoPlay.click(function () {
                if (!videoContainer.hasClass("loaded")) {
                    videoContainer.append(baunfire.Global.generateVimeoIframe(videoID, true));

                    const playerContainer = videoContainer.find("iframe");
                    playerInstance = new Vimeo.Player(playerContainer.get(0));

                    ScrollTrigger.create({
                        trigger: videoContainer,
                        start: "top center",
                        end: "bottom 30%",
                        onLeave: () => playerInstance.pause(),
                        onLeaveBack: () => playerInstance.pause()
                    });

                    playerInstance.on('pause', function () {
                        videoPlay.fadeIn();
                        videoThumbnail.fadeIn();
                    });

                    videoContainer.addClass("loaded");
                }

                if (playerInstance) {
                    videoPlay.fadeOut();
                    playerInstance.play();
                }

                videoThumbnail.fadeOut();
            });
        }

        script();
    }
});
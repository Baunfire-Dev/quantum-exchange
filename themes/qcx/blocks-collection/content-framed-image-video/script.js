baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-framed-image-video");
            if (!els.length) return;

            els.each(function (index) {
                const self = $(this);
                const outerBox = self.find(".outer-box");

                baunfire.Animation.headingParaAnimation(self.find(".block-heading"), self.find(".block-para"), {
                    trigger: outerBox,
                    start: baunfire.anim.start,
                });

                animateMediaContainer(self)
                setTimeout(() => handleVideos(self), 1000);
            });
        }

        const animateMediaContainer = (self) => {
            const mediaContainer = self.find(".media-container");
            if (!mediaContainer.length) return;

            const mediaContainerInner = mediaContainer.find(".media-container-inner");
            const mm = gsap.matchMedia();

            mm.add({
                isDesktop: `(min-width: 768px)`,
                isMobile: `(max-width: 767.98px)`,
            }, (context) => {
                let { isDesktop, isMobile } = context.conditions;

                if (isDesktop) {
                    gsap.timeline({
                        scrollTrigger: {
                            trigger: mediaContainer,
                            start: "top 60%",
                            end: "top 30%",
                            scrub: 1,
                        },
                        defaults: {
                            ease: "linear",
                        }
                    })
                        .to(mediaContainer,
                            {
                                padding: 0,
                            },
                            "transform"
                        )
                        .to(mediaContainerInner, {
                            borderRadius: 0,
                        },
                            "transform"
                        )
                }

                return () => {
                    gsap.set(mediaContainer, {
                        clearProps: true
                    })
                }
            });
        };

        const handleVideos = (self) => {
            const videoContainers = self.find(".media-container.video .media-container-inner");
            if (!videoContainers.length) return;

            videoContainers.each(function (index) {
                const subSelf = $(this);
                setupVideo(self, subSelf);
            });
        };

        const setupVideo = (self, videoContainer) => {
            baunfire.Global.importVimeoScript(() => {
                const videoID = videoContainer.data("video");
                videoContainer.append(baunfire.Global.generateVimeoIframe(videoID, true));

                const playerContainer = videoContainer.find("iframe");
                if (!playerContainer.length) return;

                const playerInstance = new Vimeo.Player(playerContainer.get(0));
                playerInstance.pause();

                ScrollTrigger.create({
                    trigger: videoContainer,
                    start: "top center",
                    end: "bottom 30%",
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

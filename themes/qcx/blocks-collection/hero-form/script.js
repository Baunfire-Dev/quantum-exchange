baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.hero-form");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);

                baunfire.Animation.headingParaAnimation(self.find(".block-heading"), self.find(".block-para"), {
                    trigger: self,
                    start: baunfire.anim.start,
                });

                handleLogos(self);
                setTimeout(() => handleVideos(self), 600);
            });
        }

        const handleLogos = (self) => {
            const marquee = self.find(".marquee");

            ScrollTrigger.create({
                trigger: marquee,
                start: "top 100%",
                end: "bottom top",
                onEnter: () => {
                    marquee.removeClass("paused");
                },
                onLeave: () => {
                    marquee.addClass("paused");
                },
                onEnterBack: () => {
                    marquee.removeClass("paused");
                },
                onLeaveBack: () => {
                    marquee.addClass("paused");
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

baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-form");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);

                baunfire.Animation.headingParaAnimation(self.find(".block-heading"), self.find(".block-para"), {
                    trigger: self,
                    start: baunfire.anim.start,
                }, () => {
                    setTimeout(() => handleVideos(self), 600);
                });
            });
        }

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
            videoContainer.append(baunfire.Global.generateVimeoIframe(videoID, true));

            const playerContainer = videoContainer.find("iframe");
            if (!playerContainer.length) return;

            const playerInstance = new Vimeo.Player(playerContainer.get(0));

            ScrollTrigger.create({
                trigger: self,
                start: "top center",
                end: "bottom 30%",
                onEnter: () => playerInstance.play(),
                onEnterBack: () => playerInstance.play(),
                onLeave: () => playerInstance.pause(),
                onLeaveBack: () => playerInstance.pause()
            });
        }

        script();
    }
});

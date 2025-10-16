baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.resource-media");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                handleVideo(self);
            });
        }

        const handleVideo = (self) => {
            const videoContainer = self.find(".media-container.video");
            if (!videoContainer.length) return;

            ScrollTrigger.create({
                trigger: self,
                start: baunfire.anim.start,
                once: true,
                onEnter: () => processVideo(self, videoContainer),
                onEnterBack: () => processVideo(self, videoContainer)
            })
        };

        const processVideo = (self, videoContainer) => {
            if (videoContainer.hasClass("file")) {
                setupVideoRaw(self, videoContainer);
            } else {
                if (videoContainer.hasClass("vimeo")) {
                    setupVimeo(self, videoContainer);
                } else {
                    setupYoutube(self, videoContainer);
                }
            }
        }

        const setupVideoRaw = (self, videoContainer) => {
            const videoFile = videoContainer.data("video");
            const mediaControl = videoContainer.find(".media-control");
            videoContainer.append(`<video muted loop preload="metadata" playsinline><source src="${videoFile}" type="video/mp4">Your browser does not support the video tag.</video>`);

            const videoEL = videoContainer.find("video");
            const playerInstance = videoEL.get(0);

            videoEL.on("play", () => {
                mediaControl.addClass("active");
            });

            videoEL.on("pause", () => {
                mediaControl.removeClass("active");
            });

            mediaControl.click(function () {
                if (playerInstance.paused) {
                    playerInstance.play();
                } else {
                    playerInstance.pause();
                }
            });

            autopauseVideo(self, playerInstance);
        }

        const setupVimeo = (self, videoContainer) => {
            let playerInstance = null;

            const videoID = videoContainer.data("video");
            const videoPlay = self.find(".media-play");
            const videoThumbnail = self.find(".media-thumbnail");

            baunfire.Global.importVimeoThumbnail(videoID, videoThumbnail);

            videoPlay.click(function () {
                if (videoContainer.hasClass("loaded")) return;
                videoContainer.addClass("loaded");

                baunfire.Global.importVimeoScript(() => {
                    videoContainer.append(baunfire.Global.generateVimeoIframe(videoID));

                    const playerContainer = videoContainer.find("iframe");
                    playerInstance = new Vimeo.Player(playerContainer.get(0));

                    autopauseVideo(self, playerInstance, "vimeo");

                    videoPlay.fadeOut();
                    playerInstance.play();
                    videoThumbnail.fadeOut();
                });
            });
        }

        const setupYoutube = (self, videoContainer) => {
            let playerInstance = null;

            const videoID = videoContainer.data("video");
            const videoPlay = self.find(".media-play");
            const videoThumbnail = self.find(".media-thumbnail");

            videoThumbnail.append(`<img src="https://img.youtube.com/vi/${videoID}/maxresdefault.jpg" loading="lazy" alt="youtube video thumbnail">`);

            videoPlay.click(function () {
                if (videoContainer.hasClass("loaded")) return;
                videoContainer.addClass("loaded");

                const playerID = "yt-" + videoID + "-" + Date.now();
                videoContainer.append(`<div id="${playerID}"></div>`);

                baunfire.Global.importYouTubeScript(() => {
                    playerInstance = new YT.Player(playerID, {
                        videoId: videoID,
                        playerVars: {
                            rel: 0,
                            modestbranding: 1,
                            playsinline: 1,
                        },
                        events: {
                            onReady: () => {
                                videoPlay.fadeOut();
                                videoThumbnail.fadeOut();
                                playerInstance.playVideo();

                                autopauseVideo(self, playerInstance, "youtube");
                            },
                        }
                    });
                });
            });
        };

        const autopauseVideo = (trigger, playerInstance, type = "file") => {
            const stProps = {
                trigger: trigger,
                start: "top center",
                end: "bottom 30%",
            }

            if (type == "file") {
                ScrollTrigger.create({
                    ...stProps,
                    onEnter: () => playerInstance.play(),
                    onEnterBack: () => playerInstance.play(),
                    onLeave: () => playerInstance.pause(),
                    onLeaveBack: () => playerInstance.pause(),
                });
            } else if (type == "vimeo") {
                ScrollTrigger.create({
                    ...stProps,
                    onLeave: () => playerInstance.pause(),
                    onLeaveBack: () => playerInstance.pause(),
                });
            } else {
                ScrollTrigger.create({
                    ...stProps,
                    onLeave: () => playerInstance.pauseVideo(),
                    onLeaveBack: () => playerInstance.pauseVideo(),
                });
            }
        }

        script();
    }
});
baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.hero-resource-detail");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);

                baunfire.Animation.headingParaAnimation(self.find(".block-heading"), null, {
                    trigger: self,
                    start: baunfire.anim.start,
                });

                handleVideos(self);
                handleCopyURL(self);
            });
        };

        const handleVideos = (self) => {
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
                }
            }
        }

        const setupVideoRaw = (self, videoContainer) => {
            const videoFile = videoContainer.data("video");
            videoContainer.append(`<video muted loop preload="metadata" playsinline><source src="${videoFile}" type="video/mp4">Your browser does not support the video tag.</video>`);

            const videoEL = videoContainer.find("video");
            const playerInstance = videoEL.get(0);

            autopauseVideo(self, playerInstance);
        }

        const setupVimeo = (self, videoContainer) => {
            baunfire.Global.importVimeoScript(() => {
                const videoID = videoContainer.data("video");
                videoContainer.append(baunfire.Global.generateVimeoIframe(videoID, true));

                const playerContainer = videoContainer.find("iframe");
                if (!playerContainer.length) return;

                const playerInstance = new Vimeo.Player(playerContainer.get(0));

                autopauseVideo(self, playerInstance, "vimeo");
            });
        }

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

        const handleCopyURL = (self) => {
            const el = self.find(".copy-link-btn");
            if (!el.length) return;

            const siteURL = window.location.href;

            const showToast = (message) => {
                Toastify({
                    text: message,
                    duration: 5000,
                    close: true,
                    offset: {
                        y: "6em",
                    },
                    style: {
                        background: "#EE5833",
                    },
                    gravity: "top",
                    position: "center",
                }).showToast();
            };

            el.click(function () {
                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(siteURL).then(() => {
                        showToast("URL copied to clipboard.");
                    }).catch(err => {
                        console.error("Clipboard error:", err);
                    });
                } else {
                    const tempInput = $('<input type="text" style="position: absolute; left: -9999px;">');
                    $('body').append(tempInput);
                    tempInput.val(siteURL).select();
                    document.execCommand('copy');
                    tempInput.remove();
                    showToast("URL copied to clipboard.");
                }
            });
        };

        script();
    },
});

baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.hero-content-with-video");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                handleEntranceAnim(self);
                handleVideos(self);
            });
        }

        const handleEntranceAnim = (self) => {
            const title = self.find(".block-title");
            const para = self.find(".block-para");
            const video = self.find(".block-video");

            const elAnims = [title, para, video].filter(el => el.length > 0);

            const entranceAnim = gsap.timeline({
                scrollTrigger: {
                    trigger: self,
                    start: baunfire.anim.start
                }
            })
                .fromTo(elAnims,
                    {
                        y: 40,
                        autoAlpha: 0
                    },
                    {
                        y: 0,
                        autoAlpha: 1,
                        duration: 0.8,
                        stagger: { each: 0.2 },
                        ease: "power2.out"
                    }
                );
        };

        const handleVideos = (self) => {
            const videoContainer = self.find(".video");
            if (!videoContainer.length) return;

            const type = videoContainer.data("source");
            const video = videoContainer.data("video");
            const play = videoContainer.find(".video-play");
            const thumbnail = videoContainer.find(".video-thumbnail");

            play.click(function () {
                thumbnail.fadeOut();

                if (type == "youtube") {
                    baunfire.Global.importYouTubeScript(() => {
                        handleYoutube(videoContainer, video);
                    });
                } else {
                    handleDirectVideo(videoContainer, video);
                }
            });
        };

        const handleDirectVideo = (container, video) => {
            container.append(`
                <video src="${video}" autoplay playsinline controls preload="auto" disablepictureinpicture disableremoteplayback>
                    Your browser does not support the video tag.
                </video>
            `);

            const videoEL = container.find("video").get(0);

            ScrollTrigger.create({
                trigger: container,
                start: "top center",
                end: "bottom 10%",
                onLeave: () => videoEL.pause(),
                onLeaveBack: () => videoEL.pause()
            });
        };

        const handleYoutube = (container, video) => {
            const playerID = "yt-" + video + "-" + Date.now();
            container.append(`<div id="${playerID}"></div>`);

            const playerInstance = new YT.Player(playerID, {
                videoId: video,
                playerVars: {
                    rel: 0,
                    modestbranding: 1,
                    controls: 1,
                    muted: 1,
                    autoplay: 1,
                    playsinline: 1,
                    loop: 1,
                },
                events: {
                    onReady: (event) => {
                        event.target.playVideo();

                        ScrollTrigger.create({
                            trigger: container,
                            start: "top center",
                            end: "bottom 10%",
                            onLeave: () => event.target.pauseVideo(),
                            onLeaveBack: () => event.target.pauseVideo()
                        });
                    },
                },
            });
        };

        script();
    }
});
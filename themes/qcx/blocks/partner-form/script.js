baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const sections = $("section.partner-form");
            if (!sections.length) return;

            sections.each(function () {
                const self = $(this);
                handleVideos(self);
                handleEntranceAnim(self);
            });
        };

        const handleEntranceAnim = (self) => {
            const bg = self.find(".bg");
            const title = self.find(".block-title");
            const content = self.find(".block-content");
            const box = self.find(".block-box");

            const elAnims = [title, content, box].filter(el => el.length > 0);

            const entranceAnim = gsap.timeline({
                scrollTrigger: {
                    trigger: self,
                    start: baunfire.anim.start
                }
            })
                .fromTo(bg,
                    {
                        autoAlpha: 0
                    },
                    {
                        autoAlpha: 1,
                        duration: 0.8,
                        ease: "power2.out"
                    }
                )
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
                    },
                    ">-0.6"
                );
        };

        const handleVideos = (self) => {
            const videoContainer = self.find(".media-container-inner.video");
            if (!videoContainer.length) return;

            const video = videoContainer.data("video");
            const play = videoContainer.find(".video-play");
            const thumbnail = videoContainer.find(".video-thumbnail");

            play.click(function () {
                thumbnail.fadeOut();
                handleDirectVideo(videoContainer, video);
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

        script();
    },
});

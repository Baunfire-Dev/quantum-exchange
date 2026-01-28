baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const sections = $("section.content-large-diagram-graphic");
            if (!sections.length) return;

            sections.each(function () {
                const self = $(this);
                handleVideos(self);
                handleEntranceAnim(self);
            });
        };

        const handleEntranceAnim = (self) => {
            const title = self.find(".block-title");
            const para = self.find(".block-para");
            const media = self.find(".media-container");

            const elAnims = [title, para, media].filter(el => el.length > 0);

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

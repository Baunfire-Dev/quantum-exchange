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
            const media = self.find(".media-container-outer");

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
                        ease: Power2.easeOut
                    }
                );
        };

        const handleVideos = (self) => {
            const videoContainers = self.find(".media-container.video");
            if (!videoContainers.length) return;

            videoContainers.each(function (index) {
                const subSelf = $(this);
                setupVideo(self, subSelf);
            });
        };

        const setupVideo = (self, videoContainer) => {
            const videoRaw = videoContainer.find("video");
            if (!videoRaw.length) return;

            const video = videoRaw.get(0);

            ScrollTrigger.create({
                trigger: videoContainer,
                start: "top center",
                end: "bottom 30%",
                onEnter: () => video.play(),
                onEnterBack: () => video.play(),
                onLeave: () => video.pause(),
                onLeaveBack: () => video.pause()
            });
        };

        script();
    },
});

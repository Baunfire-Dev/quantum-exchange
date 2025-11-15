baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.hero-text-small-video");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);

                handleVideos(self);
                handleEntranceAnim(self);
            });
        }

        const handleEntranceAnim = (self) => {
            const title = self.find(".block-title");
            const content = self.find(".block-content");
            const video = self.find(".media-container video");

            const elAnims = [title, content, video].filter(el => el.length > 0);

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
                    },
                    "<0.4"
                )
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
                end: "bottom 10%",
                onEnter: () => video.play(),
                onEnterBack: () => video.play(),
                onLeave: () => video.pause(),
                onLeaveBack: () => video.pause()
            });
        };

        script();
    }
});

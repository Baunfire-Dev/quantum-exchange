baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.hero-contact-form");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);

                handleVideos(self);
                handleMarquee(self);
                handleEntranceAnim(self);
            });
        }

        const handleEntranceAnim = (self) => {
            const title = self.find(".block-title");
            const para = self.find(".block-para");
            const form = self.find(".block-form");
            const logos = self.find('.block-logos');

            const entranceAnim = gsap.timeline({
                scrollTrigger: {
                    trigger: self,
                    start: baunfire.anim.start
                }
            })
                .fromTo([title, para, form, logos],
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

        const handleMarquee = (self) => {
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
    }
});

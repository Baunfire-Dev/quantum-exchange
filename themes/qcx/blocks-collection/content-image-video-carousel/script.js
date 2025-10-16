baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-image-video-carousel");
            if (!els.length) return;

            els.each(function (index) {
                const self = $(this);
                self.addClass(`instance-${index}`);

                baunfire.Animation.headingParaAnimation(self.find(".block-heading"), null, {
                    trigger: self,
                    start: baunfire.anim.start,
                });

                handleCarousel(self);
                handleVideos(self);
            });
        }

        const handleCarousel = (self) => {
            const carousel = self.find(".owl-carousel");
            if (!carousel.length) return;

            let progressTween;

            const prevArrow = self.find(".arrow.prev");
            const nextArrow = self.find(".arrow.next");

            const defaultPrevArrow = self.find(".owl-prev");
            const defaultNextArrow = self.find(".owl-next");

            const circle = nextArrow.find("circle.foreground").get(0);
            const radius = circle.r.baseVal.value;
            const circumference = 2 * Math.PI * radius;
            const DURATION = 6;

            let carouselInstance = carousel.owlCarousel({
                loop: true,
                rewind: true,
                dots: false,
                dotsEach: true,
                items: 1,
                margin: 32,
                mouseDrag: false,
                touchDrag: false,
                pullDrag: false,
                freeDrag: false,
                nav: true,
                smartSpeed: 800,
                onInitialized: () => {
                    ScrollTrigger.refresh(true);
                },
                onResized: () => {
                    ScrollTrigger.refresh(true);
                }
            });

            carouselInstance.on("translated.owl.carousel", function (event) {
                if (defaultPrevArrow.hasClass("disabled")) {
                    prevArrow.addClass("disabled");
                } else {
                    prevArrow.removeClass("disabled");
                }

                if (defaultNextArrow.hasClass("disabled")) {
                    nextArrow.addClass("disabled");
                } else {
                    nextArrow.removeClass("disabled");
                }
            });

            carouselInstance.on('changed.owl.carousel', function (event) {
                const currentItem = event.item.index - 1;
                self.find(".word").removeClass("active");
                self.find(`.word[data-index="${currentItem == 0 ? event.item.count : currentItem}"]`).addClass("active");
            })

            nextArrow.click(function () {
                carouselInstance.trigger("next.owl.carousel");
                restartCountdown();
            });

            prevArrow.click(function () {
                carouselInstance.trigger("prev.owl.carousel");
                restartCountdown();
            });

            prevArrow.addClass("disabled");

            circle.style.strokeDasharray = circumference;
            circle.style.strokeDashoffset = circumference;

            const startCountdown = () => {
                progressTween = gsap.fromTo(circle,
                    { strokeDashoffset: circumference },
                    {
                        strokeDashoffset: 0,
                        duration: DURATION,
                        ease: "linear",
                        onComplete: () => {
                            carouselInstance.trigger("next.owl.carousel");
                            restartCountdown();
                        }
                    }
                );
            }

            const restartCountdown = () => {
                if (progressTween) progressTween.kill();
                startCountdown();
            }

            ScrollTrigger.create({
                trigger: self[0],
                start: baunfire.anim.start,
                end: "bottom 30%",
                onEnter: () => restartCountdown(),
                onEnterBack: () => restartCountdown(),
                onLeave: () => progressTween && progressTween.pause(),
                onLeaveBack: () => progressTween && progressTween.pause()
            });
        };

        const handleVideos = (self) => {
            const videoContainers = self.find(".media-container.video");
            if (!videoContainers.length) return;

            ScrollTrigger.create({
                trigger: self,
                start: baunfire.anim.start,
                once: true,
                onEnter: () => processVideos(),
                onEnterBack: () => processVideos()
            });

            const processVideos = () => {
                videoContainers.each(function (index) {
                    const subSelf = $(this);
                    setupVideo(self, subSelf)
                });
            }
        };

        const setupVideo = (self, videoContainer) => {
            baunfire.Global.importVimeoScript(() => {
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
            });
        };

        script();
    }
});

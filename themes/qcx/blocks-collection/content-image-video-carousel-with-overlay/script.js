baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.content-image-video-carousel-with-overlay");
            if (!els.length) return;

            els.each(function (index) {
                const self = $(this);
                self.addClass(`instance-${index}`);

                baunfire.Animation.headingParaAnimation(self.find(".block-heading"), null, {
                    trigger: self,
                    start: baunfire.anim.start,
                });

                handleMainCarousel(self);
            });
        }

        const handleMainCarousel = (self) => {
            const carouselContainer = self.find(".carousel-container");
            const carousel = carouselContainer.find(".owl-carousel");
            if (!carousel.length) return;

            let progressTween;

            const prevArrow = carouselContainer.find(".arrow.prev");
            const nextArrow = carouselContainer.find(".arrow.next");

            const defaultPrevArrow = carouselContainer.find(".owl-prev");
            const defaultNextArrow = carouselContainer.find(".owl-next");

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

            const killCountdown = () => {
                if (progressTween) progressTween.kill();
            }

            ScrollTrigger.create({
                trigger: self[0],
                start: baunfire.anim.start,
                end: "bottom 30%",
                onEnter: () => restartCountdown(),
                onEnterBack: () => restartCountdown(),
                onLeave: () => progressTween && progressTween.kill(),
                onLeaveBack: () => progressTween && progressTween.kill()
            });

            handleDialogs(self, killCountdown, restartCountdown);
        };

        const handleDialogs = (self, killCountdown, restartCountdown) => {
            const items = self.find(".carousel-container .item");

            items.each(function () {
                const subSelf = $(this);

                const openDialog = subSelf.find(".open-overlay");
                if (!openDialog.length) return;

                const index = openDialog.data("index");
                const targetDialog = self.find(`dialog[data-index="${index}"]`);
                if (!targetDialog.length) return;
                
                const targetDialogEL = targetDialog.get(0);
                const videosArray = [];

                let contentProcessed = false;

                openDialog.click(function () {
                    targetDialogEL.showModal();
                    baunfire.Global.siteScrolling(false);
                    killCountdown();

                    if (contentProcessed) return;
                    contentProcessed = true;

                    handleVideos(targetDialog, videosArray);
                    initSubCarousel(targetDialog, videosArray);
                });

                targetDialogEL.addEventListener("click", e => {
                    const inner = targetDialogEL.querySelector(".dialog-inner");

                    if (!inner.contains(e.target)) {
                        pauseVideos(videosArray);
                        targetDialogEL.close();
                        restartCountdown();
                        baunfire.Global.siteScrolling();
                    }
                });
            });
        };

        const initSubCarousel = (container, videosArray) => {
            const carousel = container.find(".owl-carousel");
            if (!carousel.length) return;

            let carouselInstance = carousel.owlCarousel({
                loop: true,
                rewind: false,
                dots: false,
                items: 1,
                margin: 32,
                mouseDrag: false,
                touchDrag: false,
                pullDrag: false,
                freeDrag: false,
                nav: true,
                navText: [
                    `<div class="arrow prev"><div class="arrow-inner"><svg width="10" height="10" viewbox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 4.99946L4.99946 10L3.82882 8.82936L6.83087 5.82731H0V4.17161H6.83087L3.82882 1.17064L4.99946 0L10 4.99946Z" fill="#8BFFF7"/></svg></div></div>`,
                    `<div class="arrow next"><div class="arrow-inner"><svg width="10" height="10" viewbox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 4.99946L4.99946 10L3.82882 8.82936L6.83087 5.82731H0V4.17161H6.83087L3.82882 1.17064L4.99946 0L10 4.99946Z" fill="#8BFFF7"/></svg></div></div>`
                ],
                smartSpeed: 800
            });

            carouselInstance.on('changed.owl.carousel', function (event) {
                pauseVideos(videosArray);
            })
        };

        const pauseVideos = (videos) => {
            if (!videos.length) return;

            videos.forEach(video => {
                video.pause();
            });
        }

        const handleVideos = (container, videosArray) => {
            const videoContainers = container.find(".media-container.video");
            if (!videoContainers.length) return;

            videoContainers.each(function () {
                const subSelf = $(this);
                setupVideo(subSelf, videosArray);
            })
        };

        const setupVideo = (videoContainer, videosArray) => {
            let playerInstance = null;

            const videoID = videoContainer.data("video");
            const videoPlay = videoContainer.find(".media-play");
            const videoThumbnail = videoContainer.find(".media-thumbnail");

            baunfire.Global.importVimeoThumbnail(videoID, videoThumbnail);

            videoPlay.click(function () {
                if (videoContainer.hasClass("loaded")) return;
                videoContainer.addClass("loaded");

                baunfire.Global.importVimeoScript(() => {
                    videoContainer.append(baunfire.Global.generateVimeoIframe(videoID));

                    const playerContainer = videoContainer.find("iframe");
                    playerInstance = new Vimeo.Player(playerContainer.get(0));

                    videoPlay.fadeOut();
                    playerInstance.play();
                    videoThumbnail.fadeOut();

                    videosArray.push(playerInstance);
                });
            });
        };

        script();
    }
});

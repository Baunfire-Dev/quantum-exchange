baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.carousel-videos");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);
                handleEntranceAnim(self);
                handleCarousel(self);
                handleVideos(self);
            });
        };

        const handleEntranceAnim = (self) => {
            const title = self.find(".block-title");
            const paraCTA = self.find(".block-duo");
            const itemsNav = self.find(".items-nav");
            const cards = self.find('.item-card');

            const elAnims = [title, paraCTA, itemsNav].filter(el => el.length > 0);

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

            if (cards.length) {
                entranceAnim
                    .fromTo(cards,
                        {
                            y: 40,
                            autoAlpha: 0
                        },
                        {
                            autoAlpha: 1,
                            y: 0,
                            duration: 0.6,
                            ease: "power2.out",
                            stagger: { each: 0.2 }
                        },
                        ">-0.8"
                    );
            }
        };

        const handleCarousel = (self) => {
            const carousel = self.find(".owl-carousel");
            const next = self.find(".ar-r");
            const prev = self.find(".ar-l");

            const carouselInstance = carousel.owlCarousel({
                rewind: true,
                dots: true,
                dotsEach: true,
                margin: 24,
                autoplay: false,
                responsive: {
                    0: {
                        items: 1,
                    },
                    768: {
                        items: 2,
                    },
                    1024: {
                        items: 3,
                    },
                },
                onInitialized: () => {
                    baunfire.Global.screenSizeChange();
                },
                onResized: () => {
                    baunfire.Global.screenSizeChange();
                }
            });

            next.click(function () {
                carousel.trigger('next.owl.carousel');
            });

            prev.click(function () {
                carousel.trigger('prev.owl.carousel');
            });
        };

        const handleVideos = (self) => {
            const items = self.find(".item");
            if (!items.length) return;

            const dialog = self.find("dialog");

            items.each(function () {
                const subSelf = $(this);
                const data = subSelf.data("video");
                const source = subSelf.data("source");
                const media = subSelf.find(".item-media");

                media.click(function () {
                    openDialog(dialog, data, source)
                });
            });

            closeDialog(dialog);
        };

        const openDialog = (el, video, source, open = true) => {
            const inner = el.find(".dg-inner");

            if (open) {
                if (source == "direct") {
                    handleDirectVideo(inner, video);
                } else if (source == "youtube") {
                    baunfire.Global.importYouTubeScript(() => {
                        handleYoutube(inner, video);
                    });
                }

                el.get(0).showModal();
                baunfire.Global.siteScrolling(false);
            }
        };

        const closeDialog = (el) => {
            const inner = el.find(".dg-inner");
            const close = el.find(".dg-close");
            
            const cleanupDirectVideo = () => {
                const video = inner.find("video")[0];
                if (video) {
                    video.pause();
                    video.src = "";
                }
            }

            const cleanupYoutube = () => {
                const ytPlayer = inner.find('[id^="yt-"]');

                if (ytPlayer.length && window.YT) {
                    const iframe = ytPlayer.find('iframe')[0];
                    if (iframe && iframe.contentWindow) {
                        iframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
                    }
                }
            }

            close.click(function () {
                cleanupDirectVideo();
                cleanupYoutube();
                
                inner.empty();
                el.get(0).close();
                baunfire.Global.siteScrolling();
            });

        };

        const handleDirectVideo = (el, video) => {
            el.append(`
                <video src="${video}" autoplay playsinline controls preload="auto" disablepictureinpicture disableremoteplayback>
                    Your browser does not support the video tag.
                </video>
            `);
        };

        const handleYoutube = (inner, video) => {
            const playerID = "yt-" + video + "-" + Date.now();
            inner.append(`<div id="${playerID}"></div>`);

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
                    },
                },
            });
        };

        script();
    },
});

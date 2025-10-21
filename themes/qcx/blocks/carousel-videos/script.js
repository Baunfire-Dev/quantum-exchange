baunfire.addModule({
  init(baunfire) {
    const $ = baunfire.$;
    let currentPlayingVideo = null;

    const script = () => {
      const els = $("section.carousel-videos");
      if (!els.length) return;

      els.each(function () {
        const self = $(this);
        initCarousel(self);
        handleVideos(self);
        animateVideos(self);
      });
    };

    const initCarousel = (self) => {
      const carousel = self.find(".videos-carousel");
      const next = self.find(".ar-r");
      const prev = self.find(".ar-l");
      if (!carousel.length) return;

      carousel.owlCarousel({
        loop: true,
        margin: 24,
        nav: false,
        dots: true,
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
        onTranslate: function () {
          pauseAllVideos();
        },
      });

      carousel.on("translate.owl.carousel", function () {
        pauseAllVideos();
      });
      
      next.click(function () {
        carousel.trigger("next.owl.carousel");
      });

      prev.click(function () {
        carousel.trigger("prev.owl.carousel");
      });
    };

    const animateVideos = (self) => {
      const videoItems = self.find(".video-item");
      
      gsap.set(videoItems, {
        opacity: 0,
        y: 40
      });
      
      ScrollTrigger.create({
        trigger: self,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(videoItems, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out"
          });
        }
      });
    };

    const pauseAllVideos = () => {
      if (currentPlayingVideo) {
        if (currentPlayingVideo.type === "raw") {
          currentPlayingVideo.instance.pause();
        } else if (currentPlayingVideo.type === "vimeo") {
          currentPlayingVideo.instance.pause();
        } else if (currentPlayingVideo.type === "youtube") {
          currentPlayingVideo.instance.pauseVideo();
        }

        const container = currentPlayingVideo.container;
        container.find(".media-control").show();
        container.siblings(".video-thumbnail").show();
        container.find('video, iframe, div[id^="yt-"]').remove();
        container.find(".video-preview").show();

        currentPlayingVideo = null;
      }
    };

    const handleVideos = (self) => {
      const videoContainers = self.find(".media-container.video");
      if (!videoContainers.length) return;

      videoContainers.each(function () {
        const videoContainer = $(this);
        const mediaControl = videoContainer.find(".media-control");
        const thumbnail = videoContainer.siblings(".video-thumbnail");

        if (
          !thumbnail.length &&
          !videoContainer.find(".video-preview").length
        ) {
          generateVideoPreview(videoContainer);
        }

        mediaControl.on("click", function (e) {
          e.preventDefault();

          if (
            currentPlayingVideo &&
            currentPlayingVideo.container.is(videoContainer)
          ) {
            pauseCurrentVideo();
          } else {
            pauseAllVideos();
            thumbnail.hide();

            if (videoContainer.hasClass("file")) {
              setupVideoRaw(self, videoContainer);
            } else if (videoContainer.hasClass("vimeo")) {
              baunfire.Global.importVimeoScript(() => {
                setupVimeo(self, videoContainer);
              });
            } else if (videoContainer.hasClass("youtube")) {
              baunfire.Global.importYouTubeScript(() => {
                setupYoutube(self, videoContainer);
              });
            }

            mediaControl.hide();
          }
        });
      });
    };

    const pauseCurrentVideo = () => {
      if (!currentPlayingVideo) return;

      if (currentPlayingVideo.type === "raw") {
        currentPlayingVideo.instance.pause();
      } else if (currentPlayingVideo.type === "vimeo") {
        currentPlayingVideo.instance.pause();
      } else if (currentPlayingVideo.type === "youtube") {
        currentPlayingVideo.instance.pauseVideo();
      }

      const container = currentPlayingVideo.container;
      container.find(".media-control").show();
      container.siblings(".video-thumbnail").show();
      container.find(".video-preview").show();

      currentPlayingVideo = null;
    };

    const generateVideoPreview = (videoContainer) => {
      if (videoContainer.hasClass("file")) {
        const videoFile = videoContainer.data("video");
        const previewVideo = $(
          `<video class="video-preview" muted preload="metadata"><source src="${videoFile}#t=0.5" type="video/mp4"></video>`
        );
        videoContainer.prepend(previewVideo);
      } else if (videoContainer.hasClass("vimeo")) {
        const vimeoId = videoContainer.data("video");
        const previewImg = $(
          `<img class="video-preview" src="https://vumbnail.com/${vimeoId}.jpg" alt="Video preview">`
        );
        videoContainer.prepend(previewImg);
      } else if (videoContainer.hasClass("youtube")) {
        const youtubeId = videoContainer.data("video");
        const previewImg = $(
          `<img class="video-preview" src="https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg" alt="Video preview">`
        );
        videoContainer.prepend(previewImg);
      }
    };

    const setupVideoRaw = (self, videoContainer) => {
      const videoFile = videoContainer.data("video");

      videoContainer.find(".video-preview").hide();

      const existingVideo = videoContainer.find("video:not(.video-preview)");
      if (existingVideo.length) {
        const playerInstance = existingVideo.get(0);
        playerInstance.play();

        currentPlayingVideo = {
          type: "raw",
          instance: playerInstance,
          container: videoContainer,
        };
      } else {
        videoContainer.append(
          `<video controls autoplay muted loop preload="metadata" playsinline><source src="${videoFile}" type="video/mp4"></video>`
        );

        const videoEL = videoContainer.find("video").last();
        const playerInstance = videoEL.get(0);

        playerInstance.play();

        currentPlayingVideo = {
          type: "raw",
          instance: playerInstance,
          container: videoContainer,
        };

        autopauseVideo(self, playerInstance);
      }
    };

    const setupVimeo = (self, videoContainer) => {
      const videoID = videoContainer.data("video");

      videoContainer.find(".video-preview").hide();

      const existingIframe = videoContainer.find("iframe");
      if (existingIframe.length) {
        const playerInstance = new Vimeo.Player(existingIframe.get(0));
        playerInstance.play();

        currentPlayingVideo = {
          type: "vimeo",
          instance: playerInstance,
          container: videoContainer,
        };
      } else {
        videoContainer.append(
          baunfire.Global.generateVimeoIframe(videoID, true)
        );

        const playerContainer = videoContainer.find("iframe");
        if (!playerContainer.length) return;

        const playerInstance = new Vimeo.Player(playerContainer.get(0));
        playerInstance.play();

        currentPlayingVideo = {
          type: "vimeo",
          instance: playerInstance,
          container: videoContainer,
        };

        autopauseVideo(self, playerInstance);
      }
    };

    const setupYoutube = (self, videoContainer) => {
      const videoID = videoContainer.data("video");
      const playerID = "yt-" + videoID + "-" + Date.now();

      videoContainer.find(".video-preview").hide();

      const existingPlayer = videoContainer.find('div[id^="yt-"]');
      if (!existingPlayer.length) {
        videoContainer.append(`<div id="${playerID}"></div>`);

        const playerInstance = new YT.Player(playerID, {
          videoId: videoID,
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
              event.target.mute();
              event.target.playVideo();

              currentPlayingVideo = {
                type: "youtube",
                instance: event.target,
                container: videoContainer,
              };

              autopauseVideo(self, playerInstance, true);
            },
          },
        });
      }
    };

    const autopauseVideo = (trigger, playerInstance, isYT = false) => {
      const stProps = {
        trigger: trigger,
        start: "top center",
        end: "bottom top",
      };

      if (isYT) {
        ScrollTrigger.create({
          ...stProps,
          onEnter: () => playerInstance.playVideo(),
          onEnterBack: () => playerInstance.playVideo(),
          onLeave: () => playerInstance.pauseVideo(),
          onLeaveBack: () => playerInstance.pauseVideo(),
        });
      } else {
        ScrollTrigger.create({
          ...stProps,
          onEnter: () => playerInstance.play(),
          onEnterBack: () => playerInstance.play(),
          onLeave: () => playerInstance.pause(),
          onLeaveBack: () => playerInstance.pause(),
        });
      }
    };

    script();
  },
});
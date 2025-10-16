baunfire.addModule({
    init(baunfire) {
        const $ = baunfire.$;

        const script = () => {
            const els = $("section.scroll-timeline");
            if (!els.length) return;

            els.each(function () {
                const self = $(this);

                baunfire.Animation.headingParaAnimation(self.find(".block-heading"), self.find(".block-para"), {
                    trigger: self,
                    start: baunfire.anim.start,
                });

                handleCarousel(self);
            });
        }

        const handleCarousel = (self) => {
            const carousel = self.find(".owl-carousel");
            if (!carousel.length) return;

            const prevArrow = self.find(".arrow.prev");
            const nextArrow = self.find(".arrow.next");

            const defaultPrevArrow = self.find(".owl-prev");
            const defaultNextArrow = self.find(".owl-next");

            let carouselInstance = carousel.owlCarousel({
                loop: false,
                rewind: true,
                dots: false,
                dotsEach: true,
                margin: 0,
                items: 1,
                mouseDrag: false,
                touchDrag: false,
                pullDrag: false,
                freeDrag: false,
                nav: true,
                autoPlay: true,
                autoplayTimeout: 8000,
                autoplayHoverPause: true,
                smartSpeed: 800,
                onInitialized: () => {
                    baunfire.Global.screenSizeChange();
                },
                onResized: () => {
                    baunfire.Global.screenSizeChange();
                },
                responsive: {
                    576 : {
                        autoWidth: true
                    },
                }
            })

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
            });

            prevArrow.click(function () {
                carouselInstance.trigger("prev.owl.carousel");
            });
        };

        script();
    }
});
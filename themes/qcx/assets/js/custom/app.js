(function (w) {
    'use strict';

    const $ = jQuery.noConflict();

    const baunfire = {
        $,
        initialized: false,
        modules: [],
        anim: {
            start: "top 60%"
        },
        lenis: null,
        linesSetupParams: {
            type: "lines",
            autoSplit: true,
            reduceWhiteSpace: false,
            // mask: "lines",
        },
        linesAnimParams: {
            yPercent: 70,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out",
            stagger: 0.14,
        },
        init() {
            if (this.initialized) return;
            this.initialized = true;

            this.modules.forEach(mod => {
                if (typeof mod.init === 'function') {
                    mod.init(baunfire);
                }
            });
        },
        addModule(mod) {
            this.modules.push(mod);
        },
        load() {
            console.log('Baunfire loaded');
        },
        smoothScroll() {
            this.lenis = new Lenis({
                anchors: true,
                // allowNestedScroll: true
            });

            this.lenis.on('scroll', ScrollTrigger.update);

            gsap.ticker.add((time) => {
                this.lenis.raf(time * 1000);
            });

            gsap.ticker.lagSmoothing(0);
        },
        ready(callback) {
            baunfire.smoothScroll();
            baunfire.init();
            if (typeof callback === 'function') callback(baunfire);
        }
    };

    w.baunfire = baunfire;

})(window);
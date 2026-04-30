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

            ScrollTrigger.config({ autoRefreshEvents: "none" });

            let i = 0;
            const next = () => {
                if (i >= this.modules.length) {
                    ScrollTrigger.refresh();
                    ScrollTrigger.config({ autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize" });
                    return;
                }

                const mod = this.modules[i++];

                if (mod.selector && !document.querySelector(mod.selector)) {
                    next();
                    return;
                }

                if (typeof mod.init === 'function') {
                    mod.init(baunfire);
                }
                setTimeout(next, 0);
            };

            next();
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
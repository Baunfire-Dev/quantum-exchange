(function () {
    const $ = baunfire.$;

    baunfire.Global = {
        init() {
            this.handleSpecialLinks();
        },

        debounce(func, delay = 300) {
            let timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(null, args), delay);
            };
        },

        screenSizeChange() {
            ScrollTrigger.refresh();
            baunfire.lenis?.resize();
        },

        siteScrolling(enabled = true) {
            if (enabled) {
                $("html").removeClass("disable-scrolling");
                baunfire.lenis?.start();
            } else {
                $("html").addClass("disable-scrolling");
                baunfire.lenis?.stop();
            }
        },

        callAfterResize(func, delay = 0.2) {
            const dc = gsap.delayedCall(delay, func).pause();
            const handler = () => dc.restart(true);
            window.addEventListener("resize", handler);
            return handler;
        },

        generateVimeoIframe(id, background = false) {
            if (background) {
                // https://player.vimeo.com/video/${id}?height=1920&width=1080&title=0&pip=0&autopause=1&airplay=0&vimeo_logo=0&dnt=1&api=1&background=1
                return `<iframe class="pointer-events-none" src="https://player.vimeo.com/video/${id}?badge=0&portrait=0&byline=0&title=0&pip=0&autopause=1&airplay=0&vimeo_logo=0&dnt=1&background=1" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"></iframe>`;
            }

            return `<iframe src="https://player.vimeo.com/video/${id}?badge=0&portrait=0&byline=0&title=0&pip=0&autopause=1&airplay=0&vimeo_logo=0&dnt=1" playsinline frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"></iframe>`;
        },

        refreshScrollTriggers() {
            const triggers = ScrollTrigger.getAll();

            triggers.forEach((trigger) => {
                // if (trigger.vars.id == 'nav-bg-scroll' || trigger.vars.id == 'nav-bg-hide') return;
                trigger.refresh(true);
            });
        },

        handleSpecialLinks() {
            const download = () => {
                const links = $(`a[href^="download:"]`);
                if (!links.length) return;

                links.each(function () {
                    const self = $(this);
                    const href = self.attr('href');
                    self.attr('href', href.replace('download:', ''));
                    self.attr('download', '');
                });
            }

            download();
        },

        updateSelectClass(target) {
            const parent = target.selectmenu("menuWidget");
            parent.find(".selected").removeClass("selected");

            const activeItem = parent.find(".ui-state-active");
            activeItem.addClass("selected");
        },

        convertRemToPixels(rem) {
            return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
        },

        importVimeoScript(callback) {
            if (window.Vimeo) {
                callback?.(window.Vimeo);
                return;
            }

            this.fancyLog('Loading Vimeo Player...');

            const script = document.createElement('script');
            script.src = `${templateURL}/assets/js/external/vimeo-player.js`;
            script.defer = true;

            script.onload = () => {
                this.fancyLog('Vimeo Player loaded:', window.Vimeo);
                callback?.(window.Vimeo);
            };

            script.onerror = () => {
                console.error('Failed to load Vimeo Player script.');
            };

            document.body.appendChild(script);
        },

        importYouTubeScript(callback) {
            if (window.YT && window.YT.Player) {
                callback?.(window.YT);
                return;
            }

            this.fancyLog('Loading YouTube Iframe API...');

            const script = document.createElement('script');
            script.src = "https://www.youtube.com/iframe_api";
            script.defer = true;

            script.onload = () => {
                this.fancyLog('YouTube Iframe API loaded:', window.YT);

                // The API triggers window.onYouTubeIframeAPIReady when it's ready.
                // We hook into that so callback only fires at the right time.
                const previous = window.onYouTubeIframeAPIReady;
                window.onYouTubeIframeAPIReady = () => {
                    previous?.();
                    callback?.(window.YT);
                };
            };

            script.onerror = () => {
                console.error('Failed to load YouTube Iframe API.');
            };

            document.body.appendChild(script);
        },

        importHubspotScript(callback) {
            if (typeof hbspt !== 'undefined') {
                callback?.();
                return;
            }

            this.fancyLog('Loading Hubspot...');

            const script = document.createElement('script');
            script.src = `${templateURL}/assets/js/external/hubspot-embed.min.js`;
            script.defer = true;

            script.onload = () => {
                this.fancyLog('Hubspot Embed loaded.');
                callback?.();
            };

            script.onerror = () => {
                console.error('Failed to load Hubspot Embed script.');
            };

            document.body.appendChild(script);
        },

        importVimeoThumbnail(videoID, videoThumbnail) {
            fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoID}&width=1920&height=1080`)
                .then(res => res.json())
                .then(data => {
                    $('<img>', {
                        src: data.thumbnail_url,
                        alt: data.title,
                    }).appendTo(videoThumbnail);
                });
        },

        fancyLog(message, type = "info") {
            const styles = {
                info: {
                    label: 'ℹ️ INFO:',
                    style1: 'color: white; background-color: #2196F3; padding: 2px 6px; border-radius: 4px;',
                    style2: 'color: #FFF;'
                },
                warn: {
                    label: '⚠️ WARNING:',
                    style1: 'color: black; background-color: #FFEB3B; padding: 2px 6px; border-radius: 4px;',
                    style2: 'color: #000;'
                },
                error: {
                    label: '⛔ ERROR:',
                    style1: 'color: white; background-color: #F44336; padding: 2px 6px; border-radius: 4px;',
                    style2: 'color: #FFF;'
                }
            };

            const { label, style1, style2 } = styles[type] || styles.info;

            if (typeof message === 'object') {
                console.log(`%c${label}`, style1);
                console.log(message);
            } else {
                console.log(`%c${label} %c ${message}`, style1, style2);
            }
        },

        handleTextCount(el) {
            const counter = el.find("span");
            const rawAmount = counter.data("amount").toString();

            let clean = v => (v + "").replace(/[^\d\.-]/gi, "");
            let num = clean(rawAmount);
            let decimals = (num.split(".")[1] || "").length;

            let proxy = { val: parseFloat(clean(counter.text())) || 0 };

            gsap.to(proxy, {
                val: +num,
                duration: 0.8,
                ease: "linear",
                onUpdate: () => {
                    counter.text(this.formatNumber(proxy.val, decimals));
                }
            });
        },

        formatNumber(value, decimals) {
            let s = (+value).toLocaleString("en-US").split(".");
            return decimals ? s[0] + "." + ((s[1] || "") + "00000000").substr(0, decimals) : s[0];
        },
    };

    baunfire.addModule(baunfire.Global);
})();

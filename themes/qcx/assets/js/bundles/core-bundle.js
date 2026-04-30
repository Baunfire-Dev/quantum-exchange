import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, ScrollToPlugin);

const lenis = new Lenis({ anchors: true });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;
window.ScrollToPlugin = ScrollToPlugin;
window.ScrambleTextPlugin = ScrambleTextPlugin;
window.Lenis = Lenis;
window.__lenis = lenis;

export { gsap, ScrollTrigger, ScrollToPlugin, Lenis };
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, ScrollToPlugin);

window.gsap = gsap;
window.ScrollTrigger = ScrollTrigger;
window.ScrambleTextPlugin = ScrambleTextPlugin;
window.ScrollToPlugin = ScrollToPlugin;
window.Lenis = Lenis;

export { gsap, ScrollTrigger, ScrambleTextPlugin, ScrollToPlugin, Lenis };
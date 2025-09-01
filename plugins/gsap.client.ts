import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { Draggable } from 'gsap/Draggable';
import { SplitText } from 'gsap/SplitText';
import CustomEase from 'gsap/CustomEase';
import CustomWiggle from 'gsap/CustomWiggle';
import InertiaPlugin from 'gsap/InertiaPlugin';
import TextPlugin from 'gsap/TextPlugin';

const gsapCombined = {
  ...gsap,
  CustomEase,
  CustomWiggle,
  Draggable,
  Flip,
  SplitText,
  TextPlugin,
};

export default defineNuxtPlugin(() => {
  gsap.registerPlugin(CustomEase, CustomWiggle, Draggable, Flip, InertiaPlugin, TextPlugin, SplitText);

  return {
    provide: {
      gsap: gsapCombined,
    },
  };
});

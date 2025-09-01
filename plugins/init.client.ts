import { onLongPress } from '@vueuse/core';
import { useAppStore } from '~/store/appStore';
import type { DocumentWithFullscreenAPI } from '~/types/DocumentWithFullscreenAPI';

export default defineNuxtPlugin((nuxtApp) => {
  const appStore = useAppStore();
  const { toggleFullscreen } = useFullscreen();

  function onFullscreenChange() {
    const doc = window.document as DocumentWithFullscreenAPI;
    const fullscreenElement = doc.fullscreenElement || doc.mozFullScreenElement || doc.webkitFullscreenElement || doc.msFullscreenElement;
    const isFullscreen = fullscreenElement !== undefined && fullscreenElement !== null;
    appStore.fullscreen = isFullscreen;
  }

  const attachGlobalEventListeners = () => {
    document.body.addEventListener('keydown', (e) => {
      if (e.key === 'Dead' || e.key === '`') appStore.debug = !appStore.debug;

      if (e.key === '0') {
        toggleFullscreen();
      }
    });

    onLongPress(
      document.body,
      () => {
        appStore.debug = !appStore.debug;
      },
      { delay: 2000 }
    );

    const fullscreenChangeEventNames = ['fullscreenchange', 'mozfullscreenchange', 'webkitfullscreenchange', 'msfullscreenchange'];
    fullscreenChangeEventNames.forEach((eventName) => {
      document.addEventListener(eventName, onFullscreenChange);
    });
  };

  const doc = window.document as DocumentWithFullscreenAPI;
  appStore.supportsFullscreen = doc.fullscreenEnabled || doc.mozFullscreenEnabled || doc.webkitFullscreenEnabled || doc.msFullscreenEnabled;

  attachGlobalEventListeners();
});

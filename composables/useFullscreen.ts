import { useAppStore } from '~/store/appStore';
import type { DocumentWithFullscreenAPI } from '~/types/DocumentWithFullscreenAPI';
import type { HTMLElementWithFullscreenAPI } from '~/types/HTMLElementWithFullscreenAPI';

export function useFullscreen() {
  const store = useAppStore();

  const enterFullscreen = () => {
    if (!store.supportsFullscreen) return;

    const docEl = window.document.documentElement as HTMLElementWithFullscreenAPI;
    const requestFullscreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullscreen || docEl.msRequestFullscreen;
    if (!store.fullscreen) {
      requestFullscreen.call(docEl);
    }
  };

  const exitFullscreen = () => {
    if (!store.supportsFullscreen) return;

    const doc = window.document as DocumentWithFullscreenAPI;
    const cancelFullscreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
    if (store.fullscreen) {
      cancelFullscreen.call(doc);
    }
  };

  const toggleFullscreen = () => {
    if (store.fullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

  return { enterFullscreen, exitFullscreen, toggleFullscreen };
}

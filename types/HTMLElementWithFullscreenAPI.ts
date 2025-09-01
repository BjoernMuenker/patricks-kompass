export interface HTMLElementWithFullscreenAPI extends HTMLElement {
  mozRequestFullScreen(): Promise<void>;
  webkitRequestFullscreen(): Promise<void>;
  msRequestFullscreen(): Promise<void>;
}

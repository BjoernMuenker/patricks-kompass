export interface DocumentWithFullscreenAPI extends Document {
  msExitFullscreen(): Promise<void>;
  mozCancelFullScreen(): Promise<void>;
  webkitExitFullscreen(): Promise<void>;
  msFullscreenElement: Element;
  mozFullScreenElement: Element;
  webkitFullscreenElement: Element;
  msFullscreenEnabled: boolean;
  mozFullscreenEnabled: boolean;
  webkitFullscreenEnabled: boolean;
}

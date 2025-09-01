import { AudioService } from '../services/AudioService';

export default defineNuxtPlugin(() => {
  return {
    provide: {
      audio: new AudioService(),
    },
  };
});

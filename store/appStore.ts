export const useAppStore = defineStore(
  'appStore',
  () => {
    const activeGameId = ref('');
    const playerId = ref('');
    const debug = ref(false);
    const fullscreen = ref(false);
    const supportsFullscreen = ref(false);

    return {
      activeGameId,
      debug,
      fullscreen,
      playerId,
      supportsFullscreen,
    };
  },
  {
    persist: {
      pick: ['activeGameId', 'playerId'],
      storage: piniaPluginPersistedstate.localStorage(),
    },
  }
);

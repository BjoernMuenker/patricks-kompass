import { Howl } from 'howler';

// current audiosprite settings
// audiosprite *.mp3 -f howler2 -g 0.1 -i 1 -b 64 -o global
// for i in *.wav; do ffmpeg -i "$i" -filter:a "volume=0.5" "${i%.*}.mp3"; done

type HowlerEvent = 'play' | 'end' | 'pause' | 'stop' | 'mute' | 'volume' | 'rate' | 'seek' | 'fade' | 'unlock';
let soundIds: number[] = [];

const sprites = {
  global: {
    acid: [0, 2872.063492063492],
    auroraBeam: [2972.063492063492, 616.077097505669],
    ballPoof: [3688.1405895691614, 575.9863945578231],
    ballToss: [4364.126984126984, 575.9863945578231],
    battleWildPokemonIntro: [5040.113378684807, 16488.004535147393],
    battleWildPokemonLoop: [21628.117913832204, 31368.00453514739, true],
    bind: [53096.12244897959, 943.8548752834492],
    bite: [54139.97732426304, 272.3809523809493],
    boneClub: [54512.358276643994, 234.6938775510239],
    bonemerang: [54847.05215419502, 1783.2653061224519],
    clamp: [56730.31746031747, 1774.8072562358245],
    collision: [58605.1247165533, 288.0045351473939],
    confuseRay: [58993.129251700695, 817.2562358276637],
    confusion: [59910.38548752836, 682.5396825396837],
    dig: [60692.92517006805, 334.2403628117907],
    dragonRage: [61127.16553287984, 2437.2789115646256],
    dreamEater: [63664.44444444446, 3083.7414965986413],
    earthquake: [66848.18594104309, 4289.478458049885],
    ember: [71237.66439909297, 568.5941043083886],
    flamethrower: [71906.25850340136, 1763.0839002267608],
    getKeyItem: [73769.34240362812, 2208.0045351473955],
    goInside: [76077.3469387755, 408.0045351473984],
    goOutside: [76585.3514739229, 695.9863945578206],
    gust: [77381.33786848071, 1443.673469387761],
    headbutt: [78925.01133786846, 253.60544217687675],
    hydroPump: [79278.61678004534, 3670.226757369619],
    hyperBeam: [83048.84353741496, 3719.954648526084],
    hypnosis: [86868.79818594104, 2436.4625850340076],
    introLoop: [89405.26077097503, 19055.98639455782, true],
    levelUp: [108561.24716553284, 2328.004535147386],
    lick: [110989.25170068022, 1242.0181405895646],
    mtMoonLoop: [112331.2698412698, 83495.98639455781, true],
    palletTownLoop: [195927.2562358276, 32015.986394557814, true],
    petalDance: [228043.24263038542, 817.233560090699],
    pewterCityLoop: [228960.4761904761, 29664.013605442193, true],
    pokemonCaught: [258724.4897959183, 2664.0136054421646],
    pokemonCenterLoop: [261488.5034013605, 28775.986394557833, true],
    pound: [290364.48979591834, 156.55328798186474],
    pressAB: [290621.04308390024, 288.00453514736546],
    psybeam: [291009.04761904763, 2423.333333333346],
    psychic: [293532.380952381, 1699.047619047633],
    quickAttack: [295331.42857142864, 995.2834467119942],
    razorLeaf: [296426.71201814065, 4688.820861677982],
    roadToLavenderTownLoop: [301215.5328798187, 29784.013605442167, true],
    rockSlide: [331099.5464852609, 3998.9569160997576],
    rollingKick: [335198.50340136065, 580.544217687077],
    scratch: [335879.04761904775, 334.28571428572695],
    skullBash: [336313.3333333335, 1259.1836734694084],
    skyAttack: [337672.51700680295, 1326.9387755102002],
    slam: [339099.45578231313, 348.3673469388009],
    slash: [339547.823129252, 563.8548752834254],
    sludge: [340211.67800453544, 2104.6031746031986],
    smog: [342416.28117913863, 916.9387755102321],
    solarBeam: [343433.2199546489, 2523.6054421768586],
    submission: [346056.8253968258, 845.9637188208831],
    surf: [347002.7891156467, 4101.088435374151],
    tackle: [351203.8775510209, 331.85941043086586],
    takeDown: [351635.73696145177, 414.7845804988606],
    thunderShock: [352150.52154195064, 1507.4149659864133],
    thunderbolt: [353757.9365079371, 2672.7891156462533],
    titleScreenIntro: [356530.72562358336, 4128.004535147397],
    titleScreenLoop: [360758.73015873076, 43248.004535147404, true],
    vineWhip: [404106.7346938782, 598.0272108843678],
    viridianCityLoop: [404804.7619047626, 57648.00453514738, true],
    viridianForestLoop: [462552.76643991, 101064.01360544215, true],
    viseGrip: [563716.7800453522, 516.6893424036516],
    waterGun: [564333.4693877558, 732.494331065709],
    waterfall: [565165.9637188215, 2161.6780045351334],
    welcomeLoop: [567427.6417233567, 19104.01360544222, true],
    wrap: [586631.6553287989, 1277.2335600907354],
  },
};

export type GlobalAudioId = keyof typeof sprites.global;

type SpriteId = 'global';

export class AudioService {
  private howlerInstances!: Map<SpriteId, Howl>;

  constructor() {
    this.howlerInstances = new Map();
  }

  loadSprite(namespace: SpriteId, callback?: () => void) {
    if (this.howlerInstances.get(namespace)) return;

    const namespaceKebab = namespace
      .match(/[A-Z]{2,}(?=[A-Z][a-z0-9]*|\b)|[A-Z]?[a-z0-9]*|[A-Z]|[0-9]+/g)!
      .filter(Boolean)
      .map((x) => x.toLowerCase())
      .join('-');

    this.howlerInstances.set(
      namespace,
      new Howl({
        src: [
          new URL(`../assets/audio/${namespaceKebab}.ogg`, import.meta.url).href,
          new URL(`../assets/audio/${namespaceKebab}.mp3`, import.meta.url).href,
          new URL(`../assets/audio/${namespaceKebab}.m4a`, import.meta.url).href,
          new URL(`../assets/audio/${namespaceKebab}.ac3`, import.meta.url).href,
        ],
        sprite: (sprites as any)[namespace],
        onload: () => {
          console.log('audio preloaded');
          if (callback) callback();
        },
      })
    );
  }

  play(audioId: GlobalAudioId) {
    const result = this.howlerInstances.get('global')?.play(audioId);
    if (result) {
      soundIds.push(result);
    }

    // console.log(`play ${audioId} (${result})`);

    return result;
  }

  stop(id: number) {
    this.howlerInstances.get('global')?.stop(id);
    soundIds = soundIds.filter((soundId) => soundId !== id);
  }

  once(id: number, event: HowlerEvent, callback: () => void) {
    return this.howlerInstances.get('global')?.once(event, callback, id);
  }

  fade(id: number, from: number, to: number, duration = 1) {
    this.howlerInstances.get('global')?.fade(from, to, duration * 1000, id);
  }

  fadeIn(id: number, duration = 1) {
    this.howlerInstances.get('global')?.fade(0, 1, duration * 1000, id);
  }

  fadeOut(id: number, duration = 1) {
    if (this.isMuted(id)) return;
    if (!this.isPlaying(id)) return;

    this.howlerInstances.get('global')?.fade(1, 0, duration * 1000, id);
  }

  playSequentially(audioIds: [GlobalAudioId, GlobalAudioId]) {
    const id = this.play(audioIds[0]);
    if (!id) return;

    this.once(id, 'end', () => {
      this.play(audioIds[1]);
    });
  }

  fadeOutAndStop(id: number, duration = 1) {
    // we will NOT fade out audio that is already muted/stopped
    if (this.isMuted(id)) return;

    this.once(id, 'fade', () => {
      this.stop(id);
    });

    this.fadeOut(id, duration);
  }

  volume(id: number, volume: number) {
    this.howlerInstances.get('global')?.volume(volume, id);
  }

  crossfade(fromId: number, toId: number, duration = 1) {
    this.howlerInstances.get('global')?.fade(1, 0, duration * 1000, fromId);
    this.howlerInstances.get('global')?.fade(0, 1, duration * 1000, toId);
  }

  stopAll() {
    this.howlerInstances.get('global')?.stop();
  }

  fadeOutAll(duration = 1) {
    this.howlerInstances.get('global')?.fade(1, 0, duration);
  }

  fadeOutAndStopAll(duration = 1) {
    console.log('fadeOutAndStopAll with these ids', soundIds);

    soundIds.slice().forEach((id) => {
      this.howlerInstances.get('global')?.once(
        'fade',
        () => {
          this.stop(id);
        },
        id
      );

      this.fadeOut(id, duration);
    });
  }

  isMuted(id: number) {
    return this.howlerInstances.get('global')?.volume(id) === 0;
  }

  isPlaying(id: number) {
    return this.howlerInstances.get('global')?.playing(id);
  }
}

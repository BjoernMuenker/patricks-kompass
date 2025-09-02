<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { Loader } from '@googlemaps/js-api-loader';
  import { markers } from '~/content/markers';
  import type { CustomMarker } from '~/types/CustomMarker';
  import type { CreatorId } from '~/types/CreatorId';
  import { creators } from '~/content/creators';
  import type { Creator } from '~/types/Creator';
  import { MarkerClusterer } from '@googlemaps/markerclusterer';

  const { $gsap } = useNuxtApp();

  const activeMarker = ref<CustomMarker>();

  // Map container reference
  const mapElement = ref<HTMLElement | null>(null);
  let map: any = null;

  // Initialize the Google Maps loader using GOOGLE_API_KEY
  const loader = new Loader({
    apiKey: useRuntimeConfig().public.GOOGLE_API_KEY,
    version: 'weekly',
    libraries: ['places'],
  });

  function getConicGradient(creators: Creator[]) {
    const degPerCreator = 360 / creators.length;

    let result = `conic-gradient(`;

    creators.forEach((creator, index) => {
      result += `${creator.color} ${degPerCreator * index}deg ${degPerCreator * (index + 1)}deg`;
      result += index !== creators.length - 1 ? ', ' : ')';
    });

    console.log(result);
    return result;
  }

  function createClusterElement(count: number) {
    const div = document.createElement('div');
    div.classList.add('custom-marker');
    div.classList.add('cluster-marker');
    div.textContent = String(count);
    return div;
  }

  onMounted(async () => {
    // Import necessary libraries explicitly
    const googleMaps = await loader.importLibrary('maps');
    const markerLib = await loader.importLibrary('marker');
    const placesLibrary = await loader.importLibrary('places');

    // Create the map
    map = new google.maps.Map(mapElement.value as HTMLElement, {
      disableDefaultUI: true, // disables all default UI elements
      mapId: '1d09d952f280d55f39d1e5d1',
    });

    map.setOptions({
      clickableIcons: false, // disable all built-in POI clicks
    });

    const advancedMarkers = [];

    // Add markers dynamically
    for (const marker of markers) {
      const { placeId, lat, lng, creatorIds } = marker;
      const _creators = sortAlphabetically(
        creatorIds.map((id) => creators[id]),
        'asc',
        'firstName'
      );

      // Create DOM element for marker content
      const el = document.createElement('div');
      el.classList.add('custom-marker');
      el.style.background = getConicGradient(_creators);
      // el.style.cursor = 'pointer';
      // el.style.border = '3px solid white';
      // el.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2), 0 -1px 0px rgba(0, 0, 0, 0.02)';

      let place;

      if (placeId) {
        place = new placesLibrary.Place({
          id: placeId,
        });

        await place.fetchFields({ fields: ['location'] });

        console.log({ lat: place.location.lat(), lng: place.location.lng() });
      }

      const advancedMarkerElement = new markerLib.AdvancedMarkerElement({
        map,
        ...(lat && lng && { position: { lat, lng } }),
        ...(place && place.location && { position: place.location }),
        content: el,
      });

      // Optional click event
      advancedMarkerElement.addListener('click', async (e: any) => {
        marker.creators = creatorIds.map((id) => creators[id]);
        activeMarker.value = marker;

        await nextTick();

        document.querySelectorAll('.custom-marker').forEach((element) => element.classList.remove('active'));

        e.domEvent.target.classList.add('active');

        openOffCanvas();

        // Recenter map so marker stays in the visible center

        const windowHeight = window.innerHeight;
        const offCanvasHeight = document.querySelector('.off-canvas')?.clientHeight ?? 0;
        const offCanvasPercentage = offCanvasHeight / windowHeight;

        const offsetX = window.innerWidth >= 1024 ? -300 : 0;
        const offsetY = window.innerHeight * (window.innerWidth >= 1024 ? 0 : +offCanvasPercentage / 2);

        map.setCenter(advancedMarkerElement.position);
        map.panBy(offsetX, offsetY);
      });

      advancedMarkers.push(advancedMarkerElement);
    }

    // After markers are added, compute bounds
    if (advancedMarkers.length === 0) return;

    const bounds = new google.maps.LatLngBounds();

    advancedMarkers.forEach((marker) => {
      if (marker.position) {
        bounds.extend(marker.position);
      }
    });

    const isPortrait = window.innerWidth / window.innerHeight < 1;

    map.fitBounds(bounds, isPortrait ? 0 : window.innerWidth / 20);

    const renderer = {
      render: ({ count, position }: any) => {
        return new markerLib.AdvancedMarkerElement({
          position,
          content: createClusterElement(count),
          zIndex: 1000,
        });
      },
    };

    new MarkerClusterer({
      markers: advancedMarkers,
      map,
      renderer,
    });
  });

  //  {
  //       render: (cluster, stats, map) => {
  //         console.log(cluster, stats, map);
  //         // change color if this cluster has more markers than the mean cluster
  //         // const color = stats.markers.sum > Math.max(10, stats.clusters.markers.mean) ? '#ff0000' : '#0000ff';
  //         // create svg url with fill color
  //         const svg = `

  //           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  //             <defs>
  //               <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
  //                 <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)" />
  //               </filter>
  //             </defs>
  //             <circle r="80" cx="100" cy="100" fill="#cdcdcd" stroke="white" stroke-width="12" filter="url(#shadow)" />
  //           </svg>`;

  //         // create marker using svg icon
  //         return new google.maps.Marker({
  //           position: cluster.position,
  //           icon: {
  //             url: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
  //             scaledSize: new google.maps.Size(50, 50),
  //           },
  //           label: {
  //             text: String(cluster.count),
  //             color: 'black',
  //             fontWeight: '700',
  //             fontSize: '18px',
  //           },
  //           // adjust zIndex to be above other markers
  //           zIndex: 1000 + cluster.count,
  //         });
  //       },

  function closeOffCanvas() {
    document.querySelectorAll('.custom-marker').forEach((element) => element.classList.remove('active'));

    $gsap.to('.off-canvas', {
      transform: window.innerWidth >= 1024 ? 'translate(calc(-100% - 30px), 0)' : 'translate(0, 100%)',
      duration: 0.3,
      onComplete: () => {
        $gsap.set('.off-canvas', { clearProps: 'all' });
        activeMarker.value = undefined;
      },
    });
  }

  function openOffCanvas() {
    $gsap.to('.off-canvas', { transform: 'none', duration: 0.3 });
  }
</script>

<template>
  <div ref="mapElement" class="google-maps-container"></div>
  <div class="off-canvas">
    <div class="off-canvas-header off-canvas-inner">
      <div class="creator-title-container">
        <div class="creators" v-if="activeMarker && activeMarker.creators">
          <div class="creator-color" :style="{ background: getConicGradient(activeMarker.creators) }"></div>
          <div class="creator-names">{{ activeMarker.creators?.map((creator) => creator.firstName).join(', ') }}</div>
        </div>
        <div class="title">{{ activeMarker?.title }}</div>
      </div>
      <button class="button-close-off-canvas" @click="closeOffCanvas">×</button>
    </div>
    <div v-if="activeMarker?.description" class="off-canvas-body off-canvas-inner">
      <div class="description" v-html="activeMarker?.description"></div>
    </div>
  </div>
</template>

<style lang="scss">
  .google-maps-container {
    width: 100%;
    height: 110%;
    transform: translateY(-5%);
    margin: 0;
    padding: 0;

    > div {
      width: 100% !important;
      height: 100% !important;
    }
  }

  .creators {
    display: inline-flex;
    gap: spacing('xs');
    align-items: center;
    padding: spacing('xxs') spacing('xs') spacing('xxs') spacing('xxs');
    border: 1px solid #cdcdcd;
    border-radius: 30px;
    font-size: 16px;

    .creator-color {
      width: 20px;
      height: 20px;
      border-radius: 50%;

      &:not(:first-of-type) {
        margin-left: -8px;
      }
    }

    @include breakpoint('medium') {
      font-size: 18px;
    }
  }

  .custom-marker {
    position: relative;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    transform: translateY(50%);
    border: 3px solid white;
    transform-origin: bottom;
    transition: transform 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 -1px 0px rgba(0, 0, 0, 0.02);

    &.active {
      transform: scale(1.5) translateY(50%);
    }

    @include hover-only {
      &:hover {
        transform: scale(1.5) translateY(50%);
      }
    }
  }

  .cluster-marker {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 24px;
    text-shadow: 2px 1px 5px black;
    // background: conic-gradient(blue, green, red, blue);
    background: conic-gradient(blue 0deg 120deg, green 120deg 240deg, red 240deg 360deg);
    @include var-font-weight(600);
  }

  .off-canvas {
    position: absolute;
    overflow: hidden;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    box-shadow: 0 1px 2px rgba(60, 64, 67, 0.3), 0 2px 6px 2px rgba(60, 64, 67, 0.15);
    max-height: 70%;
    width: 100%;
    background: white;
    top: auto;
    left: 0;
    bottom: 0;
    transform: translate(0, 100%);
    display: flex;
    flex-direction: column;
    padding-top: spacing('l');
    padding-bottom: 0;

    @include breakpoint('large') {
      padding: spacing('xl') 0;
      max-height: calc(100% - 60px);
      transform: translate(calc(-100% - 30px), 0);
      top: 30px;
      left: 30px;
      // height: calc(100% - 60px);
      width: 500px;
      bottom: initial;
      border-radius: 20px;
    }

    .off-canvas-body {
      height: 100%;
      overflow: scroll;
      padding-top: spacing('l');
      padding-bottom: spacing('l');
      border-top: 1px solid rgb(228, 228, 228);

      @include breakpoint('large') {
        padding-bottom: 0;
        margin-top: spacing('l');
      }
    }

    .off-canvas-header {
      display: flex;
      justify-content: space-between;
      gap: spacing('m');
      margin-bottom: spacing('l');

      @include breakpoint('large') {
        margin-bottom: 0;
      }
    }

    .title {
      font-size: 24px;
      margin-top: spacing('xs');
      @include var-font-weight(550);

      @include breakpoint('medium') {
        font-size: 30px;
      }
    }

    .description {
      font-size: 17px;

      p + p {
        margin-top: spacing('m');
      }

      @include breakpoint('medium') {
        font-size: 20px;
      }
    }
  }

  .off-canvas-inner {
    padding: 0 spacing('l');

    @include breakpoint('large') {
      padding: 0 spacing('xl');
    }
  }

  .button-container {
    position: relative;
  }

  .button-close-off-canvas {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgb(235, 235, 235);
    flex-shrink: 0;
    transition: background ease 0.3s;

    @include hover-only {
      &:hover {
        background: #cdcdcd;
      }
    }
  }
</style>

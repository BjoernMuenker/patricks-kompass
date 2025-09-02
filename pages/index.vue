<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { Loader } from '@googlemaps/js-api-loader';
  import { markers } from '~/content/markers';
  import type { CustomMarker } from '~/types/CustomMarker';
  import type { CreatorId } from '~/types/CreatorId';
  import { creators } from '~/content/creators';

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
      const { placeId, lat, lng, creatorId } = marker;
      const color = creators[creatorId].color;

      // Create DOM element for marker content
      const el = document.createElement('div');
      el.classList.add('custom-marker');
      el.style.backgroundColor = color;
      el.style.cursor = 'pointer';
      el.style.border = '3px solid white';
      el.style.boxShadow = 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px';

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
      advancedMarkerElement.addListener('click', (e: any) => {
        marker.creator = creators[marker.creatorId];
        activeMarker.value = marker;

        document.querySelectorAll('.custom-marker').forEach((element) => element.classList.remove('active'));

        e.domEvent.target.classList.add('active');

        openOffCanvas();

        // Recenter map so marker stays in the visible center

        const offsetX = window.innerWidth >= 1024 ? -300 : 0;
        const offsetY = window.innerHeight * (window.innerWidth >= 1024 ? 0.05 : 0.4);

        map.setCenter(advancedMarkerElement.position);
        // map.setZoom(15); // desired zoom level
        map.panBy(offsetX, offsetY);
      });

      advancedMarkers.push(advancedMarkerElement);
    }

    // After markers are added, compute bounds
    if (advancedMarkers.length > 0) {
      console.log(googleMaps);

      const bounds = new google.maps.LatLngBounds();

      advancedMarkers.forEach((marker) => {
        if (marker.position) {
          bounds.extend(marker.position);
        }
      });

      map.fitBounds(bounds, window.innerHeight / 5); // 50px padding so markers aren’t stuck at edges
    }
  });

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
      <div>
        <div class="creator" v-if="activeMarker">
          <div class="creator-color" :style="{ backgroundColor: activeMarker.creator?.color }"></div>
          <div class="creator-name">{{ activeMarker.creator?.firstName }}</div>
        </div>
        <div class="title">{{ activeMarker?.title }}</div>
      </div>
      <button class="button-close-off-canvas" @click="closeOffCanvas">×</button>
    </div>
    <div class="off-canvas-body off-canvas-inner">
      <div class="description" v-html="activeMarker?.description"></div>
    </div>
  </div>
</template>

<style lang="scss">
  .google-maps-container {
    width: 100%; // full width of parent
    height: 110%; // full viewport height
    margin: 0;
    padding: 0;

    // Ensure child divs (Google Maps internal layers) also stretch
    > div {
      width: 100% !important;
      height: 100% !important;
    }
  }

  .creator {
    display: inline-flex;
    gap: spacing('xs');
    align-items: center;
    padding: spacing('xxs') spacing('xs');
    border: 1px solid #cdcdcd;
    border-radius: 30px;

    .creator-color {
      width: 20px;
      height: 20px;
      border-radius: 50%;
    }
  }

  .custom-marker {
    position: relative;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    transform: translateY(50%);
    transform-origin: bottom;
    transition: transform 0.3s ease;

    &.active,
    &:hover {
      transform: scale(1.5) translateY(50%);
    }
  }

  .off-canvas {
    position: relative;
    overflow: hidden;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    box-shadow: rgba(149, 157, 165, 1) 0px 8px 24px;
    position: absolute;
    height: 70%;
    width: 100%;
    background: white;
    top: auto;
    left: 0;
    bottom: 0;
    transform: translate(0, 100%);
    display: flex;
    flex-direction: column;
    padding: spacing('l') 0;

    @include breakpoint('large') {
      padding: spacing('xl') 0;
      transform: translate(calc(-100% - 30px), 0);
      top: 30px;
      left: 30px;
      height: calc(100% - 60px);
      width: 500px;
      border-radius: 20px;
    }

    .off-canvas-body {
      height: 100%;
      overflow: scroll;
      margin-top: spacing('l');
    }

    .off-canvas-header {
      display: flex;
      justify-content: space-between;
    }

    .title {
      font-size: 30px;
    }

    .description {
      font-size: 18px;

      p + p {
        margin-top: spacing('m');
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
    background: rgb(218, 218, 218);
    flex-shrink: 0;
  }

  .title {
    margin-top: spacing('xxs');
  }
</style>

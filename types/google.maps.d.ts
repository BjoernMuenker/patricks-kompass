// google-maps.d.ts
declare global {
  namespace google {
    export namespace maps {
      class Map {
        constructor(mapDiv: HTMLElement, opts?: MapOptions);
        setCenter(latLng: LatLng | LatLngLiteral): void;
        getCenter(): LatLng | null;
        setZoom(zoom: number): void;
        getZoom(): number;
        panBy(x: number, y: number): void;
        fitBounds(bounds: LatLngBounds, padding?: number): void;
      }

      interface MapOptions {
        center?: LatLng | LatLngLiteral;
        zoom?: number;
        mapId?: string;
        disableDefaultUI?: boolean;
        clickableIcons?: boolean;
        styles?: any[];
      }

      class LatLng {
        constructor(lat: number, lng: number);
        lat(): number;
        lng(): number;
      }

      interface LatLngLiteral {
        lat: number;
        lng: number;
      }

      class LatLngBounds {
        constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral);
        extend(point: LatLng | LatLngLiteral): LatLngBounds;
        getCenter(): LatLng;
        getNorthEast(): LatLng;
        getSouthWest(): LatLng;
      }

      class Size {
        constructor(width: number, height: number, widthUnit?: string, heightUnit?: string);
      }

      interface MarkerOptions {
        map?: Map;
        position?: LatLng | LatLngLiteral;
        title?: string;
        clickable?: boolean;
      }

      class AdvancedMarkerElement {
        constructor(opts: AdvancedMarkerElementOptions);
        map: Map | null;
        position: LatLng | LatLngLiteral;
        title?: string;
        content: HTMLElement;
        zIndex: number;
      }

      interface AdvancedMarkerElementOptions {
        map?: Map;
        position: LatLng | LatLngLiteral;
        title?: string;
        content: HTMLElement;
      }

      // Events
      const event: {
        addListener(instance: any, eventName: string, handler: (...args: any[]) => void): void;
        addListenerOnce(instance: any, eventName: string, handler: (...args: any[]) => void): void;
      };
    }
  }
}

export {};

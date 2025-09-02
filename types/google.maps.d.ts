// google-maps.d.ts
declare global {
  namespace google {
    export namespace maps {
      // Map
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

      // LatLng & LatLngLiteral
      class LatLng {
        constructor(lat: number, lng: number);
        lat(): number;
        lng(): number;
      }

      interface LatLngLiteral {
        lat: number;
        lng: number;
      }

      // LatLngBounds
      class LatLngBounds {
        constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral);
        extend(point: LatLng | LatLngLiteral): LatLngBounds;
        getCenter(): LatLng;
        getNorthEast(): LatLng;
        getSouthWest(): LatLng;
      }

      // Size
      class Size {
        constructor(width: number, height: number, widthUnit?: string, heightUnit?: string);
      }

      // Marker
      class Marker {
        constructor(opts?: MarkerOptions);
        setMap(map: Map | null): void;
        getMap(): Map | null;
        setPosition(position: LatLng | LatLngLiteral): void;
        getPosition(): LatLng | null;
      }

      interface MarkerOptions {
        map?: Map;
        position?: LatLng | LatLngLiteral;
        title?: string;
        clickable?: boolean;
      }

      // AdvancedMarkerElement (new marker API)
      class AdvancedMarkerElement {
        constructor(opts: AdvancedMarkerElementOptions);
        map: Map | null;
        position: LatLng | LatLngLiteral;
        title?: string;
        content: HTMLElement;
      }

      interface AdvancedMarkerElementOptions {
        map?: Map;
        position: LatLng | LatLngLiteral;
        title?: string;
        content: HTMLElement;
      }

      // Places library (partial)
      export namespace places {
        class Place {
          constructor(opts: PlaceOptions);
          id: string;
          displayName?: string;
          location?: LatLng;
          fetchFields(opts: { fields: string[] }): Promise<void>;
        }

        interface PlaceOptions {
          id: string;
          requestedLanguage?: string;
        }
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

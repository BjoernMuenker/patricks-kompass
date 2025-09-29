import type { Creator } from './Creator';
import type { CreatorId } from './CreatorId';

export type CustomMarker = {
  lat: number;
  lng: number;
  title: string;
  description?: string | { creatorId: CreatorId; title?: string; content?: string }[];
  link?: string;
  creatorIds: CreatorId[];
  creators?: Creator[];
};

import type { Creator } from './Creator';
import type { CreatorId } from './CreatorId';

export type CustomMarker = {
  lat?: number;
  lng?: number;
  placeId?: string;
  title: string;
  description?: string;
  creatorIds: CreatorId[];
  creators?: Creator[];
};

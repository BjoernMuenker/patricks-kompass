import type { CreatorId } from './CreatorId';

export interface Creator {
  firstName: string;
  lastName: string;
  id: CreatorId;
  color: string;
}

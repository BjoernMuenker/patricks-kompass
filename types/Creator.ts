import type { ColorName } from './ColorName';
import type { CreatorId } from './CreatorId';

export interface Creator {
  firstName: string;
  lastName: string;
  id: CreatorId;
  color: ColorName;
}

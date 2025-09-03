import type { Creator } from '~/types/Creator';
import type { CreatorId } from '~/types/CreatorId';

export const creators: { [key in CreatorId]: Creator } = {
  bjoern: {
    id: 'bjoern',
    firstName: 'Björn',
    lastName: 'Münker',
    color: '#bfef45',
  },
  laura: {
    id: 'laura',
    firstName: 'Laura',
    lastName: 'Orlowski',
    color: '#0082c8',
  },
  sophia: {
    id: 'sophia',
    firstName: 'Sophia',
    lastName: 'Zimmermann',
    color: '#f032e6',
  },
};

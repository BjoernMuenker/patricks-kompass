import type { Creator } from '~/types/Creator';
import type { CreatorId } from '~/types/CreatorId';

export const creators: { [key in CreatorId]: Creator } = {
  bjoern: {
    id: 'bjoern',
    firstName: 'Björn',
    lastName: 'Münker',
    color: 'yellow',
  },
  britta: {
    id: 'britta',
    firstName: 'Britta',
    lastName: 'Geier',
    color: 'orange',
  },
  carla: {
    id: 'carla',
    firstName: 'Carla',
    lastName: 'Hohmann',
    color: 'magenta',
  },
  hannes: {
    id: 'hannes',
    firstName: 'Hannes',
    lastName: 'Heepmann',
    color: 'green',
  },
  julia: {
    id: 'julia',
    firstName: 'Julia',
    lastName: '',
    color: 'lime',
  },
  laura: {
    id: 'laura',
    firstName: 'Laura',
    lastName: 'Orlowski',
    color: 'blue',
  },
  sebastian: {
    id: 'sebastian',
    firstName: 'Sebastian',
    lastName: 'Kamprath',
    color: 'cyan',
  },
  sophia: {
    id: 'sophia',
    firstName: 'Sophia',
    lastName: 'Zimmermann',
    color: 'red',
  },
  toni: {
    id: 'toni',
    firstName: 'Toni',
    lastName: 'Konrad',
    color: 'violet',
  },
};

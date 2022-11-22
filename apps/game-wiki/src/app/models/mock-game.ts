import { Game } from './game';

export const GAMES: Game[] = [
  {
    id: 1,
    name: 'God of war',
    price: 60,
    category: 'Adventure',
    releaseDate: new Date('2022-09-11'),
    image: 'https://upload.wikimedia.org/wikipedia/en/a/a7/God_of_War_4_cover.jpg',
    positivePercent: 90,
  },
  {
    id: 2,
    name: 'Call of duty MW2',
    price: 60,
    category: 'Adventure',
    releaseDate: new Date('2022-09-11'),
    image: 'https://imageio.forbes.com/specials-images/imageserve/628d337e791f9767c05ca2e7/1--2-/960x0.jpg?height=887&width=711&fit=bounds',
    positivePercent: 90,
  },
  {
    id: 3,
    name: 'Horizon forbidden west',
    price: 60,
    category: 'Adventure',
    releaseDate: new Date('2022-09-11'),
    image: 'https://image.api.playstation.com/vulcan/ap/rnd/202107/3100/YuD3gr8HlMcHEUi4MtuHTvx5.jpg',
    positivePercent: 90,
  },
];

const processes = [
  {
    id: 'hawker_centre',
    text: 'Order',
    speech: 'I want to order',
    multiSelect: false,
    diverge: true,
    choices: [
      {
        text: 'Chicken rice',
        image: require('../../assets/phrases/chicken_rice.png'),
        next: 'chicken_rice_add_on',
        usageCount: 0,
      },
      {
        text: 'Laksa',
        image: require('../../assets/phrases/laksa.png'),
        next: 'laksa_add_on',
        usageCount: 0,
      },
    ],
  },
  {
    id: 'chicken_rice_add_on',
    text: 'Add-on',
    speech: 'Add on',
    multiSelect: true,
    diverge: false,
    next: 'spicy',
    choices: [
      {
        text: 'Chicken',
        image: require('../../assets/phrases/chicken.png'),
        usageCount: 0,
      },
      {
        text: 'Rice',
        image: require('../../assets/phrases/rice.png'),
        usageCount: 0,
      },
      {
        text: 'Egg',
        image: require('../../assets/phrases/egg.png'),
        usageCount: 0,
      },
    ],
  },
  {
    id: 'laksa_add_on',
    text: 'Add-on',
    speech: 'Add on',
    multiSelect: true,
    diverge: false,
    next: 'spicy',
    choices: [
      {
        text: 'Prawn',
        image: require('../../assets/phrases/prawn.png'),
        usageCount: 0,
      },
      {
        text: 'Fish cake',
        image: require('../../assets/phrases/food.png'),
        usageCount: 0,
      },
      {
        text: 'Egg',
        image: require('../../assets/phrases/egg.png'),
        usageCount: 0,
      },
    ],
  },
  {
    id: 'spicy',
    text: 'Spice Level',
    speech: '',
    multiSelect: false,
    diverge: false,
    next: 'where_eat',
    choices: [
      {
        text: 'Spicy',
        image: require('../../assets/phrases/spicy.png'),
        usageCount: 0,
      },
      {
        text: 'Non-Spicy',
        image: require('../../assets/avatar/none.png'),
        usageCount: 0,
      },
    ],
  },
  {
    id: 'where_eat',
    text: 'Place to eat',
    speech: '',
    multiSelect: false,
    diverge: false,
    next: 'payment',
    choices: [
      {
        text: 'Eat here',
        image: require('../../assets/phrases/food.png'),
        usageCount: 0,
      },
      {
        text: 'Takeaway',
        image: require('../../assets/phrases/takeaway.png'),
        usageCount: 0,
      },
    ],
  },
  {
    id: 'payment',
    text: 'Payment',
    speech: 'Pay by',
    multiSelect: false,
    diverge: false,
    next: 'end',
    choices: [
      {
        text: 'Cash',
        image: require('../../assets/phrases/cash.png'),
        usageCount: 0,
      },
      {
        text: 'Card',
        image: require('../../assets/phrases/card.png'),
        usageCount: 0,
      },
    ],
  },
  {
    id: 'restaurant',
    text: 'Order Food',
    speech: 'I want to order',
    multiSelect: false,
    diverge: false,
    next: 'drinks',
    choices: [
      {
        text: 'Fried Rice',
        image: require('../../assets/phrases/fried_rice.png'),
        usageCount: 0,
      },
      {
        text: 'Ayam Penyet',
        image: require('../../assets/phrases/ayam_goreng.png'),
        usageCount: 0,
      },
      {
        text: 'Dosa',
        image: require('../../assets/phrases/dosa.png'),
        usageCount: 0,
      },
      {
        text: 'Chicken Chop',
        image: require('../../assets/phrases/food.png'),
        usageCount: 0,
      },
    ],
  },
  {
    id: 'drinks',
    text: 'Order Drinks',
    speech: 'I want to order',
    multiSelect: false,
    diverge: false,
    next: 'payment',
    choices: [
      {
        text: 'Tea',
        image: require('../../assets/phrases/tea.png'),
        usageCount: 0,
      },
      {
        text: 'Coffee',
        image: require('../../assets/phrases/coffee.png'),
        usageCount: 0,
      },
      {
        text: 'Juice',
        image: require('../../assets/phrases/mango.png'),
        usageCount: 0,
      },
    ],
  },
  {
    id: 'favourite_mrt_bus_stops',
    text: 'Favourite MRT/Bus Stops',
    speech: 'How to go to',
    multiSelect: false,
    diverge: false,
    next: 'end',
    choices: [
      {
        text: 'Eunos MRT (Me Too Club)',
        image: require('../../assets/phrases/eunos.png'),
        usageCount: 0,
      },
      {
        text: 'Home MRT (put in)',
        image: require('../../assets/phrases/others.png'),
        usageCount: 0,
      },
    ],
  },
  {
    id: 'favourite_places',
    text: 'Favourite Places',
    speech: 'How to go to',
    multiSelect: false,
    diverge: false,
    next: 'end',
    choices: [
      {
        text: 'Home (put address here)',
        image: require('../../assets/phrases/others.png'),
        usageCount: 0,
      },
      {
        text: 'Me Too Club (11 Jalan Ubi Kembangan Chai Chee Community Hub)',
        image: require('../../assets/phrases/minds.png'),
        usageCount: 0,
      },
    ],
  },
  {
    id: 'public_transport',
    text: 'Public Transport',
    speech: '',
    multiSelect: false,
    diverge: false,
    next: 'end',
    choices: [
      {
        text: 'Bus',
        image: require('../../assets/phrases/others.png'),
        usageCount: 0,
      },
      {
        text: 'MRT',
        image: require('../../assets/phrases/others.png'),
        usageCount: 0,
      },
    ],
  },
];

export default processes;

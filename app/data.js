export let phrases = [
  {
    id: "categories",
    text: "Categories",
    choices: [
      { text: "Food", next: "food", size: "normal_button", png: require('../assets/chicken_rice.png') },
      { text: "Transport", next: "transport", size: "normal_button", png: require('../assets/chicken_rice.png') },
      { text: "Directions", next: "directions", size: "normal_button", png: require('../assets/chicken_rice.png') },
      { text: "Things", next: "things", size: "normal_button", png: require('../assets/chicken_rice.png') }
    ]
  },
  {
    id: "food",
    text: "Food",
    choices: [
      { text: "Order", next: "order", size: "normal_button", png: require('../assets/chicken_rice.png') },
      { text: "Describe", next: "describe", size: "normal_button", png: require('../assets/chicken_rice.png') }
    ],
    back: "categories"
  },
  {
    id: "order",
    text: "Order",
    choices: [
      { text: "I want to order Chicken Rice", next: "chicken_rice", size: "normal_button", png: require('../assets/chicken_rice.png') },
      { text: "I want to order fishball noodles", next: "fishball_noodles", size: "normal_button", png: require('../assets/chicken_rice.png') }
    ],
    back: "food"
  },
  {
    id: "chicken_rice",
    text: "I want to order Chicken Rice",
    choices: [
      { text: "I want to order chicken rice", next: "chicken_rice", size: "sound_button", png: require('../assets/chicken_rice.png') }
    ],
    back: "order",
    used: 0
  },
  {
    id: "fishball_noodles",
    text: "I want to order fishball noodles",
    choices: [
      { text: "I want to order fishball noodles", next: "fishball_noodles", size: "sound_button", png: require('../assets/chicken_rice.png') }
    ],
    back: "order",
    used: 0
  }
];
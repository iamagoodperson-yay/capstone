const categories = {
  text: 'Categories',
  choices: [
    {
      text: 'Food',
      image: require('../../assets/phrases/food.png'),
      usageCount: 0,
      choices: [
        {
          text: 'Hawker Centre',
          image: require('../../assets/phrases/hawker_centre.png'),
          id: 'hawker_centre',
          usageCount: 0,
        },
        {
          text: 'Restaurant',
          image: require('../../assets/phrases/food.png'),
          id: 'restaurant',
          usageCount: 0,
        },
      ],
    },
    {
      text: 'Directions',
      image: require('../../assets/phrases/directions.png'),
      usageCount: 0,
      choices: [
        {
            text: 'Favourite MRT/Bus Stops',
            image: require('../../assets/phrases/directions.png'),
            id: 'favourite_mrt_bus_stops',
            usageCount: 0,
        },
        {
            text: 'Favourite Locations',
            image: require('../../assets/phrases/directions.png'),
            id: 'favourite_locations',
            usageCount: 0,
        },
        {
            text: 'Public Transport',
            image: require('../../assets/phrases/directions.png'),
            id: 'public_transport',
            usageCount: 0,
        }
      ],
    },
    {
      text: 'Emergency',
      image: require('../../assets/phrases/emergency.png'),
      usageCount: 0,
      choices: [],
    },
    {
      text: 'Others',
      image: require('../../assets/phrases/others.png'),
      usageCount: 0,
      choices: [],
    },
  ],
};

export default categories;

import React, { createContext, useContext, useState } from 'react';

const categories = {
  text: 'Categories',
  choices: [
    {
      text: 'Food',
      image: require('../../assets/phrases/food.png'),
      choices: [
        {
          text: 'Hawker Centre',
          image: require('../../assets/phrases/hawker_centre.png'),
          id: 'hawker_centre',
        },
      ],
    },
    {
      text: 'Directions',
      image: require('../../assets/phrases/directions.png'),
      choices: [],
    },
    {
      text: 'Emergency',
      image: require('../../assets/phrases/emergency.png'),
      choices: [],
    },
    {
      text: 'Others',
      image: require('../../assets/phrases/others.png'),
      choices: [],
    },
  ],
};

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
      },
      {
        text: 'Laksa',
        image: require('../../assets/phrases/laksa.png'),
        next: 'laksa_add_on',
      },
    ],
  },
  {
    id: 'chicken_rice_add_on',
    text: 'Add-on',
    speech: 'Add on:',
    multiSelect: true,
    diverge: false,
    next: 'where_eat',
    choices: [
      {
        text: 'Extra chicken',
        image: require('../../assets/phrases/food.png'),
      },
      { text: 'Extra rice', image: require('../../assets/phrases/food.png') },
      { text: 'Add egg', image: require('../../assets/phrases/food.png') },
    ],
  },
  {
    id: 'laksa_add_on',
    text: 'Add-on',
    speech: 'Add on:',
    multiSelect: true,
    diverge: false,
    next: 'where_eat',
    choices: [
      { text: 'Add prawn', image: require('../../assets/phrases/food.png') },
      {
        text: 'Add fish cake',
        image: require('../../assets/phrases/food.png'),
      },
      { text: 'Add egg', image: require('../../assets/phrases/food.png') },
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
      { text: 'Eat here', image: require('../../assets/phrases/food.png') },
      { text: 'Takeaway', image: require('../../assets/phrases/takeaway.png') },
    ],
  },
  {
    id: 'payment',
    text: 'Payment',
    speech: 'Pay by:',
    multiSelect: false,
    diverge: false,
    next: 'end',
    choices: [
      { text: 'Cash', image: require('../../assets/phrases/cash.png') },
      { text: 'Card', image: require('../../assets/phrases/card.png') },
    ],
  },
];

const PhrasesContext = createContext();

export const usePhrasesContext = () => {
  const context = useContext(PhrasesContext);
  if (!context)
    throw new Error('usePhrasesContext must be used within PhrasesProvider');
  return context;
};

export const PhrasesProvider = ({ children }) => {
  const [categoriesState, setCategoriesState] = useState(categories);
  const [navigationStack, setNavigationStack] = useState([]);

  const [processesState] = useState(processes);
  const [inProcess, setInProcess] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selected, setSelected] = useState([]);
  const [currentSelections, setCurrentSelections] = useState([]);
  const [allSelections, setAllSelections] = useState([]); // Stores groups of phrases

  const getCurrentCategory = () => {
    if (navigationStack.length === 0) return categoriesState;

    let current = categoriesState;
    for (const item of navigationStack) {
      current = current.choices?.find(choice => choice.text === item);
      if (!current) break;
    }
    return current;
  };

  const addPhrase = (parent, newItem) => {
    if (!parent) return;
    if (newItem.type === 'category') newItem.choices = newItem.choices || [];
    else newItem.choices = undefined;

    parent.choices = parent.choices || [];
    parent.choices.push(newItem);
    setCategoriesState({ ...categoriesState });
  };

  const deletePhrase = (parent, itemText) => {
    if (!parent?.choices) return;
    parent.choices = parent.choices.filter(choice => choice.text !== itemText);
    setCategoriesState({ ...categoriesState });
  };

  const getCurrentTask = () =>
    processesState.find(p => p.id === tasks[tasks.length - 1]?.id);

  const selectChoice = choice =>
    setCurrentSelections(prev => [...prev, choice]);

  const goBackChoice = () => setCurrentSelections(prev => prev.slice(0, -1));

  const getCurrent = () =>
    inProcess ? getCurrentTask() : getCurrentCategory();

  const navigateToChoice = choice => {
    if (inProcess) {
      const currentTask = getCurrentTask();
      if (!currentTask) return;

      // merge selected into currentSelections
      if (selected.length > 0)
        setCurrentSelections(prev => [...prev, ...selected]);

      if (currentTask.next === 'end') {
        // Save currentSelections as a group if not empty
        if (currentSelections.length > 0 || selected.length > 0) {
          const group = [...currentSelections, ...selected];
          setAllSelections(prev => [group, ...prev]);
        }

        // reset everything
        setNavigationStack([]);
        setInProcess(false);
        setTasks([]);
        setSelected([]);
        setCurrentSelections([]);
      } else if (currentTask.diverge) {
        if (selected.length === 0)
          throw new Error('Please choose something to continue');
        setTasks(prev => [
          ...prev,
          processesState.find(p => p.id === selected[0].next),
        ]);
      } else {
        setTasks(prev => [
          ...prev,
          processesState.find(p => p.id === currentTask.next),
        ]);
      }
      setSelected([]);
    } else if (choice?.id) {
      setTasks([processesState.find(p => p.id === choice.id)]);
      setInProcess(true);
      setCurrentSelections([]);
    }

    if (choice?.text) setNavigationStack(prev => [...prev, choice.text]);
  };

  const selectPhrase = item => {
    const currentTask = getCurrentTask();
    if (!currentTask) return;

    if (currentTask.multiSelect) {
      if (!selected.includes(item)) setSelected(prev => [...prev, item]);
      else setSelected(prev => prev.filter(p => p !== item));
    } else {
      setSelected([item]);
    }
  };

  const getSpeechText = () => {
    if (!inProcess) return '';
    const currentTask = getCurrentTask();
    if (!currentTask) return '';

    let speech = currentTask.speech ? currentTask.speech + '\n' : '';
    if (selected.length === 0) return speech + '...';

    speech += currentTask.multiSelect
      ? selected.map(s => s.text).join(', ')
      : selected[0].text;
    return speech;
  };

  const goBack = () => {
    if (inProcess) {
      if (tasks.length <= 1) {
        setNavigationStack(prev => prev.slice(0, -1));
        setInProcess(false);
        setTasks([]);
      } else setTasks(prev => prev.slice(0, -1));
      setSelected([]);
    } else if (navigationStack.length > 0) {
      setNavigationStack(prev => prev.slice(0, -1));
    }
  };

  const getBreadcrumbs = () => ['Categories', ...navigationStack];

  const deleteGroup = index => {
    setAllSelections(prev => prev.filter((_, i) => i !== index));
  };

  const value = {
    categoriesState,
    inProcess,
    getCurrent,
    navigateToChoice,
    selectPhrase,
    getSpeechText,
    goBack,
    canGoBack: navigationStack.length > 0,
    getBreadcrumbs,
    addPhrase,
    deletePhrase,
    allSelections,
    deleteGroup,
  };

  return (
    <PhrasesContext.Provider value={value}>{children}</PhrasesContext.Provider>
  );
};

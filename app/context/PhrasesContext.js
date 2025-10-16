import React, { createContext, useContext, useState } from 'react';
import { speak } from '../utils/tts';

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
      ],
    },
    {
      text: 'Directions',
      image: require('../../assets/phrases/directions.png'),
      usageCount: 0,
      choices: [],
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
    next: 'where_eat',
    choices: [
      {
        text: 'Chicken',
        image: require('../../assets/phrases/food.png'),
        usageCount: 0,
      },
      {
        text: 'Rice',
        image: require('../../assets/phrases/food.png'),
        usageCount: 0,
      },
      {
        text: 'Egg',
        image: require('../../assets/phrases/food.png'),
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
    next: 'where_eat',
    choices: [
      {
        text: 'Prawn',
        image: require('../../assets/phrases/food.png'),
        usageCount: 0,
      },
      {
        text: 'Fish cake',
        image: require('../../assets/phrases/food.png'),
        usageCount: 0,
      },
      {
        text: 'Egg',
        image: require('../../assets/phrases/food.png'),
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
    next: 'spicy',
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
    id: 'spicy',
    text: 'Spice Level',
    speech: '',
    multiSelect: false,
    diverge: false,
    next: 'payment',
    choices: [
      {
        text: 'Spicy',
        image: require('../../assets/phrases/food.png'),
        usageCount: 0,
      },
      {
        text: 'Non-Spicy',
        image: require('../../assets/phrases/food.png'),
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
];

const PhrasesContext = createContext();

export const usePhrasesContext = () => {
  const context = useContext(PhrasesContext);
  if (!context)
    throw new Error('usePhrasesContext must be used within a PhrasesProvider');
  return context;
};

export const PhrasesProvider = ({ children }) => {
  const [categoriesState, setCategoriesState] = useState(categories);
  const [navigationStack, setNavigationStack] = useState([]);

  const [processesState, setProcessesState] = useState(processes);
  const [inProcess, setInProcess] = useState(false);
  const [tasks, setTasks] = useState([]);

  const [selected, setSelected] = useState([]);
  const [currentSelections, setCurrentSelections] = useState([]);
  const [allSelections, setAllSelections] = useState([]);

  const [bookmarkedTexts, setBookmarkedTexts] = useState([]);
  const [fromBookmark, setFromBookmark] = useState(false);

  const getCurrentCategory = () => {
    if (navigationStack.length === 0) return categoriesState;
    let current = categoriesState;
    for (const item of navigationStack) {
      current = current.choices?.find(choice => choice.text === item);
      if (!current) break;
    }
    return current;
  };

  const resetNav = () => {
    setNavigationStack([]);
    setInProcess(false);
    setTasks([]);
    setSelected([]);
    setCurrentSelections([]);
    setFromBookmark(false);
  };

  const addCategory = (parent, newItem) => {
    if (!parent) return;
    newItem.choices = newItem.choices || [];
    newItem.usageCount = newItem.usageCount || 0;
    parent.choices = parent.choices || [];
    parent.choices.push(newItem);
    setCategoriesState({ ...categoriesState });
  };

  const deleteCategory = (parent, itemText) => {
    if (!parent?.choices) return;
    parent.choices = parent.choices.filter(choice => choice.text !== itemText);
    setCategoriesState({ ...categoriesState });
  };

  const editPhrase = (parent, item) => {
    if (!item) return;

    if (item.id && processesState.some(p => p.id === item.id)) {
      const newProcesses = processesState.map(p => {
        if (p.id !== item.id) return p;
        return {
          ...p,
          // Only overwrite fields that are provided on `item`
          text: item.text ?? p.text,
          speech: item.speech ?? p.speech,
          multiSelect:
            typeof item.multiSelect === 'boolean'
              ? item.multiSelect
              : p.multiSelect,
          diverge: typeof item.diverge === 'boolean' ? item.diverge : p.diverge,
          next: item.next ?? p.next,
          // Replace choices array only if provided (otherwise keep existing)
          choices: item.choices ?? p.choices,
        };
      });
      setProcessesState(newProcesses);
      return;
    }

    if (!parent) {
      // Could be a task option if inProcess
      const currentTask = getCurrentTask();
      if (!currentTask) return;

      const choiceIndex = currentTask.choices.findIndex(c => c === item);
      if (choiceIndex === -1) return;

      // Create updated choice immutably
      const updatedChoice = {
        ...currentTask.choices[choiceIndex],
        text: item.text,
        image:
          currentTask.choices[choiceIndex].image ||
          require('../../assets/phrases/others.png'),
        next: currentTask.choices[choiceIndex].next ?? null,
      };

      // Create new processesState array with updated choice
      const newProcesses = processesState.map(task => {
        if (task.id !== currentTask.id) return task;
        const newChoices = [...task.choices];
        newChoices[choiceIndex] = updatedChoice;
        return { ...task, choices: newChoices };
      });

      setProcessesState(newProcesses);
      console.log(processesState);
    } else if (parent?.choices) {
      // Category phrase
      const catItem = parent.choices.find(c => c === item);
      if (catItem) {
        catItem.text = item.text;
        catItem.image =
          catItem.image || require('../../assets/phrases/others.png');
        setCategoriesState({ ...categoriesState });
      }
    }
  };

  const getCurrentTask = () => {
    return processesState.find(p => p.id === tasks[tasks.length - 1].id);
  };

  // ⬇️ Fix: combine speech + selection in one natural TTS output
  const getSpeechText = () => {
    if (!inProcess) return '';
    const currentTask = getCurrentTask();
    if (!currentTask) return '';

    const base = currentTask.speech ? currentTask.speech.trim() : '';
    if (!selected.length) return base ? base + ' ...' : '...';

    const selections = currentTask.multiSelect
      ? selected.map(s => s.text).join(', ')
      : selected[0].text;

    return base ? `${base} ${selections}` : selections;
  };

  const selectPhrase = item => {
    const currentTask = getCurrentTask();
    if (!currentTask) return;

    // increment usage count
    item.usageCount += 1;

    let updatedSelected;
    if (currentTask.multiSelect) {
      if (!selected.includes(item)) updatedSelected = [...selected, item];
      else updatedSelected = selected.filter(p => p !== item);
    } else {
      updatedSelected = [item];
    }

    setSelected(updatedSelected);

    const currentTaskSpeech = currentTask.speech || '';
    const itemText = currentTask.multiSelect
      ? updatedSelected.map(s => s.text).join(', ')
      : item.text;
    const fullSpeech = currentTaskSpeech
      ? `${currentTaskSpeech} ${itemText}`
      : itemText;
    speak(fullSpeech);

    setProcessesState([...processesState]);
  };

  const navigateToChoice = choice => {
    if (!inProcess && choice?.usageCount !== undefined) {
      choice.usageCount += 1;
      setCategoriesState({ ...categoriesState });
    }

    if (inProcess) {
      const currentTask = getCurrentTask();
      if (!currentTask) return;

      if (selected.length > 0) {
        setCurrentSelections(prev => [
          ...prev,
          { taskId: currentTask.id, choices: [...selected] },
        ]);
      }

      if (currentTask.next === 'end') {
        if (currentSelections.length > 0) {
          const allTaskSelections = [...currentSelections];

          const fullSpeech = allTaskSelections
            .map(ts => {
              const task = processesState.find(p => p.id === ts.taskId);
              if (!task) return '';
              const spoken = task.speech ? task.speech.trim() + ' ' : '';
              const items = ts.choices.map(i => i.text).join(', ');
              return (spoken + items).trim();
            })
            .filter(Boolean)
            .join(', ');

          setAllSelections(prev => [fullSpeech, ...prev].slice(0, 12));
        }

        resetNav();
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
    } else if (choice?.text) setNavigationStack(prev => [...prev, choice.text]);
  };

  const addTask = newItem => {
    if (!newItem) return;
    newItem.id = newItem.id || Date.now().toString();
    newItem.text = newItem.text || 'New Task';
    newItem.speech = newItem.speech || newItem.text;
    newItem.multiSelect = newItem.multiSelect || true;
    newItem.diverge = newItem.diverge || false;
    newItem.choices = newItem.choices || [];
    newItem.next = newItem.diverge ? null : newItem.next || 'end';
    setProcessesState(prev => [...prev, newItem]);
  };

  const addChoiceToTask = (taskId, newItem) => {
    if (!taskId || !newItem) return;
    const task = processesState.find(p => p.id === taskId);
    if (!task) return;

    newItem.text = newItem.text || 'New Choice';
    newItem.image = newItem.image || require('../../assets/phrases/others.png');
    newItem.next = newItem.next ?? null;

    // Immutable update: create new processes array with choice added
    const newProcesses = processesState.map(p => {
      if (p.id !== taskId) return p;
      return { ...p, choices: [...(p.choices || []), newItem] };
    });

    setProcessesState(newProcesses);
  };

  const getAllTaskIds = () => {
    return processesState.map(p => p.id);
  };

  const getCurrent = () =>
    inProcess ? getCurrentTask() : getCurrentCategory();

  // Toggle a bookmark for a phrase text
  const toggleBookmark = text => {
    if (!text) return;
    setBookmarkedTexts(prev =>
      prev.includes(text) ? prev.filter(t => t !== text) : [...prev, text],
    );
  };

  // Recursively collect choices from categoriesState whose text is bookmarked
  const getBookmarkedItems = () => {
    const out = [];
    const seen = new Set();
    const recurse = (items, parentPath = []) => {
      if (!items) return;
      for (const item of items) {
        const path = [...parentPath, item.text];
        if (bookmarkedTexts.includes(item.text) && !seen.has(path.join('>'))) {
          seen.add(path.join('>'));
          out.push({ item, path, kind: 'category' });
        }
        if (item.choices && item.choices.length) recurse(item.choices, path);
      }
    };
    recurse(categoriesState.choices, []);

    // Also check process choices (task-based phrases)
    for (const proc of processesState) {
      for (const choice of proc.choices || []) {
        const key = `proc:${proc.id}>${choice.text}`;
        if (bookmarkedTexts.includes(choice.text) && !seen.has(key)) {
          seen.add(key);
          out.push({ item: choice, processId: proc.id, processText: proc.text, kind: 'process' });
        }
      }
    }
    return out;
  };

  const navigateToPath = pathArray => {
    if (!Array.isArray(pathArray)) return;
    setNavigationStack([...pathArray]);
    setInProcess(false);
    setTasks([]);
    setSelected([]);
    setCurrentSelections([]);
    setFromBookmark(false);
  };

  const navigateToProcessChoice = (processId, choiceText) => {
    const process = processesState.find(p => p.id === processId);
    if (!process) return;

    const choice = (process.choices || []).find(c => c.text === choiceText);

    setNavigationStack([]);
    setTasks([process]);
    setInProcess(true);
    setCurrentSelections([]);
    setSelected(choice ? [choice] : []);
    setFromBookmark(true);
  };

  const goBack = () => {
    if (inProcess) {
      if (tasks.length <= 1) {
        if (fromBookmark) {
          // If we came from a bookmark, go back to categories root
          setFromBookmark(false);
          setInProcess(false);
          setTasks([]);
          setSelected([]);
          setNavigationStack([]);
        } else {
          // Normal back behavior
          setInProcess(false);
          setTasks([]);
          setSelected([]);
        }
      } else {
        setTasks(prev => prev.slice(0, -1));
        setSelected([]);
      }
    } else if (navigationStack.length > 0) {
        setNavigationStack(prev => prev.slice(0, -1));
    }
  };

  const getBreadcrumbs = () => ['Categories', ...navigationStack];

  const deleteGroup = index =>
    setAllSelections(prev => prev.filter((_, i) => i !== index));

  const moveGroupToTop = index =>
    setAllSelections(prev => {
      const newArr = [...prev];
      const [moved] = newArr.splice(index, 1);
      return [moved, ...newArr];
    });

  const value = {
    categoriesState,
    inProcess,
    resetNav,
    bookmarkedTexts,
    addCategory,
    deleteCategory,
    editPhrase,
    getSpeechText,
    selectPhrase,
    navigateToChoice,
    addTask,
    addChoiceToTask,
    getAllTaskIds,
    getCurrent,
    toggleBookmark,
    getBookmarkedItems,
    navigateToPath,
    navigateToProcessChoice,
    goBack,
    canGoBack: navigationStack.length > 0 || inProcess,
    getBreadcrumbs,
    allSelections,
    deleteGroup,
    moveGroupToTop,
  };

  return (
    <PhrasesContext.Provider value={value}>{children}</PhrasesContext.Provider>
  );
};

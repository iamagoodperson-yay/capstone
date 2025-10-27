import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { speak } from '../utils/tts';

import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import categories from './categories';
import processes from './processes';

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

  const { t } = useTranslation();
  const currentLanguage = i18n.language;

  useEffect(() => {
    const translateTasks = processesState.map(task => ({
      ...task,
      translatedSpeech: task.speech
        ? i18n.exists(`screens.phrases.${task.speech}`)
          ? i18n.t(`screens.phrases.${task.speech}`)
          : task.speech
        : '',
      choices: task.choices?.map(c => ({
        ...c,
        text: c.text, // raw text
        transText: i18n.exists(`screens.phrases.${c.text}`)
          ? i18n.t(`screens.phrases.${c.text}`)
          : c.text,
      })),
    }));
    setProcessesState(translateTasks);
  }, [i18n.language]);
  const getTranslatedText = text => {
    if (!text) return '';
    const key = `screens.phrases.${text}`;
    return i18n.exists(key) ? i18n.t(key) : text;
  };

  const translateProcess = process => ({
    ...process,
    choices: process.choices?.map(choice => ({
      ...choice,
      transText: choice.transText,
    })),
  });

  const [processesState, setProcessesState] = useState(
    Array.isArray(processes) ? processes.map(translateProcess) : [],
  );
  const [inProcess, setInProcess] = useState(false);
  const [tasks, setTasks] = useState([]);

  const [selected, setSelected] = useState([]);
  const [currentSelections, setCurrentSelections] = useState([]);
  const [allSelections, setAllSelections] = useState([]);

  const [bookmarkedTexts, setBookmarkedTexts] = useState([]);
  const [fromBookmark, setFromBookmark] = useState(false);

  const [translatedStack, setTranslatedStack] = useState([]);

  const categoriesKey = 'categoriesState';
  const processesKey = 'processesState';
  const bookmarksKey = 'bookmarkedTexts';

  // load categories, processes, bookmarks from async storage
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const storedCategories = await AsyncStorage.getItem(categoriesKey);
//         const storedProcesses = await AsyncStorage.getItem(processesKey);
//         const storedBookmarks = await AsyncStorage.getItem(bookmarksKey);

//         if (storedCategories) {
//           setCategoriesState(JSON.parse(storedCategories));
//         }
//         if (storedProcesses) {
//           setProcessesState(JSON.parse(storedProcesses));
//         }
//         if (storedBookmarks) {
//           setBookmarkedTexts(JSON.parse(storedBookmarks));
//           console.log('Loaded bookmarks:', JSON.parse(storedBookmarks));
//         }
//       } catch (e) {
//         console.warn('Failed to load data from storage', e);
//       }
//     };
//     loadData();
//   }, []);

  // save categories, processes, bookmarks to async storage on change
  useEffect(() => {
    const saveCategories = async () => {
      try {
        const stored = await AsyncStorage.getItem(categoriesKey);
        const current = JSON.stringify(categoriesState);
        // If there's no stored value, or the stored value differs from current, save.
        // This avoids overwriting a previously-loaded stored value with defaults on boot.
        if (stored === null || stored !== current) {
          await AsyncStorage.setItem(categoriesKey, current);
        }
      } catch (e) {
        console.warn('Failed to save categories to storage', e);
      }
    };
    saveCategories();
  }, [categoriesState]);

  useEffect(() => {
    const saveProcesses = async () => {
      try {
        const stored = await AsyncStorage.getItem(processesKey);
        const current = JSON.stringify(processesState);
        if (stored === null || stored !== current) {
          await AsyncStorage.setItem(processesKey, current);
        }
      } catch (e) {
        console.warn('Failed to save processes to storage', e);
      }
    };
    saveProcesses();
  }, [processesState]);

  useEffect(() => {
    const saveBookmarks = async () => {
      try {
        const stored = await AsyncStorage.getItem(bookmarksKey);
        const current = JSON.stringify(bookmarkedTexts);
        // Only save when necessary to avoid writing on initial boot.
        // Keep the existing behavior of not saving empty arrays unless storage differs.
        if (stored === null || stored !== current) {
          // If bookmarkedTexts is empty and there's no stored value, writing an empty array is harmless.
          // If bookmarkedTexts is empty but stored had values, this will persist the cleared state.
          await AsyncStorage.setItem(bookmarksKey, current);
          console.log('Saved bookmarks:', bookmarkedTexts);
        }
      } catch (e) {
        console.warn('Failed to save bookmarks to storage', e);
      }
    };
    saveBookmarks();
  }, [bookmarkedTexts]);

  const getCurrentCategory = () => {
    if (navigationStack.length === 0) return categoriesState;
    let current = categoriesState;
    for (const item of navigationStack) {
      current = current.choices?.find(choice => choice.text === item);
      if (!current) break;
    }
    return current;
  };
  useEffect(() => {
    setTranslatedStack(navigationStack.map(text => text));
  }, [navigationStack, i18n.language]);
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

  const deletePhrase = (parent, itemIdentifier) => {
    // Handle deleting an entire task by ID
    const taskToDelete = processesState.find(p => p.id === itemIdentifier);
    if (taskToDelete) {
      // Update all process references to point to 'end'
      const newProcesses = processesState
        .filter(p => p.id !== itemIdentifier)
        .map(p => ({
          ...p,
          next: p.next === itemIdentifier ? 'end' : p.next,
          choices: p.choices?.map(c => ({
            ...c,
            next: c.next === itemIdentifier ? 'end' : c.next,
          })),
        }));

      // Remove category links to the deleted task
      const removeCategoryLinks = items =>
        items?.map(({ id, ...item }) => ({
          ...(id === itemIdentifier ? item : { id, ...item }),
          choices: removeCategoryLinks(item.choices),
        }));

      setProcessesState(newProcesses);
      setCategoriesState({
        ...categoriesState,
        choices: removeCategoryLinks(categoriesState.choices),
      });
      return;
    }

    // Handle deleting choices from a task
    if (parent?.id) {
      setProcessesState(
        processesState.map(p =>
          p.id === parent.id
            ? {
                ...p,
                choices: p.choices.filter(c => c.text !== itemIdentifier),
              }
            : p,
        ),
      );
      return;
    }

    // Handle deleting category choices
    if (parent?.choices) {
      parent.choices = parent.choices.filter(c => c.text !== itemIdentifier);
      setCategoriesState({ ...categoriesState });
    }
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

    const base =
      t(`screens.phrases.${currentTask.speech}`, {
        defaultValue: currentTask.speech,
      }) || ''; // English speech
    if (!selected.length) return base ? base + ' ...' : '...';

    const selections = currentTask.multiSelect
      ? selected.map(s => s.rawText || s.text).join(', ')
      : selected[0].rawText || selected[0].text;

    return base ? `${base} ${selections}` : selections;
  };
  const selectPhrase = item => {
    const currentTask = getCurrentTask();
    if (!currentTask) return;

    item.usageCount += 1;

    let updatedSelected;
    if (currentTask.multiSelect) {
      if (!selected.includes(item)) updatedSelected = [...selected, item];
      else updatedSelected = selected.filter(p => p !== item);
    } else {
      updatedSelected = [item];
    }
    setSelected(updatedSelected);

    // SPEAK using raw English text
    const base =
      t(`screens.phrases.${currentTask.speech}`, {
        defaultValue: currentTask.speech,
      }) || '';
    const selections = currentTask.multiSelect
      ? updatedSelected.map(s => s.text).join(', ')
      : updatedSelected[0].text;

    speak(base ? `${base} ${selections}` : selections);

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
          out.push({
            item: choice,
            processId: proc.id,
            processText: proc.text,
            kind: 'process',
          });
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
    processesState,
    selected,
    navigationStack,
    inProcess,
    resetNav,
    bookmarkedTexts,
    addCategory,
    deletePhrase,
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

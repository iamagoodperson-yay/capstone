import React, { createContext, useContext, useState } from 'react';
import { speak } from '../utils/tts';

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
        speech: 'Add on',
        multiSelect: true,
        diverge: false,
        next: 'where_eat',
        choices: [
            {
                text: 'Chicken',
                image: require('../../assets/phrases/food.png'),
            },
            { text: 'Rice', image: require('../../assets/phrases/food.png') },
            { text: 'Egg', image: require('../../assets/phrases/food.png') },
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
            { text: 'Prawn', image: require('../../assets/phrases/food.png') },
            {
                text: 'Fish cake',
                image: require('../../assets/phrases/food.png'),
            },
            { text: 'Egg', image: require('../../assets/phrases/food.png') },
        ],
    },
    {
        id: 'where_eat',
        text: 'Place to eat',
        speech: 'Eat',
        multiSelect: false,
        diverge: false,
        next: 'spicy',
        choices: [
            { text: 'Here', image: require('../../assets/phrases/food.png') },
            { text: 'Takeaway', image: require('../../assets/phrases/takeaway.png') },
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
            { text: 'Spicy', image: require('../../assets/phrases/food.png') },
            {
                text: 'Non-Spicy',
                image: require('../../assets/phrases/food.png'),
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
            { text: 'Cash', image: require('../../assets/phrases/cash.png') },
            { text: 'Card', image: require('../../assets/phrases/card.png') },
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
    const [allSelections, setAllSelections] = useState([]); // stores grouped phrase selections

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
        setAllSelections([]);
    }

    const addCategory = (parent, newItem) => {
        if (!parent) return;
        newItem.choices = newItem.choices || [];
        parent.choices = parent.choices || [];
        parent.choices.push(newItem);
        setCategoriesState({ ...categoriesState });
    };

    const deleteCategory = (parent, itemText) => {
        if (!parent?.choices) return;
        parent.choices = parent.choices.filter(choice => choice.text !== itemText);
        setCategoriesState({ ...categoriesState });
    };

    const editCategory = (parent, item, newText) => {
        if (!item) return;

        if (!parent) {
            // Could be a task option if inProcess
            const currentTask = getCurrentTask();
            if (!currentTask) return;
            
            const option = currentTask.choices.find(c => c === item);
            if (option) {
                option.text = newText;
                option.image = option.image || require('../../assets/phrases/others.png');
                setTasks([...tasks]);
            }
        } else if (parent?.choices) {
            // Category phrase
            const catItem = parent.choices.find(c => c === item);
            if (catItem) {
                catItem.text = newText;
                catItem.image = catItem.image || require('../../assets/phrases/others.png');
                setCategoriesState({ ...categoriesState });
            }
        }
    };
    
    const getCurrentTask = () => {
        return processesState.find(p => p.id === tasks[tasks.length - 1].id);
    }
    
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

    // ⬇️ Each time a choice is selected, speak the full sentence immediately
    const selectPhrase = item => {
        const currentTask = getCurrentTask();
        if (!currentTask) return;

        let updatedSelected;
        if (currentTask.multiSelect) {
            if (!selected.includes(item)) updatedSelected = [...selected, item];
            else updatedSelected = selected.filter(p => p !== item);
        } else {
            updatedSelected = [item];
        }

        setSelected(updatedSelected);

        // Speak combined sentence immediately
        const currentTaskSpeech = currentTask.speech || '';
        const itemText = currentTask.multiSelect
            ? updatedSelected.map(s => s.text).join(', ')
            : item.text;
        const fullSpeech = currentTaskSpeech
            ? `${currentTaskSpeech} ${itemText}`
            : itemText;
        speak(fullSpeech);
    };

    const navigateToChoice = choice => {
        if (inProcess) {
            const currentTask = getCurrentTask();
            if (!currentTask) return;

            // Save current selected choices into currentSelections
            if (selected.length > 0) {
                setCurrentSelections(prev => [
                    ...prev,
                    { taskId: currentTask.id, choices: [...selected] },
                ]);
            }

            if (currentTask.next === 'end') {
                if (currentSelections.length > 0 || selected.length > 0) {
                    // Include the final selected for the last task
                    const allTaskSelections = [...currentSelections];
                    if (selected.length > 0) {
                        allTaskSelections.push({
                            taskId: currentTask.id,
                            choices: [...selected],
                        });
                    }

                    // Build full speech combining task.speech + choices
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

                    // Store in history
                    const allItems = allTaskSelections.flatMap(ts => ts.choices);
                    setAllSelections(prev =>
                        [{ fullSpeech, items: allItems }, ...prev].slice(0, 12),
                    );
                }

                // Reset process
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
            // Start process
            setTasks([processesState.find(p => p.id === choice.id)]);
            setInProcess(true);
            setCurrentSelections([]);
        }

        if (choice?.text) setNavigationStack(prev => [...prev, choice.text]);
    };

    const addTask = (newItem) => {
        if (!newItem) return;
        newItem.id = newItem.id || Date.now().toString();
        newItem.text = newItem.text || 'New Task';
        newItem.speech = newItem.speech || newItem.text;
        newItem.multiSelect = newItem.multiSelect || true;
        newItem.diverge = newItem.diverge || false;
        newItem.choices = newItem.choices || [];
        newItem.next = newItem.diverge ? null : newItem.next || 'end';
        setProcessesState(prev => [...prev, newItem]);
    }

    const addChoiceToTask = (taskId, newItem) => {
        if (!taskId || !newItem) return;
        const task = processesState.find(p => p.id === taskId);
        if (!task) return;
        newItem.text = newItem.text || 'New Choice';
        newItem.image = newItem.image || require('../../assets/phrases/others.png');
        newItem.next = newItem.next || null;
        task.choices = task.choices || [];
        task.choices.push(newItem);
        setProcessesState([...processesState]);
    }

    const getCurrent = () =>
        inProcess ? getCurrentTask() : getCurrentCategory();

    const goBack = () => {
        if (inProcess) {
            if (tasks.length <= 1) {
                setNavigationStack(prev => prev.slice(0, -1));
                setInProcess(false);
                setTasks([]);
            } else setTasks(prev => prev.slice(0, -1));
            setSelected([]);
        } else if (navigationStack.length)
            setNavigationStack(prev => prev.slice(0, -1));
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
        addCategory,
        deleteCategory,
        editCategory,
        getSpeechText,
        selectPhrase,
        navigateToChoice,
        addTask,
        addChoiceToTask,
        getCurrent,
        goBack,
        canGoBack: navigationStack.length > 0,
        getBreadcrumbs,
        allSelections,
        deleteGroup,
        moveGroupToTop,
    };

    return (
        <PhrasesContext.Provider value={value}>{children}</PhrasesContext.Provider>
    );
};

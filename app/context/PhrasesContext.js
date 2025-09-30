import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialPhrases = [
    {
        id: "categories",
        text: "Categories",
        choices: [
            { text: "Food", next: "food", size: "normal_button", image: require('../assets/phrases/food.png') },
            { text: "Transport", next: "transport", size: "normal_button", image: require('../assets/phrases/food.png') },
            { text: "Directions", next: "directions", size: "normal_button", image: require('../assets/phrases/food.png') },
            { text: "Things", next: "things", size: "normal_button", image: require('../assets/phrases/food.png') }
        ]
    },
    {
        id: "food",
        text: "Food",
        choices: [
            { text: "Order", next: "order", size: "normal_button", image: require('../assets/phrases/chicken_rice.png') },
            { text: "Describe", next: "describe", size: "normal_button", image: require('../assets/phrases/chicken_rice.png') }
        ],
    },
    {
        id: "order",
        text: "Order",
        choices: [
            { text: "I want to order Chicken Rice", next: "chicken_rice", size: "normal_button", image: require('../assets/phrases/chicken_rice.png') },
            { text: "I want to order fishball noodles", next: "fishball_noodles", size: "normal_button", image: require('../assets/phrases/chicken_rice.png') }
        ],
    },
    {
        id: "chicken_rice",
        text: "I want to order Chicken Rice",
        choices: [
            { text: "I want to order chicken rice", next: "chicken_rice", size: "sound_button", image: require('../assets/phrases/chicken_rice.png') }
        ],
        used: 0
    },
    {
        id: "fishball_noodles",
        text: "I want to order fishball noodles",
        choices: [
            { text: "I want to order fishball noodles", next: "fishball_noodles", size: "sound_button", image: require('../assets/phrases/chicken_rice.png') }
        ],
        used: 0
    }
];

const PhrasesContext = createContext();

export const usePhrasesContext = () => {
    const context = useContext(PhrasesContext);
    if (!context) {
        throw new Error('usePhrasesContext must be used within a PhrasesProvider');
    }
    return context;
};

export const PhrasesProvider = ({ children }) => {
    const [currentId, setCurrentId] = useState("categories");
    const [navigationStack, setNavigationStack] = useState([]);
    const [phrases, setPhrases] = useState([...initialPhrases]);

    // Load saved phrase usage data on mount
    useEffect(() => {
        const loadSavedData = async () => {
            try {
                const stored = await AsyncStorage.getItem('phraseUsedCounts');
                if (stored) {
                    const savedPhrases = JSON.parse(stored);
                    setPhrases(prevPhrases => 
                        prevPhrases.map(phrase => {
                            const savedPhrase = savedPhrases.find(saved => saved.id === phrase.id);
                            return savedPhrase && typeof savedPhrase.used === "number"
                                ? { ...phrase, used: savedPhrase.used }
                                : phrase;
                        })
                    );
                    console.log("Loaded saved phrases data from AsyncStorage");
                }
            } catch (error) {
                console.error("Error loading saved phrases data:", error);
            }
        };
        
        loadSavedData();
    }, []);

    // Save phrases data to AsyncStorage
    const savePhrases = async (updatedPhrases) => {
        try {
            await AsyncStorage.setItem('phraseUsedCounts', JSON.stringify(updatedPhrases));
        } catch (error) {
            console.error("Error saving phrases data:", error);
        }
    };

    const getCurrentNode = () => {
        return phrases.find(node => node.id === currentId);
    };

    const updatePhraseUsage = async (phraseId) => {
        const updatedPhrases = phrases.map(phrase => 
            phrase.id === phraseId 
                ? { ...phrase, used: (phrase.used || 0) + 1 }
                : phrase
        );
        
        setPhrases(updatedPhrases);
        await savePhrases(updatedPhrases);
        
        const updatedPhrase = updatedPhrases.find(p => p.id === phraseId);
        console.log(`Phrase "${phraseId}" used ${updatedPhrase?.used || 0} times`);
    };

    const navigateToChoice = (choice) => {
        if (choice.next) {
            const nextNode = phrases.find(node => node.id === choice.next);
            if (nextNode && nextNode.choices && nextNode.choices.length > 0) {
                // Navigate deeper - has more choices
                setNavigationStack(prev => [...prev, currentId]);
                setCurrentId(choice.next);
            } else {
                // Final phrase - could handle speech/pronunciation here
                console.log("Selected phrase:", choice.text);
            }
        }
    };

    const goBack = () => {
        if (navigationStack.length > 0) {
            const previousId = navigationStack[navigationStack.length - 1];
            setCurrentId(previousId);
            setNavigationStack(prev => prev.slice(0, -1));
        }
    };

    const resetToRoot = () => {
        setCurrentId("categories");
        setNavigationStack([]);
    };

    const value = {
        currentId,
        navigationStack,
        phrases,
        getCurrentNode,
        navigateToChoice,
        goBack,
        resetToRoot,
        updatePhraseUsage,
        canGoBack: navigationStack.length > 0
    };

    return (
        <PhrasesContext.Provider value={value}>
            {children}
        </PhrasesContext.Provider>
    );
};
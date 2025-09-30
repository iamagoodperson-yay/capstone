import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialPhrases = [
    {
        id: "categories",
        text: "Categories",
        choices: [
            { text: "Food", next: "food", size: "normal_button", image: require('../../assets/phrases/food.png') },
            { text: "Directions", next: "directions", size: "normal_button", image: require('../../assets/phrases/food.png') },
            { text: "Social", next: "social", size: "normal_button", image: require('../../assets/phrases/food.png') },
            { text: "Emergency", next: "emergency", size: "normal_button", image: require('../../assets/phrases/food.png') },
            { text: "Others", next: "others", size: "normal_button", image: require('../../assets/phrases/food.png') }
        ]
    },
    {
        id: "food",
        text: "Food",
        choices: [
            { text: "Hawker Centre", next: "hawker_centre", size: "normal_button", image: require('../../assets/phrases/food.png') },
            { text: "Restaurant", next: "restaurant", size: "normal_button", image: require('../../assets/phrases/food.png') }
        ]
    },
    {
        id: "hawker_centre",
        text: "Food > Hawker Centre",
        choices: [
            { text: "Chicken Rice", next: "chicken_rice", size: "normal_button", image: require('../../assets/phrases/food.png') },
            { text: "Fishball Noodles", next: "fishball_noodles", size: "normal_button", image: require('../../assets/phrases/food.png') }
        ]
    },
    {
        id: "chicken_rice",
        text: "Food > Hawker Centre > Chicken Rice",
        choices: [
            { text: "I want to eat Chicken Rice", next: "chicken_rice", size: "sound_button", image: require('../../assets/phrases/food.png') },
            { text: "Payment?", next: "payment", size: "normal_button", image: require('../../assets/phrases/food.png') },
            { text: "Type of Chicken", next: "type_of_chicken", size: "normal_button", image: require('../../assets/phrases/food.png') },
            { text: "Takeaway?", next: "takeaway", size: "normal_button", image: require('../../assets/phrases/food.png') },
            { text: "Add-on?", next: "chicken_rice_addon", size: "normal_button", image: require('../../assets/phrases/food.png') }
        ]
    },
    {
        id: "payment",
        text: "Payment",
        choices: [
            { text: "Pay Cash", next: "payment", size: "sound_button", image: require('../../assets/phrases/food.png') },
            { text: "Tap Card", next: "payment", size: "sound_button", image: require('../../assets/phrases/food.png') }
        ]
    },
    {
        id: "type_of_chicken",
        text: "Type of Chicken",
        choices: [
            { text: "Steamed", next: "type_of_chicken", size: "sound_button", image: require('../../assets/phrases/food.png') },
            { text: "Roasted", next: "type_of_chicken", size: "sound_button", image: require('../../assets/phrases/food.png') },
            { text: "Char Siu", next: "type_of_chicken", size: "sound_button", image: require('../../assets/phrases/food.png') }
            
        ]
    },
    {
        id: "takeaway",
        text: "Takeaway?",
        choices: [
            { text: "Takeaway", next: "takeaway", size: "sound_button", image: require('../../assets/phrases/food.png') },
            { text: "Eat-In", next: "takeaway", size: "sound_button", image: require('../../assets/phrases/food.png') }
            
        ]
    },
    {
        id: "chicken_rice_addon",
        text: "Add-on?",
        choices: [
            { text: "Extra Chicken", next: "chicken_rice_addon", size: "sound_button", image: require('../../assets/phrases/food.png') },
            { text: "Extra Rice", next: "chicken_rice_addon", size: "sound_button", image: require('../../assets/phrases/food.png') },
            { text: "Extra Vegetables", next: "chicken_rice_addon", size: "sound_button", image: require('../../assets/phrases/food.png') },
            { text: "Add Egg", next: "chicken_rice_addon", size: "sound_button", image: require('../../assets/phrases/food.png') }
            
        ]
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
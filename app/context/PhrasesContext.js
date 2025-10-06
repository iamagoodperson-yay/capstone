import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialPhrases = [
    {
        id: 'categories',
        type: 'select',
        text: 'Categories',
        choices: ['food', 'directions', 'social', 'emergency', 'others']
    },
    {
        id: 'food',
        type: 'select',
        text: 'Food',
        image: require('../../assets/phrases/food.png'),
        choices: ['hawker_centre', 'restaurant']
    },
    {
        id: 'hawker_centre',
        type: 'select',
        text: 'Hawker Centre',
        image: require('../../assets/phrases/hawker_centre.png'),
        choices: ['chicken_rice', 'laksa']
    },
    {
        id: 'chicken_rice',
        type: 'phrase',
        text: 'I want to order Chicken Rice',
        image: require('../../assets/phrases/chicken_rice.png'),
        usageCount: 0,
        choices: ['takeway', 'payment']
    },
    {
        id: 'laksa',
        type: 'phrase',
        text: 'I want to order laksa',
        image: require('../../assets/phrases/laksa.png'),
        usageCount: 0,
        choices: ['takeway', 'payment']
    },
    {
        id: 'payment',
        type: 'select',
        text: 'Payment',
        image: require('../../assets/phrases/payment.png'),
        choices: ['card', 'cash']
    },
    {
        id: 'card',
        type: 'phrase',
        text: 'I will pay by card',
        image: require('../../assets/phrases/card.png'),
        usageCount: 0,
        choices: []
    },
    {
        id: 'cash',
        type: 'phrase',
        text: 'I will pay by cash',
        image: require('../../assets/phrases/cash.png'),
        usageCount: 0,
        choices: []
    },
    {
        id: 'takeway',
        type: 'phrase',
        text: 'Takeaway',
        image: require('../../assets/phrases/takeaway.png'),
        usageCount: 0,
        choices: []
    },
    {
        id: 'directions',
        type: 'select',
        text: 'Directions',
        image: require('../../assets/phrases/directions.png'),
        choices: []
    },
    {
        id: 'social',
        type: 'select',
        text: 'Social',
        image: require('../../assets/phrases/social.png'),
        choices: []
    },
    {
        id: 'emergency',
        type: 'select',
        text: 'Emergency',
        image: require('../../assets/phrases/emergency.png'),
        choices: []
    },
    {
        id: 'others',
        type: 'select',
        text: 'Others',
        image: require('../../assets/phrases/others.png'),
        choices: []
    },
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
    const [currentId, setCurrentId] = useState('categories');
    const [navigationStack, setNavigationStack] = useState([]);
    const [phrases, setPhrases] = useState([...initialPhrases]);

    useEffect(() => {
        const loadSavedData = async () => {
            try {
                const stored = await AsyncStorage.getItem('phrases');
                if (stored) {
                    const savedPhrases = JSON.parse(stored);

                    // Rehydrate image URIs into {uri: "..."}
                    const hydrated = savedPhrases.map(p => ({
                        ...p,
                        image: typeof p.image === 'string' ? { uri: p.image } : p.image
                    }));

                    setPhrases(hydrated);
                    console.log('Loaded saved phrases data from AsyncStorage');
                }
            } catch (error) {
                console.error('Error loading saved phrases data:', error);
            }
        };
        
        loadSavedData();
    }, []);

    const savePhrases = async (updatedPhrases) => {
        try {
            const simplified = updatedPhrases.map(p => ({
                ...p,
                image: typeof p.image === 'object' && p.image?.uri
                    ? p.image.uri   // just save string
                    : p.image
            }));
            await AsyncStorage.setItem('phrases', JSON.stringify(simplified));
        } catch (error) {
            console.error('Error saving phrases data:', error);
        }
    };
    const getCurrentNode = () => {
        return phrases.find(node => node.id === currentId);
    };

    const updatePhraseUsage = async (phraseId) => {
        const updatedPhrases = phrases.map(phrase => 
            phrase.id === phraseId 
                ? { ...phrase, usageCount: (phrase.usageCount || 0) + 1 }
                : phrase
        );
        
        setPhrases(updatedPhrases);
        await savePhrases(updatedPhrases);
        
        const updatedPhrase = updatedPhrases.find(p => p.id === phraseId);
        console.log(`Phrase "${phraseId}" used ${updatedPhrase?.usageCount || 0} times`);
    };

    const navigateToChoice = (choiceId) => {
        const nextNode = phrases.find(node => node.id === choiceId);
        if (nextNode) {
            if (nextNode.type === 'select') {
                // Navigate deeper - this is a selection screen
                setNavigationStack(prev => [...prev, currentId]);
                setCurrentId(choiceId);
            } else if (nextNode.type === 'phrase') {
                if (nextNode.choices && nextNode.choices.length > 0) {
                    // Navigate deeper - this phrase has more options
                    setNavigationStack(prev => [...prev, currentId]);
                    setCurrentId(choiceId);
                } else {
                    // This is a final phrase with no further choices
                    console.log('Final phrase reached:', nextNode.text);
                }
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

    const addPhrase = async (newPhrase) => {
        try {
            const id = newPhrase.id || `phrase_${Date.now()}_${Math.random().toString(36)}`;

            const phraseToAdd = {
                id,
                type: newPhrase.type || 'phrase',
                text: newPhrase.text,
                image: newPhrase.image?.uri ? { uri: newPhrase.image.uri } : newPhrase.image || require('../../assets/phrases/food.png'),
                usageCount: 0,
                choices: newPhrase.choices || []
            };

            // Add to phrases array
            let updatedPhrases = [...phrases, phraseToAdd];

            // Add this phrase as a choice to current node if it's a select type
            const currentNode = getCurrentNode();
            if (currentNode && currentNode.type === 'select') {
                const updatedCurrentNode = {
                    ...currentNode,
                    choices: [...currentNode.choices, id]
                };

                updatedPhrases = updatedPhrases.map(p => 
                    p.id === currentNode.id ? updatedCurrentNode : p
                );
            }

            // Save the updated list
            setPhrases(updatedPhrases);
            await savePhrases(updatedPhrases);

            console.log('Added phrase:', phraseToAdd);
            return id;
        } catch (error) {
            console.error('Error adding phrase:', error);
            throw error;
        }
    };
    const deletePhrase = async (phraseId) => {
        try {
            // Don't allow deleting core phrases
            const coreIds = ['categories', 'food', 'directions', 'social', 'emergency', 'others'];
            if (coreIds.includes(phraseId)) {
                throw new Error('Cannot delete core phrases');
            }

            // Remove from phrases array
            const updatedPhrases = phrases.filter(phrase => phrase.id !== phraseId);
            
            // Remove from all choices arrays
            const phrasesWithUpdatedChoices = updatedPhrases.map(phrase => ({
                ...phrase,
                choices: phrase.choices.filter(choice => choice !== phraseId)
            }));
            
            setPhrases(phrasesWithUpdatedChoices);
            await savePhrases(phrasesWithUpdatedChoices);
            
            // If we're currently viewing the deleted phrase, go back
            if (currentId === phraseId) {
                goBack();
            }
            
            console.log('Deleted phrase:', phraseId);
        } catch (error) {
            console.error('Error deleting phrase:', error);
            throw error;
        }
    };

    const navigateToPhrase = (phraseId) => {
        const targetPhrase = phrases.find(node => node.id === phraseId);
        if (targetPhrase) {
            // Build parent map
            const parentMap = new Map();
            phrases.forEach(phrase => {
                if (phrase.choices && phrase.choices.length > 0) {
                    phrase.choices.forEach(childId => {
                        parentMap.set(childId, phrase.id);
                    });
                }
            });
            
            // Build path by traversing up the parent chain
            const buildPathToPhrase = (targetId) => {
                if (targetId === 'categories') return [];
                
                const path = [];
                let currentId = targetId;
                
                // Walk up the parent chain
                while (currentId && currentId !== 'categories') {
                    const parentId = parentMap.get(currentId);
                    if (parentId) {
                        path.unshift(parentId); // Add to front of array
                        currentId = parentId;
                    } else {
                        // No parent found, this is an orphan node
                        break;
                    }
                }
                
                return path;
            };
            
            const path = buildPathToPhrase(phraseId);
            // Clear current navigation and set new path
            setNavigationStack([...path]);
            setCurrentId(phraseId);
            // Update usage count since user selected this phrase
            updatePhraseUsage(phraseId);
        }
    };

    const getBreadcrumbs = () => {
        const breadcrumbs = [];
        
        // Add all items from navigation stack
        navigationStack.forEach(nodeId => {
            const node = phrases.find(p => p.id === nodeId);
            if (node) {
                breadcrumbs.push(node.text);
            }
        });
        
        // Add current node if it's not the root
        if (currentId !== 'categories') {
            const currentNode = phrases.find(p => p.id === currentId);
            if (currentNode) {
                breadcrumbs.push(currentNode.text);
            }
        }
        
        return breadcrumbs;
    };

    const value = {
        currentId,
        navigationStack,
        phrases,
        getCurrentNode,
        navigateToChoice,
        navigateToPhrase,
        goBack,
        updatePhraseUsage,
        getBreadcrumbs,
        addPhrase,
        deletePhrase,
        canGoBack: navigationStack.length > 0,
    };

    return (
        <PhrasesContext.Provider value={value}>
            {children}
        </PhrasesContext.Provider>
    );
};
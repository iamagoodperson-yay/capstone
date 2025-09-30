import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Cell from '../components/cell';
import { usePhrasesContext } from '../context/PhrasesContext';

export let selected = null;

const Phrases = ({ buttonLayout }) => {
    const { 
        getCurrentNode, 
        navigateToChoice, 
        goBack, 
        canGoBack,
        phrases,
        getBreadcrumbs
    } = usePhrasesContext();
    
    const currentNode = getCurrentNode();

    if (!currentNode) {
        return (
            <View style={styles.container}>
                <Text>No choices available</Text>
            </View>
        );
    }

    // Convert choice IDs to choice objects with proper data
    const choiceObjects = currentNode.choices.map(choiceId => {
        const choiceNode = phrases.find(p => p.id === choiceId);
        return {
            id: choiceId,
            text: choiceNode ? choiceNode.text : choiceId,
            image: choiceNode ? choiceNode.image : null,
            type: choiceNode ? choiceNode.type : 'select'
        };
    });

    const handleChoicePress = (choiceObj) => {
        navigateToChoice(choiceObj.id);
    };

    const breadcrumbs = getBreadcrumbs();
    const title = breadcrumbs.length > 1 ? breadcrumbs[1] : currentNode.text;

    return (
        <View style={styles.container}>
            {canGoBack && (
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={goBack}>
                    <Text style={styles.backText}>&lt; Back</Text>
                </TouchableOpacity>
            )}

            <Text style={styles.header}>{title}</Text>

            {breadcrumbs.length > 0 && 
            <Text style={styles.breadcrumbText}>
                {breadcrumbs.join(' > ')}
            </Text>}

            <FlatList style={styles.listView}
                data={choiceObjects}
                renderItem={({ item }) => (
                    <Cell
                        key={item.id}
                        choice={item}
                        buttonlayout={buttonLayout}
                        onPress={() => handleChoicePress(item)}
                    />
                )}
                keyExtractor={item => item.id}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        padding: 20,
        gap: 20,
    },
    header: {
        fontSize: 40,
        fontWeight: '500',
    },
    breadcrumbText: {
        fontSize: 20,
        textAlign: 'center',
    },
    backButton: {
        zIndex: 1,
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: '#d9d9d9',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    backText: {
        fontSize: 24,
    },
    listView: {
        width: '100%',
    }
});

export default Phrases;
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

export default function ChatbotSelector({ selectedChatbot, onSelectChatbot }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[
                    styles.button,
                    selectedChatbot === 'ChatGPT' && styles.selectedButton,
                ]}
                onPress={() => onSelectChatbot('ChatGPT')}
            >
                <Text
                    style={[
                        styles.buttonText,
                        selectedChatbot === 'ChatGPT' && styles.selectedButtonText,
                    ]}
                >
                    ChatGPT
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.button,
                    selectedChatbot === 'PawanChatGPT' && styles.selectedButton,
                ]}
                onPress={() => onSelectChatbot('PawanChatGPT')}
            >
                <Text
                    style={[
                        styles.buttonText,
                        selectedChatbot === 'PawanChatGPT' && styles.selectedButtonText,
                    ]}
                >
                    Pawan GPT
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.button,
                    selectedChatbot === 'ChimeraGPT' && styles.selectedButton,
                ]}
                onPress={() => onSelectChatbot('ChimeraGPT')}
            >
                <Text
                    style={[
                        styles.buttonText,
                        selectedChatbot === 'ChimeraGPT' && styles.selectedButtonText,
                    ]}
                >
                    ChimeraGPT
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    button: {
        flex: 1,
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: '#ccc',
        marginHorizontal: 5,
    },
    selectedButton: {
        backgroundColor: '#222222',
    },
    buttonText: {
        textAlign: 'center',
        color: 'black',
        fontSize: 16,
    },
    selectedButtonText: {
        color: 'white',
    },
});
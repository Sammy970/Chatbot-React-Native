import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'

export default function SpeechSelector({ speechOption, setSpeechOption }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.button, speechOption === 'on' && styles.selectedButton]}
                onPress={() => setSpeechOption('on')}
            >
                <MaterialCommunityIcons
                    name="text-to-speech"
                    style={{ alignSelf: 'center' }}
                    size={40} color={speechOption === 'on' ? 'white' : 'black'}
                />

            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, speechOption === 'off' && styles.selectedButton]}
                onPress={() => setSpeechOption('off')}
            >
                <MaterialCommunityIcons
                    name="text-to-speech-off"
                    style={{ alignSelf: 'center' }}
                    size={40} color={speechOption === 'off' ? 'white' : 'black'}
                />

            </TouchableOpacity>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 60,
    },
    button: {
        flex: 1,
        paddingVertical: 10,
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
})
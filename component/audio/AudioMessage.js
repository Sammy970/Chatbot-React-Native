import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const AudioMessage = ({ currentMessage, onAudioPress }) => {
    return (
        <TouchableOpacity onPress={() => onAudioPress(currentMessage.audio)}>
            <Text>Play Audio BC</Text>
        </TouchableOpacity>
    );
};

export default AudioMessage;

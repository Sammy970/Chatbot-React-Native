import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'

import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';

const data = [
    {
        model: 'ChimeraGPT',
        types: [
            {
                type: '1',
                modes: [
                    { label: 'gpt-3.5-turbo', value: 'gpt-3.5-turbo' },
                    { label: 'gpt-4', value: 'gpt-4' },
                    { label: 'gpt-3.5-turbo-poe', value: 'gpt-3.5-turbo-poe' },
                    { label: 'gpt-4-poe', value: 'gpt-4-poe' },
                    { label: 'sage', value: 'sage' },
                    { label: 'claude-instant', value: 'claude-instant' },
                    { label: 'claude+', value: 'claude+' },
                    { label: 'claude-instant-100k', value: 'claude-instant-100k' }
                ]
            },
            {
                type: '2',
                modes: [
                    { label: 'text-davinci-003', value: 'text-davinci-003' },
                    { label: 'curie', value: 'curie' },
                    { label: 'babbage', value: 'babbage' },
                    { label: 'ada', value: 'ada' },
                ]
            },
            {
                type: '3',
                modes: [
                    { label: 'Kandinsky', value: 'Kandinsky' },
                ]
            }
        ]
    },
    {
        model: 'PawanChatGPT',
        types: [
            {
                type: '1',
                modes: [
                    { label: 'gpt-3.5-turbo', value: 'gpt-3.5-turbo' },
                    { label: 'alpaca-13b', value: 'alpaca-13b' },
                    { label: 'vicuna-13b', value: 'vicuna-13b' },
                    { label: 'koala-13b', value: 'koala-13b' },
                    { label: 'llama-13b', value: 'llama-13b' },
                    { label: 'oasst-pythia-12b', value: 'oasst-pythia-12b' },
                    { label: 'fastchat-t5-3b', value: 'fastchat-t5-3b' },
                ]
            },
            {
                type: '2',
                modes: [
                    { label: 'text-davinci-003', value: 'text-davinci-003' },
                ]
            },
            {
                type: '3',
                modes: [
                    { label: 'DALL-E', value: 'DALL-E' },
                ]
            }
        ]
    },
    {
        model: 'ChatGPT',
        types: [
            {
                type: '1',
                modes: [
                    { label: 'gpt-3.5-turbo', value: 'gpt-3.5-turbo' },
                ]
            },
            {
                type: '2',
                modes: [
                    { label: 'text-davinci-003', value: 'text-davinci-003' },
                ]
            },
            {
                type: '3',
                modes: [
                    { label: 'image-alpha-001', value: 'image-alpha-001' },
                ]
            }
        ]
    },
    // Node: Add more models and types as needed
];



const ModelSelector = ({ selectedChatbot, typeSelected, modelSelected, onModelSelected }) => {

    const filteredData = data.find(item => item.model === selectedChatbot);

    let modes = [];

    if (filteredData) {
        const selectedTypeData = filteredData.types.find(type => type.type === typeSelected);

        if (selectedTypeData) {
            modes = selectedTypeData.modes;
        }
    }

    // console.log(modes);
    // console.log(selectedChatbot + ' ' + typeSelected);

    const [value, setValue] = useState(null);

    const renderItem = item => {
        return (
            <View style={styles.item}>
                <Text style={styles.textItem}>{item.label}</Text>
                {item.value === value && (
                    <AntDesign
                        style={styles.icon}
                        color="black"
                        name="Safety"
                        size={20}
                    />
                )}
            </View>
        );
    };

    return (
        <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            data={modes}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select Model"
            value={modelSelected}
            onChange={item => {
                setValue(item.value);
                onModelSelected(item.value)
            }}
            renderLeftIcon={() => (
                <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
            )}
            renderItem={renderItem}
        />
    )
}

export default ModelSelector

const styles = StyleSheet.create({
    dropdown: {
        margin: 16,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
    },
    icon: {
        marginRight: 5,
    },
    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textItem: {
        flex: 1,
        fontSize: 16,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
})
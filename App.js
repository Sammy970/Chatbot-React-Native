import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

export default function App() {

  const [inputMessage, setInputMessage] = useState('');

  const handleButtonClick = () => {

    const OPENAI_key = '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';

    console.log(inputMessage)

    fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_key}`
      },
      body: JSON.stringify({
        "prompt": inputMessage,
        "model": "text-davinci-003",
      })
    }).then((response) => response.json()).then((data) => {
      console.log(data);
    })

  }

  // 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

  return (
    <View style={styles.container}>

      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text>Results to be shown here!</Text>
      </View>

      <View style={{ flexDirection: 'row' }}>

        <View style={{ flex: 1, marginLeft: 10, marginBottom: 20 }}>
          <TextInput placeholder='Enter your Question' onChangeText={setInputMessage} />
        </View>

        <TouchableOpacity onPress={handleButtonClick}>
          <View style={{ backgroundColor: 'red', padding: 5, marginRight: 10, marginBottom: 20 }}>
            <Text>Send</Text>
          </View>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

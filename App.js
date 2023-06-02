import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

export default function App() {

  const [inputMessage, setInputMessage] = useState('');
  const [outputMessage, setOutputMessage] = useState('Results to be shown here!');

  const handleButtonClick = () => {

    const OPENAI_key = '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';

    console.log(inputMessage)

    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_key}`
      },
      body: JSON.stringify({
        "messages": [{ "role": "user", "content": inputMessage }],
        "model": "gpt-3.5-turbo",
      })
    }).then((response) => response.json()).then((data) => {
      console.log(data.choices[0].message.content);
      setOutputMessage(data.choices[0].message.content.trim());
    })

  }

  // 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

  return (
    <View style={styles.container}>

      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text>{outputMessage}</Text>
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

import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

import { OPENAI_CHAT, OPENAI_IMAGE, PAWAN_CHAT, PAWAN_IMAGE } from './keys.json';

export default function App() {

  const OPENAI_key = OPENAI_CHAT.api_key;
  const pawanOpenAI_key = PAWAN_CHAT.api_key;

  // Chat GPT
  const OPENAI_url = OPENAI_CHAT.api_url;
  const pawanOpenAI_url = PAWAN_CHAT.api_url;

  // Dall E
  const OPENAI_DALLE_URL = OPENAI_IMAGE.api_url;
  const pawanOpenAI_DALLE_URL = PAWAN_IMAGE.api_url;

  const [inputMessage, setInputMessage] = useState('');
  const [outputMessage, setOutputMessage] = useState('Results to be shown here!');

  const handleButtonClick = () => {

    console.log(inputMessage)

    fetch(pawanOpenAI_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${pawanOpenAI_key}`
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

  const generateImages = () => {

    console.log(inputMessage)

    fetch(pawanOpenAI_DALLE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${pawanOpenAI_key}`
      },
      body: JSON.stringify({
        "prompt": inputMessage,
        "n": 1,
        "size": "1024x1024",
      })
    }).then((response) => response.json()).then((data) => {
      console.log(data.data[0].url);
      setOutputMessage(data.data[0].url);
    })

  }

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

import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { GiftedChat } from 'react-native-gifted-chat';
import * as Speech from 'expo-speech';

// Importing Keys
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

  // Local States
  const [inputMessage, setInputMessage] = useState('');
  const [outputMessage, setOutputMessage] = useState('Results to be shown here!');
  const [messages, setMessages] = useState([]);

  const handleButtonClick = () => {
    console.log(inputMessage)
    if (inputMessage.toLocaleLowerCase().startsWith("generate image")) {
      generateImages();
    } else {
      generateText();
    }
  }

  const generateText = () => {

    console.log(inputMessage)

    const message = {
      _id: Math.random().toString(36).substring(7),
      text: inputMessage,
      createdAt: new Date(),
      user: { _id: 1, name: "Sam Jain" },
    }

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, [message])
    )

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
      // console.log(data.choices[0].message.content);
      setInputMessage("");
      setOutputMessage(data.choices[0].message.content.trim());

      const message = {
        _id: Math.random().toString(36).substring(7),
        text: data.choices[0].message.content.trim(),
        createdAt: new Date(),
        user: { _id: 2, name: "Open AI" },
      }

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [message])
      )
      options = {};
      Speech.speak(data.choices[0].message.content.trim(), options);
    })
  }

  const generateImages = () => {

    console.log(inputMessage);

    const message = {
      _id: Math.random().toString(36).substring(7),
      text: inputMessage,
      createdAt: new Date(),
      user: { _id: 1, name: "Sam Jain" },
    }

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, [message])
    )

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
      // console.log(data.data[0].url);
      setInputMessage("");
      setOutputMessage(data.data[0].url);

      const message = {
        _id: Math.random().toString(36).substring(7),
        text: "Image",
        image: data.data[0].url,
        createdAt: new Date(),
        user: { _id: 2, name: "Open AI" },
      }

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [message])
      )

    })
  }

  return (
    <ImageBackground
      source={require('./assets/bg.jpg')}
      resizeMode='cover'
      style={{ flex: 1, width: '100%', height: '100%' }}
    >
      <View style={{ flex: 1 }}>

        <View style={{ flex: 1, justifyContent: 'center' }}>
          <GiftedChat
            messages={messages}
            renderInputToolbar={() => { }}
            user={{ _id: 1 }}
            minInputToolbarHeight={0}
          />
        </View>

        <View style={{ flexDirection: 'row' }}>

          <View style={{
            flex: 1, marginLeft: 10, marginBottom: 20, backgroundColor: 'white', borderRadius: 10, borderColor: 'grey', borderWidth: 1,
            height: 60, marginLeft: 10, marginRight: 10,
            justifyContent: 'center', paddingLeft: 14, paddingRight: 14,
          }}>
            <TextInput placeholder='Enter your Question' onChangeText={setInputMessage} value={inputMessage} />
          </View>

          <TouchableOpacity onPress={handleButtonClick}>
            <View style={{
              backgroundColor: 'green', padding: 5, marginRight: 10, marginBottom: 20,
              borderRadius: 9999, width: 60, height: 60,
              justifyContent: 'center',
            }}>
              <MaterialIcons name="send" size={30} color={'white'} style={{ marginLeft: 10 }} />
            </View>
          </TouchableOpacity>
        </View>

        <StatusBar style="auto" />
      </View >
    </ImageBackground>

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
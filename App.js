import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { GiftedChat } from 'react-native-gifted-chat';
import * as Speech from 'expo-speech';

// Importing Keys
import { OPENAI_CHAT, OPENAI_IMAGE, PAWAN_CHAT, PAWAN_IMAGE } from './keys.json';

// Importing Components
import ChatbotSelector from './component/ChatbotSelector';

export default function App() {

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

  const [apiKey, setApiKey] = useState('');
  const [apiKeyEntered, setApiKeyEntered] = useState(false);

  const [selectedChatbot, setSelectedChatbot] = useState('BARD');


  const handleButtonClick = () => {

    if (!apiKey) {
      alert("Enter API Key");
      return;
    }

    console.log(inputMessage)

    if (inputMessage.toLocaleLowerCase().startsWith("generate image")) {
      generateImages();
    } else if (inputMessage.toLocaleLowerCase().startsWith("get info")) {
      getCreditInfo();
    } else {
      generateText();
    }
  }

  const generateText = () => {

    // console.log(inputMessage)

    const message = {
      _id: Math.random().toString(36).substring(7),
      text: inputMessage,
      createdAt: new Date(),
      user: { _id: 1, name: "Sam Jain" },
    }

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, [message])
    )

    let selected_url = '';
    selectedChatbot === 'ChatGPT' ? (selected_url = OPENAI_url) : (selected_url = pawanOpenAI_url)

    fetch(selected_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        "messages": [{ "role": "user", "content": inputMessage }],
        "model": "gpt-3.5-turbo",
      })
    })
      .then((response) => response.json())
      .then((data) => {
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
      .catch((error) => {
        console.log(error);
        alert("Please insert correct API Key");
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

    let selected_url = '';
    selectedChatbot === 'ChatGPT' ? (selected_url = OPENAI_DALLE_URL) : (selected_url = pawanOpenAI_DALLE_URL)

    fetch(selected_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        "prompt": inputMessage,
        "n": 1,
        "size": "1024x1024",
      })
    })
      .then((response) => response.json())
      .then((data) => {
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
      .catch((error) => {
        console.log(error);
        alert("Please insert correct API Key");
      })
  }

  const getCreditInfo = () => {

    const message = {
      _id: Math.random().toString(36).substring(7),
      text: inputMessage,
      createdAt: new Date(),
      user: { _id: 1, name: "Sam Jain" },
    }

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, [message])
    )

    let selected_url = '';
    selectedChatbot === 'ChatGPT' ? (selected_url = "not supported") : (selected_url = 'https://api.pawan.krd/info')

    fetch(selected_url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    }).then((response) => response.json()).then((data) => {
      // console.log(data);

      if (data.error) {
        alert("Invalid API Key")
      }
      else {
        const message = {
          _id: Math.random().toString(36).substring(7),
          text: `Name: ${data.info.name} \n\nRemaining Credits: ${data.info.credit}`,
          createdAt: new Date(),
          user: { _id: 3, name: "Pawan Osman API" },
        }

        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [message])
        )
      }
    })
      .catch((error) => {
        console.log(error);
        alert("This command is specific for P ChatGPT");
      })
  }

  return (
    <ImageBackground
      source={require('./assets/bg.jpg')}
      resizeMode='cover'
      style={{ flex: 1, width: '100%', height: '100%' }}
    >
      <View style={{ flex: 1 }}>
        {!apiKeyEntered ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

            <View style={{ marginBottom: 10 }}>

              <MaterialCommunityIcons name="api" size={60} color="black" />
              <TextInput
                placeholder="Enter API Key"
                onChangeText={setApiKey}
                value={apiKey}
                multiline={true}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 10,
                  borderColor: 'grey',
                  borderWidth: 1,
                  padding: 10,
                  width: 350,
                  marginBottom: 30,
                }}
              />

              <Ionicons name="options-outline" size={60} color="black" />
              <View style={{ marginLeft: -20, marginRight: -20 }}>
                <ChatbotSelector selectedChatbot={selectedChatbot} onSelectChatbot={setSelectedChatbot} />
              </View>

            </View>
            <TouchableOpacity
              onPress={() => {
                if (apiKey === '') {
                  alert('Please enter the API key.');
                } else {
                  setApiKeyEntered(true);
                }
              }}
            >
              <View style={{marginTop: 40, backgroundColor: 'green', padding: 15, borderRadius: 13 }}>
                <Text style={{ color: 'white', fontSize: 19 }}>Submit</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <>
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
                <TextInput
                  placeholder='Enter your Question'
                  onChangeText={setInputMessage}
                  value={inputMessage}
                  multiline={true}
                />
              </View>

              <TouchableOpacity onPress={handleButtonClick}>
                <View style={{
                  backgroundColor: 'green', padding: 5, marginRight: 10, marginBottom: 20,
                  borderRadius: 9999, width: 60, height: 60,
                  justifyContent: 'center', borderColor: 'black', borderWidth: 2,
                }}>
                  <MaterialIcons name="send" size={30} color={'white'} style={{ marginLeft: 10 }} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {
                setApiKeyEntered(!apiKeyEntered);
              }}>
                <View
                  style={{
                    backgroundColor: '#ffffff', padding: 10,
                    borderRadius: 9999, width: 60, height: 60, marginRight: 10,
                    justifyContent: 'center', borderColor: 'black', borderWidth: 2,
                  }}
                >
                  <MaterialIcons name="settings" size={30} color="black" style={{ alignSelf: 'center' }} />
                </View>
              </TouchableOpacity>
            </View>
          </>
        )}
        <StatusBar style="auto" />
      </View>
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
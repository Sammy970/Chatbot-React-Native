import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Image, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import { GiftedChat } from 'react-native-gifted-chat';
import * as Speech from 'expo-speech';

// Importing Components
import ChatbotSelector from './component/ChatbotSelector';
import SpeechSelector from './component/SpeechSelector';

const renderAvatar = (props) => {
  return (
    <Image
      source={require('./assets/icon2.png')}
      style={{ width: 40, height: 40, borderRadius: 20 }}
    />
  );
};

export default function App() {

  // Chat GPT
  const OPENAI_url = 'https://api.openai.com/v1/chat/completions';
  const pawanOpenAI_url = 'https://api.pawan.krd/v1/chat/completions';

  // Dall E
  const OPENAI_DALLE_URL = 'https://api.openai.com/v1/images/generations';
  const pawanOpenAI_DALLE_URL = 'https://api.pawan.krd/v1/images/generations';

  // Local States
  const [inputMessage, setInputMessage] = useState('');
  const [outputMessage, setOutputMessage] = useState('Results to be shown here!');
  const [messages, setMessages] = useState([]);

  const [apiKey, setApiKey] = useState('');
  const [apiKeyEntered, setApiKeyEntered] = useState(false);

  const [selectedChatbot, setSelectedChatbot] = useState('BARD');
  const [loading, setLoading] = useState(false);
  const [speechOption, setSpeechOption] = useState('off');

  const [emptyInput, setEmptyInput] = useState(true);

  const handleButtonClick = () => {

    if (!apiKey) {
      alert("Enter API Key");
      return;
    }

    setLoading(true);

    // console.log(inputMessage)

    if (inputMessage.toLocaleLowerCase().startsWith("generate image")) {
      generateImages();
    } else if (inputMessage.toLocaleLowerCase().startsWith("get info")) {
      getCreditInfo();
    } else if (inputMessage.toLocaleLowerCase().startsWith('help command')) {
      commandsHelp();
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
        setEmptyInput(true);
        setOutputMessage(data.choices[0].message.content.trim());

        const message = {
          _id: Math.random().toString(36).substring(7),
          text: data.choices[0].message.content.trim(),
          createdAt: new Date(),
          user: { _id: 2, name: "Open AI" },
        }

        setLoading(false);

        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [message])
        )
        options = {};
        speechOption === 'on' && (Speech.speak(data.choices[0].message.content.trim(), options))

      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
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
        setEmptyInput(true);
        setOutputMessage(data.data[0].url);

        const message = {
          _id: Math.random().toString(36).substring(7),
          text: `URL: ${data.data[0].url}`,
          image: data.data[0].url,
          createdAt: new Date(),
          user: { _id: 2, name: "Open AI" },
        }

        setLoading(false);

        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [message])
        )
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
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
        setLoading(false);
        alert("Invalid API Key")
      }
      else {
        const message = {
          _id: Math.random().toString(36).substring(7),
          text: `Name: ${data.info.name} \n\nRemaining Credits: ${data.info.credit}`,
          createdAt: new Date(),
          user: { _id: 3, name: "Pawan Osman API" },
        }

        setLoading(false);

        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [message])
        )
      }
    })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        alert("This command is specific for P ChatGPT");
      })
  }

  const commandsHelp = () => {

    const message = {
      _id: Math.random().toString(36).substring(7),
      text: inputMessage,
      createdAt: new Date(),
      user: { _id: 1, name: "Sam Jain" },
    }

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, [message])
    )

    let helpMessage = '------------Commands----------- \n\nFor P ChatGPT: \n\n -- "Get info" : Provides info about the credits remaining. \n ---------------------------------------------- \n\nFor all: \n\n -- "Generate image ...." : Generates images that you want \n -- "help command" : To get list of commands. \n\n ----------------------------------------------';

    const messageResponse = {
      _id: Math.random().toString(36).substring(7),
      text: helpMessage,
      createdAt: new Date(),
      user: { _id: 2 },
    }

    setLoading(false);
    setInputMessage("");

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, [messageResponse])
    )
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

              <Text style={{ marginBottom: 5, textAlign: 'center', fontSize: 20, backgroundColor: '#222222', color: 'white' }}>
                <Text style={{ fontWeight: 'bold', }}> Tip: </Text>
                <Text>Try using </Text>
                <Text style={{ fontWeight: 'bold', }}>
                  "help command"
                </Text>
              </Text>

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

              <View style={{ marginBottom: 45 }}>
                <Ionicons name="options-outline" size={60} color="black" />
                <View style={{ marginLeft: -20, marginRight: -20 }}>
                  <ChatbotSelector selectedChatbot={selectedChatbot} onSelectChatbot={setSelectedChatbot} />
                </View>
              </View>

              <SimpleLineIcons name="speech" size={50} style={{ marginLeft: 8, marginBottom: 6 }} color="black" />
              <SpeechSelector speechOption={speechOption} setSpeechOption={setSpeechOption} />

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
              <View style={{ marginTop: 40, backgroundColor: 'green', padding: 15, borderRadius: 13 }}>
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
                renderAvatar={renderAvatar}
              />
            </View>

            {loading && (
              <View style={{ justifyContent: 'center', marginBottom: 20 }}>
                <ActivityIndicator size="large" color="#222222" />
              </View>
            )}

            <View style={{ flexDirection: 'row' }}>

              <View style={{
                flex: 1, marginLeft: 10, marginBottom: 20, backgroundColor: 'white', borderRadius: 10, borderColor: 'grey', borderWidth: 1,
                height: 60, marginLeft: 10, marginRight: 10,
                justifyContent: 'center', paddingLeft: 14, paddingRight: 14,
              }}>
                <TextInput
                  placeholder='Enter your Question'
                  onChangeText={(text) => {
                    setInputMessage(text);
                    setEmptyInput(text.trim() === '');
                  }}
                  value={inputMessage}
                  multiline={true}
                />
              </View>

              <TouchableOpacity
                onPress={handleButtonClick}
                disabled={emptyInput}
              >
                <View style={{
                  backgroundColor: 'green', padding: 5, marginRight: 10, marginBottom: 20,
                  borderRadius: 9999, width: 60, height: 60,
                  justifyContent: 'center', borderColor: 'black', borderWidth: 2,
                }}
                >
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
    </ImageBackground >
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
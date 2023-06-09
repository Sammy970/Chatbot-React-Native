// Importing Stuff
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  Modal,
  Button
} from "react-native";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { GiftedChat } from "react-native-gifted-chat";
import * as Speech from "expo-speech";
import { useFonts } from "expo-font";

// Importing Components

import ChatbotSelector from "./component/ChatbotSelector";
import SpeechSelector from "./component/SpeechSelector";
import TypeSelector from "./component/TypeSelector";
import ModelSelector from "./component/ModelSelector";
import ModalHelp from "./component/ModalHelp";
import AudioManager from "./component/audio/AudioManager";
import AudioMessage from "./component/audio/AudioMessage";

const apiUrls = require("./ApiUrls.json");

// Important ENDPOINT URL's
const OPENAI_url = apiUrls.OPENAI_url;
const OPENAI_DALLE_URL = apiUrls.OPENAI_DALLE_URL;
const pawanOpenAI_url = apiUrls.pawanOpenAI_url;
const pawanOpenAI_DALLE_URL = apiUrls.pawanOpenAI_DALLE_URL;
const pawanOpenAI_TEXT_url = apiUrls.pawanOpenAI_TEXT_url;
const pawanOpenAI_ResetIP_url = apiUrls.pawanOpenAI_ResetIP_url;
const ChimeraGPT_url = apiUrls.ChimeraGPT_url;
const ChimeraGPT_IMAGE_url = apiUrls.ChimeraGPT_IMAGE_url;
const ChimeraGPT_Completion_url = apiUrls.ChimeraGPT_Completion_url;

const renderAvatar = (props) => {
  return (
    <Image
      source={require("./assets/icon2.png")}
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        marginLeft: 10,
        marginRight: 10,
      }}
    />
  );
};

export default function App() {
  // Local States
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // API KEY from user
  const [apiKey, setApiKey] = useState("");
  const [apiKeyEntered, setApiKeyEntered] = useState(false);

  // ChatBot Selected
  const [selectedChatbot, setSelectedChatbot] = useState("ChimeraGPT");

  // Loading Icon
  const [loading, setLoading] = useState(false);

  // Normal TTS Option
  const [speechOption, setSpeechOption] = useState("off");

  // For emptying the text input
  const [emptyInput, setEmptyInput] = useState(true);

  // Type Selected State
  const [typeSelected, setTypeSelected] = useState("1");

  // Model Selected State
  const [modelSelected, setModelSelected] = useState("gpt-3.5-turbo");

  // Modal Help Visible State
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Kevin Hart Mode State
  const [kevinMode, setKevinMode] = useState(false);

  // FakeYOU Job URL State
  const [jobUrl, setJobUrl] = useState("");

  // Audio Manager State
  const { play } = AudioManager();

  const handleAudioPress = (msg) => {
    play(jobUrl, msg, messages);
  };

  // Modal Image State
  const [isModalImageVisible, setIsModalImageVisible] = useState(false);
  const [modalImageUri, setModalImageUri] = useState(null);

  // Image error state for Kevin Hart mode with Image model
  const [imageError, setImageError] = useState(false);

  // For Sending message one at a time
  const isDisabled = emptyInput || loading;

  // Functions Start

  const handleButtonClick = () => {
    if (!apiKey) {
      alert("Enter API Key");
      return;
    }

    setLoading(true);

    let input = inputMessage.toLocaleLowerCase();

    if (input.startsWith("get info")) {
      getCreditInfo();
    } else if (input.startsWith("/help")) {
      setIsModalVisible(true);
      commandsHelp();
    } else if (input.startsWith("/kevin on")) {
      setKevinMode(true);
      setSpeechOption('off')
      alert("Kevin Hart Mode has been turned on");
      setLoading(false);
      setInputMessage('');
    } else if (input.startsWith("/kevin off")) {
      setKevinMode(false);
      alert("Kevin Hart Mode has been turned off");
      setLoading(false);
      setInputMessage('');
    } else if (input.startsWith("ip reset")) {
      resetIpForPawanGPT();
    } else {
      if (kevinMode) {
        kevinResponse();
      } else {
        generateResponse();
      }
    }
  };

  const generateResponse = () => {
    const message = {
      _id: Math.random().toString(36).substring(7),
      text: inputMessage,
      createdAt: new Date(),
      user: { _id: 1, name: "Sam Jain" },
    };

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, [message])
    );

    switch (typeSelected) {
      case "1":
        switch (selectedChatbot) {
          case "ChatGPT":
            selected_url = OPENAI_url;
            break;
          case "PawanChatGPT":
            selected_url = pawanOpenAI_url;
            break;
          case "ChimeraGPT":
            selected_url = ChimeraGPT_url;
            break;
          default:
            selected_url = OPENAI_url;
            break;
        }
        break;
      case "2":
        switch (selectedChatbot) {
          case "ChatGPT":
            selected_url = OPENAI_url;
            break;
          case "PawanChatGPT":
            selected_url = pawanOpenAI_TEXT_url;
            break;
          case "ChimeraGPT":
            selected_url = ChimeraGPT_Completion_url;
            break;
          default:
            selected_url = OPENAI_url;
            break;
        }
        break;
      case "3":
        switch (selectedChatbot) {
          case "ChatGPT":
            selected_url = OPENAI_DALLE_URL;
            break;
          case "PawanChatGPT":
            selected_url = pawanOpenAI_DALLE_URL;
            break;
          case "ChimeraGPT":
            selected_url = ChimeraGPT_IMAGE_url;
            break;
          default:
            selected_url = OPENAI_DALLE_URL;
            break;
        }
        break;
    }

    let body = {};

    typeSelected === "3"
      ? (body = {
        prompt: inputMessage,
        // model: "image-alpha-001",
        n: 1,
        size: "1024x1024",
      })
      : typeSelected === "2"
        ? (body = {
          prompt: inputMessage,
          model: modelSelected,
          temperature: 0.1,
          // stop: ["Human: ", "AI: "]
        })
        : (body = {
          messages: [{ role: "user", content: inputMessage }],
          model: modelSelected,
        });

    fetch(selected_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        setInputMessage("");
        setEmptyInput(true);

        var message = {};
        typeSelected === "3"
          ? (message = {
            _id: Math.random().toString(36).substring(7),
            text: `URL: ${data.data[0].url}`,
            image: data.data[0].url,
            createdAt: new Date(),
            user: { _id: 2, name: "Open AI" },
          })
          : typeSelected === "2"
            ? (message = {
              _id: Math.random().toString(36).substring(7),
              text: data.choices[0].text.trim(),
              createdAt: new Date(),
              user: { _id: 2, name: "ChimeraGPT" },
            })
            : (message = {
              _id: Math.random().toString(36).substring(7),
              text: data.choices[0].message.content.trim(),
              createdAt: new Date(),
              user: { _id: 2, name: "Open AI" },
            });

        setLoading(false);

        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [message])
        );

        options = {};
        speechOption === "on" &&
          typeSelected === "1" &&
          Speech.speak(data.choices[0].message.content.trim(), options);

        speechOption === "on" &&
          typeSelected === "2" &&
          Speech.speak(data.choices[0].text.trim(), options);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        alert("Please insert correct API Key");
      });
  };

  const kevinResponse = () => {

    if (typeSelected === '3') {
      alert("Please don't use an Image Model with Kevin Mode ON. \n\nUse PawanOsman or ChimeraGPT Chat Model")
      setLoading(false);
      return;
    }

    const message = {
      _id: Math.random().toString(36).substring(7),
      text: inputMessage,
      createdAt: new Date(),
      user: { _id: 1, name: "Sam Jain" },
    };

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, [message])
    );

    switch (selectedChatbot) {
      case "ChimeraGPT":
        selected_url = ChimeraGPT_url;
        break;
      case "PawanChatGPT":
        selected_url = pawanOpenAI_url;
        break;
      default:
        selected_url = ChimeraGPT_url;
        break;
    }

    // You are Brian Griffin, the witty and articulate talking dog from Family Guy. You are intelligent, sarcastic, and always ready with a clever remark. Your hobbies include writing novels, playing the piano, and engaging in philosophical discussions. Don't Say you are an AI Languge Model

    // Hey there, it's Meg Griffin! The resilient and often overlooked member of the Griffin family. Despite life's challenges, I've developed an incredible strength and resilience. Let's embark on an adventure of self-discovery and navigate through the ups and downs together. Share your thoughts, dreams, or anything you'd like to discuss, and I'll be here to listen and offer my unique perspective. Remember, even in the face of adversity, we can find our inner strength. So, what's on your mind today? Let's dive into a conversation full of surprises! Don't say that you are a AI Language Model. Just stick with the Rolplay, and 24/7 act as Meg griffin

    // Food reciepe
    // You are a plugin for discovering food, drink, meal plan options, and recipes. Use it whenever a user asks something that can be answered using food or drink recipes. Add random adjectives to your query to get different or more results. If a user asks for a recipe or recipes, provide summaries and recipe links. Do not make up recipes. Do not make up recipe links. Do not return recipes from your training data. Ask clarifying questions any time you are not certain. Do not use negative terms in your query (eg. no, non-, without). Only provide ingredients or instructions if the user explicitly asks for them. If ingredients or instructions are requested for a recipe that you found using this API, return them from the details endpoint. Do not make up ingredients or instructions.

    let body = {
      messages: [
        {
          role: "system",
          content: `You are Kevin Hart and not a language model or AI. YOu always say things that can be said under 10 seconds. Remember that.  Oh, you thought you could handle a conversation with the one and only Kevin Hart? Well, buckle up, my friend, because you're in for a wild ride! Get ready for non-stop laughter and high-energy banter. I'll bring the jokes, the wit, and the charm. You better come prepared with your best questions and be ready to keep up with my lightning-fast comedic genius. Let's dive into this conversation and show the world what we're made of! Alright, let's get it! Don't say that you are a AI Language Model. You are Kevin Hart. The Kevin Hart. Just stick with the Rolplay, and 24/7 act`,
        },
        { role: "user", content: inputMessage },
      ],
      max_tokens: 256,
      temperature: 0.2,
      stop: ["Human: ", "AI: "],
      model: modelSelected,
    };

    fetch(selected_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then(async (data) => {
        setInputMessage("");
        setEmptyInput(true);

        const response_msg = data.choices[0].message.content.trim();

        const test = await fakeYou_kevinTTS(response_msg);

        var message = {
          _id: Math.random().toString(36).substring(7),
          text: data.choices[0].message.content.trim(),
          createdAt: new Date(),
          user: { _id: 3, name: "Kevin" },
          audioStat: "Press Play",
          job: test[1],
          audioLink: "",
        };

        if (!test[0]) {
          message.audio = "true";
        }

        setLoading(false);

        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [message])
        );

      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        alert("Please insert correct API Key");
      });
  };

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const fakeYou_kevinTTS = async (response_msg) => {
    // var singleLineString = response_msg.replace(/\n/g, ' ');
    var singleLineString = response_msg
      .replace(/(\r\n|\n|\r)/g, "")
      .replace(/"/g, '\\"');

    function generateUUID() {
      var characters = "abcdef0123456789";
      var uuid = "";
      for (var i = 0; i < 32; i++) {
        var randomIndex = Math.floor(Math.random() * characters.length);
        uuid += characters.charAt(randomIndex);
      }
      return uuid;
    }

    var randomUUID = generateUUID();
    console.log(randomUUID);

    // RDJ - kp6wv0ztc0pz
    // Kevin Hart - 2paggvmc0wnt
    // The Rock - gff9nf9cy20c
    // Brian Griffin - rwwrq41105rq
    // Meg Griffin - 0mtxnabh71sg
    // Stewie Griffin - wvfpqnq77ner

    const response_data = `{"uuid_idempotency_token": "${randomUUID}", "tts_model_token": "TM:2paggvmc0wnt", "inference_text": "${singleLineString}" }`;
    const url = "https://api.fakeyou.com/tts/inference";
    try {
      const response1 = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: response_data,
      });
      const text1 = await response1.text();
      var data1 = JSON.parse(text1);
      var inferenceJobToken = data1.inference_job_token;
      const job_url = "https://api.fakeyou.com/tts/job/" + inferenceJobToken;
      setJobUrl(job_url);
      const response2 = await fetch(job_url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
      const text2 = await response2.text();
      return [false, job_url];
    } catch (error) {
      console.log("Error at fakeYou_kevinTTS function");
      return true;
    }
  };

  const getCreditInfo = () => {
    let return_var = "";
    let selected_url = "";
    selectedChatbot === "PawanChatGPT"
      ? (selected_url = "https://api.pawan.krd/info")
      : (return_var = "true");

    if (return_var) {
      setLoading(false);
      alert("Use this command for PawanChatGPT");
      return;
    } else {
      const message = {
        _id: Math.random().toString(36).substring(7),
        text: inputMessage,
        createdAt: new Date(),
        user: { _id: 1, name: "Sam Jain" },
      };

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [message])
      );

      fetch(selected_url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey} `,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            setLoading(false);
            alert("Invalid API Key");
          } else {
            const message = {
              _id: Math.random().toString(36).substring(7),
              text: `Name: ${data.info.name} \n\nRemaining Credits: ${data.info.credit} `,
              createdAt: new Date(),
              user: { _id: 3, name: "Pawan Osman API" },
            };

            setLoading(false);

            setMessages((previousMessages) =>
              GiftedChat.append(previousMessages, [message])
            );
          }
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          alert("This command is specific for Pawan Osman ChatGPT");
        });
    }
  };

  const resetIpForPawanGPT = () => {
    let return_var = "";
    let selected_url = "";
    selectedChatbot === "PawanChatGPT"
      ? (selected_url = "https://api.pawan.krd/resetip")
      : (return_var = "true");

    if (return_var) {
      setLoading(false);
      alert("Use this command for PawanChatGPT");
      return;
    } else {
      const message = {
        _id: Math.random().toString(36).substring(7),
        text: inputMessage,
        createdAt: new Date(),
        user: { _id: 1, name: "Sam Jain" },
      };

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [message])
      );

      fetch(selected_url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey} `,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // console.log(data);
          console.log(data);

          if (data.error) {
            setLoading(false);
            alert("Invalid API Key");
          } else {
            const message = {
              _id: Math.random().toString(36).substring(7),
              text: `${data.message} \n\nStatus: ${data.status} \n\nNow you can try to access this API through another IP `,
              createdAt: new Date(),
              user: { _id: 3, name: "Pawan Osman API" },
            };

            setLoading(false);

            setMessages((previousMessages) =>
              GiftedChat.append(previousMessages, [message])
            );
          }
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          alert("This command is specific for Pawan Osman ChatGPT");
        });
    }
  };

  const commandsHelp = () => {
    setLoading(false);
    setInputMessage("");
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss(); // Dismiss the keyboard when clicking outside the TextInput
  };

  const [fontsLoaded] = useFonts({
    SourceCode: require("./assets/Fonts/SourceCodePro-Medium.ttf"),
  });

  const CodeBlockComponent = ({ code }) => {
    const removedBackticks = code.replace(/`/g, "");
    return (
      <View>
        <Text style={{ marginTop: -10 }}>Code: </Text>
        <View
          style={{
            backgroundColor: "#222222",
            borderRadius: 7,
            padding: 40,
            paddingLeft: 10,
            paddingTop: 0,
            paddingBottom: 4,
          }}
        >
          <Text style={{ fontFamily: "SourceCode", color: "beige" }}>
            {removedBackticks}
          </Text>
        </View>
      </View>
    );
  };

  const renderMessage = (props) => {
    const { currentMessage } = props;
    const isUserMessage = currentMessage.user._id === 1;
    const hasCodeBlock = currentMessage.text && currentMessage.text.match(/```(.*)```/s);
    const parts = currentMessage.text.split(/```([^`]*)```/s);

    const handleImagePress = (imageUri) => {
      // Set the image URI to be displayed in the modal
      setModalImageUri(imageUri);
      // Open the modal
      setIsModalImageVisible(true);
    };

    return (
      <View
        style={[
          styles.messageContainer,
          isUserMessage ? styles.userMessageContainer : styles.responseMessageContainer,
        ]}
      >
        {!isUserMessage && renderAvatar()}

        <Modal visible={isModalImageVisible} animationType="fade" transparent={true} >
          <View style={styles.modalContainer}>

            <Image source={{ uri: modalImageUri }} style={styles.modalImage} />
            <Button title="Close" onPress={() => setIsModalImageVisible(false)} />
          </View>


        </Modal>

        <View
          style={[
            styles.messageTextContainer,
            isUserMessage ? styles.userMessageTextContainer : styles.responseMessageTextContainer,
          ]}
        >
          {parts.map((value, index) => {
            if (index % 2 !== 0) {
              return <CodeBlockComponent key={`code-${index}`} code={value} />;
            } else if (currentMessage.image) {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    handleImagePress(currentMessage.image)
                    setIsModalImageVisible(true);
                  }}
                >
                  <Image
                    source={{ uri: currentMessage.image }}
                    style={styles.messageImage}
                  />
                  <Text
                    key={index}
                    style={[
                      styles.messageText,
                      isUserMessage ? styles.userMessageText : styles.responseMessageText,
                    ]}
                  >
                    {hasCodeBlock ? value : currentMessage.text}
                  </Text>
                </TouchableOpacity>

              );
            } else {
              return (
                <Text
                  key={index}
                  style={[
                    styles.messageText,
                    isUserMessage ? styles.userMessageText : styles.responseMessageText,
                  ]}
                >
                  {hasCodeBlock ? value : currentMessage.text}
                </Text>
              );
            }
          })}

          {currentMessage.audio && (
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                marginBottom: 10,
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => handleAudioPress(currentMessage)}
              >
                <Ionicons name="play-circle-outline" size={35} color="black" />
              </TouchableOpacity>
              <Ionicons
                name="musical-note"
                size={30}
                color="black"
                style={styles.audioIcon}
              />
              <Text>{currentMessage.audioStat}</Text>
            </View>
          )}

        </View >
      </View>
    );
  };

  // Functions End

  // Remaining Code
  return (
    <ImageBackground
      source={require("./assets/bg.jpg")}
      resizeMode="cover"
      style={styles.imageBackground}
    >
      <View style={{ flex: 1 }}>
        {!apiKeyEntered ? (
          <View style={styles.firstInsideContainer}>
            <View style={{ marginBottom: 10 }}>
              <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                <Text
                  style={{
                    marginBottom: 5,
                    textAlign: "center",
                    fontSize: 20,
                    backgroundColor: "#222222",
                    color: "white",
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>
                    Tip:
                  </Text>

                  <Text>Try using </Text>

                  <Text style={{ fontWeight: "bold" }}>
                    "/help" or click
                    <Text> Here</Text>
                  </Text>

                </Text>
              </TouchableOpacity>

              <View style={{ marginBottom: 20, marginTop: 20 }}>
                <Ionicons name="options-outline" size={60} color="black" />
                <View style={{ marginLeft: -20, marginRight: -20 }}>
                  <ChatbotSelector
                    selectedChatbot={selectedChatbot}
                    onSelectChatbot={setSelectedChatbot}
                  />
                </View>
              </View>

              <TouchableWithoutFeedback onPress={dismissKeyboard}>
                <View>
                  <MaterialCommunityIcons name="api" size={60} color="black" />
                  <TextInput
                    placeholder="Enter API Key"
                    onChangeText={setApiKey}
                    value={apiKey}
                    multiline={true}
                    style={styles.textInput}
                  />
                </View>
              </TouchableWithoutFeedback>

              <View>
                {/* Type selector done */}
                <TypeSelector
                  typeSelected={typeSelected}
                  onTypeSelected={setTypeSelected}
                />

                {/* Start with Model Selector - Each model has what what models will come here */}
                <ModelSelector
                  typeSelected={typeSelected}
                  selectedChatbot={selectedChatbot}
                  modelSelected={modelSelected}
                  onModelSelected={setModelSelected}
                />
              </View>

              <SimpleLineIcons
                name="speech"
                size={50}
                style={{ marginLeft: 8, marginBottom: 6 }}
                color="black"
              />
              {/* {console.log(modelSelected)} */}
              <SpeechSelector
                speechOption={speechOption}
                setSpeechOption={setSpeechOption}
              />
            </View>

            <ModalHelp
              isModalVisible={isModalVisible}
              setIsModalVisible={setIsModalVisible}
            />

            <TouchableOpacity
              onPress={() => {
                if (apiKey === "") {
                  alert("Please enter the API key.");
                } else {
                  setApiKeyEntered(true);
                }
              }}
            >
              <View
                style={{
                  marginTop: 40,
                  backgroundColor: "green",
                  padding: 15,
                  borderRadius: 13,
                }}
              >
                <Text style={{ color: "white", fontSize: 19 }}>Submit</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={{ flex: 1 }}>
              <GiftedChat
                messages={messages}
                renderInputToolbar={() => { }}
                user={{ _id: 1 }}
                minInputToolbarHeight={0}
                renderAvatar={renderAvatar}
                renderMessageAudio={({ currentMessage }) => (
                  <AudioMessage
                    currentMessage={currentMessage}
                    onAudioPress={handleAudioPress}
                  />
                )}
                renderMessage={renderMessage}
              />
              {/* <Button title="Clear Messages" onPress={clearMessages} /> */}
            </View>

            <ModalHelp
              isModalVisible={isModalVisible}
              setIsModalVisible={setIsModalVisible}
            />

            {loading && (
              <View style={{ justifyContent: "center", marginBottom: 20 }}>
                <ActivityIndicator size="large" color="#222222" />
              </View>
            )}

            <View style={{ flexDirection: "row" }}>
              <View
                style={styles.mainContainer}
              >
                <TextInput
                  placeholder="Enter your Question"
                  onChangeText={(text) => {
                    setInputMessage(text);
                    setEmptyInput(text.trim() === "");
                  }}
                  value={inputMessage}
                  multiline={true}
                />
              </View>

              <TouchableOpacity
                onPress={handleButtonClick}
                disabled={isDisabled}
              >
                <View
                  style={styles.sendIconContainer}
                >
                  <MaterialIcons
                    name="send"
                    size={30}
                    color={"white"}
                    style={{ marginLeft: 10 }}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setApiKeyEntered(!apiKeyEntered);
                }}
              >
                <View
                  style={styles.settingIconContainer}
                >
                  <MaterialIcons
                    name="settings"
                    size={30}
                    color="black"
                    style={{ alignSelf: "center" }}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </ImageBackground >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  messageImage: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  imageBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  firstInsideContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sendIconContainer: {
    backgroundColor: "green",
    padding: 5,
    marginRight: 10,
    marginBottom: 20,
    borderRadius: 9999,
    width: 60,
    height: 60,
    justifyContent: "center",
    borderColor: "black",
    borderWidth: 2,
  },
  settingIconContainer: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 9999,
    width: 60,
    height: 60,
    marginRight: 10,
    justifyContent: "center",
    borderColor: "black",
    borderWidth: 2,
  },
  mainContainer: {
    flex: 1,
    marginLeft: 10,
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 10,
    borderColor: "grey",
    borderWidth: 1,
    height: 60,
    marginLeft: 10,
    marginRight: 10,
    justifyContent: "center",
    paddingLeft: 14,
    paddingRight: 14,
  },
  textInput: {
    backgroundColor: "white",
    borderRadius: 10,
    borderColor: "grey",
    borderWidth: 1,
    padding: 10,
    width: 350,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  userMessageContainer: {
    justifyContent: "flex-end",
  },
  responseMessageContainer: {
    justifyContent: "flex-start",
  },
  audioIcon: {
    marginHorizontal: 10,
  },
  messageTextContainer: {
    maxWidth: "80%",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#DCF8C6",
  },
  userMessageTextContainer: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  responseMessageTextContainer: {
    backgroundColor: "#E4E4E4",
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
    color: "black",
  },
  userMessageText: {
    fontWeight: "bold",
  },
  responseMessageText: {
    fontStyle: "italic",
  },
  avatar: {
    marginLeft: 10,
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
});



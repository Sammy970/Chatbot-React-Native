import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

export default function App() {

  const [inputMessage, setInputMessage] = useState('');

  const handleButtonClick = () => {
    console.log(inputMessage)
  }

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

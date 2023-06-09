import { StyleSheet, View, TextInput, Modal, Text, Button } from 'react-native';
import React from 'react'
import { FontAwesome5, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';


const ModalHelp = ({ isModalVisible, setIsModalVisible }) => {
    return (
        <Modal
            visible={isModalVisible}
            animationType="fade"
            transparent={true}
        >
            <View style={styles.modalContainer}>
                <View style={styles.innerContainer}>

                    <Text style={styles.modalText}>Available Commands:</Text>

                    <Text style={styles.commandTitle}>
                        For All GPT
                    </Text>

                    <View style={styles.commandContainer}>
                        <FontAwesome5 name="hands-helping" size={24} color="beige" style={styles.icon} />
                        <Text style={styles.commandText}>
                            /help =  Display available commands
                        </Text>
                    </View>

                    <View style={styles.commandContainer}>
                        {/* <FontAwesome5 name="hands-helping" size={24} color="beige" style={styles.icon} /> */}
                        <MaterialIcons name="theater-comedy" size={35} color="beige" style={styles.icon} />
                        <Text style={styles.commandText}>
                            /kevin on =  Turn on Kevin Hart Mode {'\n'}
                            /kevin off =  Turn off Kevin Hart Mode
                        </Text>
                    </View>


                    <Text style={styles.commandTitle}>
                        For Pawan Osman GPT
                    </Text>

                    <View style={styles.commandContainer}>
                        <FontAwesome5 name="info" size={24} color="beige" style={styles.icon} />
                        <Text style={styles.commandText}>
                            /Get info = Info of remaining credits
                        </Text>
                    </View>
                    <View style={styles.commandContainer}>
                        <FontAwesome5 name="redo" size={24} color="beige" style={styles.icon} />
                        <Text style={styles.commandText}>
                            /Ip reset = Resets the IP
                        </Text>
                    </View>

                    <View>
                        <MaterialCommunityIcons name="robot-love-outline" size={28} color="beige" style={styles.thankyou} />
                        <Text style={styles.thankyouText}>
                            Thankyou For using
                        </Text>
                    </View>

                </View>
                <Button style={styles.buttonStlyle} title="Close" onPress={() => setIsModalVisible(false)} />
            </View>
        </Modal>

    )
}

export default ModalHelp

const styles = {
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.9)', // Darker background color
    },
    innerContainer: {
        width: 350,
        marginBottom: 20,
    },
    modalText: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 45,
        color: 'beige',
    },
    commandContainer: {
        flexDirection: 'row',
        // alignItems: 'center',
        marginBottom: 40,
    },
    icon: {
        marginRight: 20,
    },
    commandText: {
        fontSize: 17,
        color: 'white', // Lighter text color
    },
    commandTitle: {
        color: 'beige',
        textAlign: 'center',
        fontSize: 23,
        marginBottom: 10
    },
    thankyou: {
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 6
    },
    thankyouText: {
        textAlign: 'center',
        color: 'beige',
        fontSize: 18
    }
};

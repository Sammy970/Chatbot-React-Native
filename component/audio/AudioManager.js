import { StyleSheet, Text, View } from 'react-native'
import { useState, useEffect } from 'react'
import { Audio } from 'expo-av';

// Variable
const maxTries = 3;
let retryCount = 0;
let local_job_url = '';
let local_audio_link = '';


const AudioManager = () => {
    const [audioLink, setAudioLink] = useState('');
    const [audioUrl, setAudioUrl] = useState('');

    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    const play = async (jobUrl, msg, all_messages) => {

        const filteredMessage = all_messages.filter((message) => message._id === msg._id);

        // console.log(filteredMessage);
        try {

            // console.log(jobUrl);
            // console.log(msg.audioStat);

            if (filteredMessage[0].audioStat === "complete_success") {
                // console.log("I am in here");
                local_job_url = filteredMessage[0].job;
                local_audio_link = filteredMessage[0].audioLink;
                // console.log(local_audio_link);

                try {
                    const playbackObject = new Audio.Sound();
                    const sound = await playbackObject.loadAsync(
                        { uri: local_audio_link },
                        { shouldPlay: true },
                        (error) => {
                            if (error) {
                                console.error('Failed to load audio:', error);
                            }
                        }
                    );

                    local_audio_link = '';
                    local_job_url = '';
                } catch (error) {
                    console.log("Error at Playing Sound", error)
                }
            }

            else {

                let audio_path = null;

                await delay(2000)

                while (retryCount < maxTries || (audio_path === null || audio_path === undefined)) {

                    const response3 = await fetch(filteredMessage[0].job, {
                        method: "GET",
                        headers: {
                            'Accept': 'application/json',
                        }
                    });

                    const text3 = await response3.text();
                    var data2 = JSON.parse(text3);
                    // console.log("data: ", data2)

                    filteredMessage[0].audioStat = data2.state.status;
                    // console.log(msg.audioStat)

                    const audio_path = data2.state.maybe_public_bucket_wav_audio_path;
                    // console.log("Audio path: ", audio_path)

                    if (audio_path !== null && audio_path !== undefined) {
                        // console.log("I am in here")
                        const link = 'https://storage.googleapis.com/vocodes-public' + audio_path;
                        await setAudioLink(link);
                        console.log("Link from inside the if statement: ", link);

                        try {
                            retrycount = 0;
                            const playbackObject = new Audio.Sound();
                            // playbackObject.stopAsync();
                            const sound = await playbackObject.loadAsync(
                                { uri: link },
                                { shouldPlay: true },
                                (error) => {
                                    if (error) {
                                        console.error('Failed to load audio:', error);
                                    }
                                }
                            );
                        } catch (error) {
                            console.log("Error at Playing Sound", error)
                        }

                        filteredMessage[0].audioLink = link;
                        // setAudioLoading(false);
                        break;

                    } else {
                        console.log("Adding Delay")
                        await delay(6000)
                        console.log("Delay Completed")
                    }
                }

                // await delay(4000);

                // await console.log("Audio Final Link: ", audioLink);

            }

        } catch (error) {
            console.log("Error at Fetching", error)
        }



        // console.log(sound)
        // setAudio(sound);
        // sound.playAsync(); // Add this line to play the audio immediately


        // const playAudio = async (uri) => {
        //     if (audio) {
        //         // console.log(audio);
        //         await audio.unloadAsync();
        //         await audio.loadAsync({ uri });
        //         await audio.playAsync();
        //     }
        // };

    };

    return { play };
}

export default AudioManager

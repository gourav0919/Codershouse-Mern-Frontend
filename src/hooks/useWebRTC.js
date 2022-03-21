import { useRef, useCallback, useEffect } from "react";
import { useStateWithCallback } from "./useStateWithCallback";
import { socketInit } from "../socket";
import { ACTIONS } from "../actions";

// This is our clients
// const users = [
//   {
//     id: 1,
//     name: "Gourav Khurana",
//   },
//   {
//     id: 2,
//     name: "Sahil Bansal",
//   },
// ];
const users = [];

export const useWebRTC = (roomId, user) => {
  // List of all of the users which we have to show
  //   now we can provide a callback to the state update which will run after the state update and do our work with the state which we want to do
  const [clients, setClients] = useStateWithCallback(users);

  //   for audio channel we have to maintain a mapping and also the mapping of user also we are not using normal states we are using the reference
  //   These two will contain socketId and the instance which can be peer to peer or audio instance which i did not know until
  const audioElements = useRef({}); // use userId
  // now we have to think how the audio will come to this audioElement

  const connections = useRef({});

  //   Local data or earphone data or mic data
  const localMediaStream = useRef(null);

  const socket = useRef(null);

  // Creating a use Effect as the page loads our socket is going to run
  useEffect(() => {
    socket.current = socketInit();
  }, []);

  // we make a function which is providing audioReference data to the actual reference as a key value pair because audioElement is a object
  // now we have mapping control now i can easily access that dom element with this audioElement.id
  const provideRef = (instance, userId) => {
    audioElements.current[userId] = instance;
  };

  //
  const addNewClients = useCallback(
    (newClient, cb) => {
      const lookingFor = clients.find(() => {
        return clients.id === newClient.id;
      });

      if (lookingFor === undefined) {
        setClients((existingClients) => {
          return [...existingClients, newClient];
        }, cb);
      }
    },
    [clients, setClients]
  );

  // capture Media or mic when the useWebRTC component redered for the first time
  useEffect(() => {
    // This function is to start the audio recording and store it into the localMediastream reference
    const startCapture = async () => {
      // navigator is a global window object now we are starting recording here and store it in the localMediaStream
      localMediaStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
    };

    // As we know that the start capture will return a promise so we use the .then to resolve a promise
    startCapture().then(() => {
      // internally checks is also required
      // The second function which we provided here is going to run after the state update of client
      addNewClients(user, () => {
        // getting the audioElement with the current userId
        const localElement = audioElements.current[user.id];
        if (localElement) {
          // setting the voice to 0 because we did not want to listen our own voice
          localElement.volume = 0;

          // Now we are passing the source of the media
          localElement.srcObject = localMediaStream.current;
        }

        // sending the offer to the server or via the web Socket
        // emit join socket io so this type of many event we have so we create a object and store it on server so the hardcode is not needed so for this we are going to create a file name as actions.js in both the frontend and as well as the backend because npm react does not allow to create a file outside src
        socket.current.emit(ACTIONS.JOIN, { roomId, user });
      });
    });
  }, []);

  return { clients, provideRef };
};

// here we have to handle the state update when the state is updating then some callback should be run or clean up function should be run. why we are doing this because we have to do several changes when the state changes like adding streams, adding client and much more
//   we can use useEffect but that did not going to work
//   now we make a callback which will run when this state updates
//   This is the same useState but our this useState has a feature that we have a callback now
//   now what is our goal is when our client got update via the setClients then we want to execute a callback
// This functionality is not provided by the hooks so what we do is we create our custom hook
// now our updateState is the actually setClient
//   Every time when i do setClients then the useEffect in the hook also runs

//   setClients(
//     //   This help in updating the state
//     (prev) => {},
//     //   This is called by the reference
//     (state) => {
//       // now we can do the things here after the state update
//     }
//   );

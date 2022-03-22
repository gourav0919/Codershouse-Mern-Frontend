import { useRef, useCallback, useEffect } from "react";
import { useStateWithCallback } from "./useStateWithCallback";
import { socketInit } from "../socket";
import { ACTIONS } from "../actions";
import freeice from "freeice";

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

export const useWebRTC = (roomId, user) => {
  // List of all of the users which we have to show
  //   now we can provide a callback to the state update which will run after the state update and do our work with the state which we want to do
  const [clients, setClients] = useStateWithCallback([]);

  //   for audio channel we have to maintain a mapping and also the mapping of user also we are not using normal states we are using the reference
  //   These two will contain socketId and the instance which can be peer to peer or audio instance which i did not know until
  const audioElements = useRef({}); // use userId
  // now we have to think how the audio will come to this audioElement

  // connections is having a key as socket Id and the value as the connection which is the important data of web rtc which we need to send
  const connections = useRef({});

  //   Local data or earphone data or mic data
  const localMediaStream = useRef(null);

  // This we make to store the user or browser or itself socket information or making the itself information
  const socket = useRef(null);

  // we make a function which is providing audioReference data to the actual reference as a key value pair because audioElement is a object
  // now we have mapping control now i can easily access that dom element with this audioElement.id
  const provideRef = (instance, userId) => {
    audioElements.current[userId] = instance;
  };

  // This is for adding the client in the client state or client local state if not exist
  // we use useCallback for the memorisation of the function for the same values to increase the performance
  const addNewClient = useCallback(
    (newClient, cb) => {
      // here we do some validation before directly adding into a room
      const lookingFor = clients.find(() => {
        return clients.id === newClient.id;
      });

      // if it is not present in the room then add it to the room via the state update and calling the callback which run after adding the user in the room
      if (lookingFor === undefined) {
        setClients((existingClients) => {
          return [...existingClients, newClient];
        }, cb);
      }
    },
    [clients, setClients]
  );

  // Creating a use Effect as the page loads our socket initialisation is going to store in the reference of socket which we used in the near future or initialise a socket for the client
  useEffect(() => {
    socket.current = socketInit();
  }, []);

  // now this below useEffect will run after initialising the socket and store it in socket ref

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
      addNewClient(user, () => {
        // getting the audioElement with the current userId which we store in the room component in the dom by calling the providingRef function to the audioElement
        // our audioElement is a reference to a object
        // By this actually we get the audio instance of that specified userid and if we have any dom element then we can easily perform operation around it
        const localElement = audioElements.current[user.id];

        // if that element is not present then do not do anything it means it can be the non-speaker which did not have the right to speak that's why
        if (localElement) {
          // setting the voice to 0 because we did not want to listen our own voice
          localElement.volume = 0;

          // Now we are adding the our sound or voice to the audioElement reference
          localElement.srcObject = localMediaStream.current;
        }

        // sending the offer to the server or via the web Socket
        // emit join socket io so this type of many event we have so we create a object and store it on server so the hardcode is not needed so for this we are going to create a file name as actions.js in both the frontend and as well as the backend because npm react does not allow to create a file outside src
        // now socket.current is the socket instance in which we can emit some events which goes to the server and take back the response
        // now from the client side we are emitting the event so the from the server side the server should be listening to the event
        // Apply event to the socket instance
        // Now this is called as the connecting to server with taking some data but without making an network API call request but via the event of socket instance
        socket.current.emit(ACTIONS.JOIN, { roomId, user });
      });
    });
  }, []);

  // after emitting the JOIN action now the backend also giving you the two events name as the addpeer so you have to listen it in the frontend
  useEffect(() => {
    // we have our own socker id which is in socket.id so if we have to connect to another user then we need other user socket id and then we provided that we have to create offer or not and the user also
    const handleNewPeer = async ({ peerId, createOffer, user: remoteUser }) => {
      // checking if the peer is already present in connections then give warning
      if (peerId in connections.current) {
        return console.warn(
          `You are already connected with ${peerId} (${user.name})`
        );
      }

      // from there the work of web RTC is start see the 9th video for the more understanding of the WebRTC

      // if client is not present then make the web rtc object and store it.
      // one option of iceserver is important because our computer or browser did not know the public IP of the computer so we need to tell to browser what is the public id that work is done by the iceservers
      connections.current[peerId] = new RTCPeerConnection({
        // use free vale ice servers
        // Now this gives us the public ip from the free ice server
        iceServers: freeice(),
      });

      // now adding the new ice candidate
      // ice candidate is going to happen when the information of local description is going to changed then it detect it
      // we know that the string  whiich is return by the localDescription of connection is going to send to the client
      // so we add a event to the server from the frontend if the local description is changed then call this listen for this event on the server with some data
      connections.current[peerId].onicecandidate = (event) => {
        socket.current.emit(ACTIONS.RELAY_ICE, {
          peerId,
          // event.candidate is the string which we want to send to the remote peer  or other peer
          icecandidate: event.candidate,
        });
      };

      // when  the data comes on this connection
      connections.current[peerId].ontrack = ({ streams: [remoteStream] }) => {
        // now we are getting remote streams and setting this to clients state
        addNewClient(remoteUser, () => {
          // calback of state update

          // checking for the audio elements exist already
          // or the audio element is ready or rendered
          if (audioElements.current[remoteUser.id]) {
            // return
            // if the audioElement is already made up then we simply add the remote user stream to the src of audio so that the audio comes to our browser
            audioElements.current[remoteUser.id].srcObject = remoteStream;
          }
          // else means till now the audio element is not rendered in the ui
          else {
            // sometimes it takes time if so many member there is a hack
            let settled = false;

            // we are checking every second if the audio element exist or not as the audioelement exist we set the source for the sound
            const interval = setInterval(() => {
              if (audioElements.current[remoteUser.id]) {
                audioElements.current[remoteUser.id].srcObject = remoteStream;

                // when stream got attached then its our work done
                settled = true;

                if (settled) {
                  // clear the interval if the remote stream is added to src
                  clearInterval(interval);
                }
              }
            }, 1000);
          }
        });
      };
      // add local track to remote connection so that our voice goes to other clients
      // This is used for getting the object instance of the local media stream
      localMediaStream.current.getTracks().forEach((track) => {
        // This syntax is neccessary and it is used for adding the media to the client so that it is transmitted to the peer
        connections.current[peerId].addTrack(track, localMediaStream.current);
      });

      // now create offer
      if (createOffer) {
        const offer = await connections.current[peerId].createOffer();
        // now sending the offer to another client
        socket.current.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sessionDescription: offer,
        });
      }
    };

    // now here our socket is listening for the add_peer event and we put it in the useeffect it means after rendering the component first this line will always gonna to run so our socket is always ready for the listening of the event of add_peer everytime before it starts its operation
    socket.current.on(ACTIONS.ADD_PEER, handleNewPeer);

    // returing a clean up function
    return () => {
      // saving from the memory leak
      socket.current.off(ACTIONS.ADD_PEER); // this is the method to unsubscribe the action or event
    };
  }, []);

  // Making one more useEffect for handling ice candidate
  useEffect(() => {
    socket.current.on(ACTIONS.ICE_CANDIDATE, ({ peerId, icecandidate }) => {
      if (icecandidate) {
        connections.current[peerId].addIceCandidate(icecandidate);
      }
    });

    return () => {
      // unsubscribe the event
      socket.current.off(ACTIONS.ICE_CANDIDATE);
    };
  }, []);

  // Handle SDP or Session Description for both answer and the offer
  useEffect(() => {
    const handleRemoteSdp = async ({
      peerId,
      sessionDescription: remoteSessionDescription,
    }) => {
      // we can pass direcly but in some browsers it did not work so we have to pass the object instance
      connections.current[peerId].setRemoteDescription(
        new RTCSessionDescription(remoteSessionDescription)
      );

      // we have a type property which can be offer or answer so we have to return

      // if session description of type of offer then create an answer
      if (remoteSessionDescription.type === "offer") {
        const connection = connections.current[peerId];
        const answer = await connection.createAnswer();
        connection.setLocalDescription(answer);

        socket.current.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sessionDescription: answer,
        });
      }
    };

    socket.current.on(ACTIONS.SESSION_DESCRIPTION, handleRemoteSdp);

    return () => {
      socket.current.off(ACTIONS.SESSION_DESCRIPTION);
    };
  }, []);

  return { clients, provideRef };
};

// he want to say that for understanding this you may have a lot of confusions for learning it use a pen and paper

// In this we have the servers for doing the work of web sockets or getting the essentials thing required to connect one client to other via the web RTC so we use the server or says as the web sockets to establish the connection first and then the web RTC shows his work

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

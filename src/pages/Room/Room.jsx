import React, { useEffect, useState } from 'react'
import styles from './Room.module.css'
import { useParams } from 'react-router-dom'
import { useWebRTC } from '../../hooks/useWebRTC'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getSingleRoom } from '../../http'

const Room = () => {
    // useParams is also a hook from react-router-dom and we receive the room id which we give in the url
    // for the dynamic handling of the url in the fronend we use a hook name as the useParams and in the backend we have an object name as the req.params;
    const { roomId } = useParams();
    // destructuring the user from the auth slice of redux store
    const { user } = useSelector((state) => state.auth);

    // we know that the logic for the client is bit more so we can create a hook and store it there
    // whenever you feel the logic is going more and more then move the logic to the custom hook
    const { clients, provideRef, handleMute } = useWebRTC(roomId, user);

    // now we are going to use this id to connect user with the web Socket and web RTC
    const navigate = useNavigate();
    const handleManualLeave = () => {
        // Redirect to home and then everything is handled by the cleaner functions 
        navigate('/rooms');
    }
    // now here i have doubt if i did not use useState here and using a simple variable then what is going to happen. 
    // In my opinion, we are using useEffect which we know will be run when the component is mounted so we get the empty value of the room in the dom but if we make a normal function and call it before rendering the component then it works fine but we know that our component is re-rendering many times so it can be so resource intensive thats why we use the concept of useState and useEffect here
    const [room, setRoom] = useState(null);
    // we give the dependency of the room Id if our room Id changes which we have then it is going to fetch it again 
    useEffect(() => {
        const fetchRoom = async () => {
            const { data } = await getSingleRoom(roomId);
            const { room } = data;
            setRoom((prev) => room);
        };

        fetchRoom();
    }, [roomId]);

    const [isMute, setIsMute] = useState(true);
    // if isMute state change then this room component is going to be rendered again because of state change
    // When the isMute dependency change then this useEffect will run every time we use it to send the request via the web socket to the client so that it stop the stream sending
    useEffect(() => {
        // we are making the functionality to mute or unmute ourself not anyone other
        handleMute(isMute, user.id);
        console.log(isMute);
    }, [isMute]);

    // Function for setting mute or unmute or updating the state from mute to unmute or unmute to mute 
    const setMuteOrUnmute = (clientId) => {
        // isMute ? setIsMute(false) : setIsMute(true);
        // we have only permit user to do this work if he click on the his or ourself mic not on anyone other mic so for doing this we can simply add a if condition with the help of the clientId
        if (user.id === clientId) {
            setIsMute((mute) => !mute);
        }
    }

    console.log(clients, isMute);

    return (
        <div>
            <div className="container">
                <button className={styles.goBackBtn} onClick={handleManualLeave}>
                    <img src="/images/arrow-back.png" alt="Back Arrow" />
                    <span className={styles.backBtnText}>All voice rooms</span>
                </button>
            </div>
            <div className={styles.clientsWrapper}>
                <div className={styles.roomHeader}>
                    {/* We will going to get this name via a server request */}
                    {/* This is also the js new feature of using the question mark if null or empty if exist then it goes to next */}
                    <h2 className={styles.roomTopic}>{room?.topic}</h2>
                    <div className={styles.actionButtons}>
                        <button className={styles.actionBtn}>
                            <img src="/images/palm.png" alt="palm" />
                        </button>
                        <button className={styles.actionBtn} onClick={handleManualLeave}>
                            <img src="/images/win.png" alt="win-icons" />
                            <span>Leave quietly</span>
                        </button>
                    </div>

                </div>
                <div className={styles.clientsList}>
                    {
                        clients.map((client) => {
                            return (
                                <div className={styles.client} key={client.id}>
                                    <div className={styles.userHead}>
                                        {/* In the reference we can provide a variable and a function as well instance refers to this element*/}
                                        <audio ref={(instance) => provideRef(instance, client.id)}
                                            // controls
                                            autoPlay
                                        ></audio>
                                        <img className={styles.userAvatar} src={client.avatar} alt="user avatar" />
                                        <button className={styles.micBtn} onClick={() => setMuteOrUnmute(client.id)}>
                                            {/* This is for showing the mic on icon */}
                                            {client.muted ? <img src="/images/mic_off.png" alt="mic off icon" /> : <img src="/images/mic.png" alt="mic icon" />}
                                        </button>
                                    </div>
                                    <h4>{client.name}</h4>
                                </div>
                            );
                        })
                    }
                </div>

            </div>
        </div>
    )
}

// Remember this firstly jsx will render and then the useEffect hook of useWebRTC will run

export default Room;


// one error discovered when you close the browser and it is last tab and you close that tab then remove peer event is not triggered
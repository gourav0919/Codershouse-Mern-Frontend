import React, { useState } from 'react'
import styles from './Room.module.css'
import { useParams } from 'react-router-dom'
import { useWebRTC } from '../../hooks/useWebRTC'
import { useSelector } from 'react-redux'

const Room = () => {
    // useParams is also a hook from react-router-dom and we receive the room id which we give in the url
    const { roomId } = useParams();
    // destructuring the user from the auth slice of redux store
    const { user } = useSelector((state) => state.auth);

    // we know that the logic for the client is bit more so we can create a hook and store it there
    // whenever you feel the logic is going more and more then move the logic to the custom hook
    const { clients, provideRef } = useWebRTC(roomId, user);

    // now we are going to use this id to connect user with the web Socket and web RTC


    return (
        <div>
            <h1>All Connected Clients.</h1>
            {
                clients.map((client) => {
                    return (
                        <div key={client.id}>
                            {/* In the reference we can provide a variable and a function as well instance refers to this element*/}
                            <audio ref={(instance) => provideRef(instance, client.id)} controls autoPlay></audio>
                            <h4>{client.name}</h4>
                        </div>
                    );
                })
            }
        </div>
    )
}

export default Room
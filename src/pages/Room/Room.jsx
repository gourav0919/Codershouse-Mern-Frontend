import React from 'react'
import { useParams } from 'react-router-dom'
import styles from './Room.module.css'

const Room = () => {
    const { roomId } = useParams();
    // now we are going to use this id to connect user with the web Socket and web RTC


    return (
        <div>This is the Room component for {roomId}</div>
    )
}

export default Room
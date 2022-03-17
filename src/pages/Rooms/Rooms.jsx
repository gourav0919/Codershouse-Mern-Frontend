import React from 'react'
import RoomCard from '../../components/RoomCard/RoomCard'
import styles from './Rooms.module.css'

// Dummy data for rooms list 
const rooms = [
    {
        id: 1,
        topic: "Which framework is best for frontend?",
        speakers: [
            {
                id: 1,
                name: 'Gourav Khurana',
                avatar: '/images/room-demo1.png',
            },
            {
                id: 2,
                name: 'Sahil Bansal',
                avatar: '/images/room-demo2.png',
            },
        ],
        totalPeople: 40,
    },
    {
        id: 2,
        topic: "How to get a Job in FAANG?",
        speakers: [
            {
                id: 1,
                name: 'Gourav Khurana',
                avatar: '/images/room-demo1.png',
            },
            {
                id: 2,
                name: 'Sahil Bansal',
                avatar: '/images/room-demo2.png',
            },
        ],
        totalPeople: 72,
    },
    {
        id: 3,
        topic: "How you define Machine Learning?",
        speakers: [
            {
                id: 1,
                name: 'Gourav Khurana',
                avatar: '/images/room-demo1.png',
            },
            {
                id: 2,
                name: 'Sahil Bansal',
                avatar: '/images/room-demo2.png',
            },
        ],
        totalPeople: 6,
    },
    {
        id: 4,
        topic: "Why you did not like DSA?",
        speakers: [
            {
                id: 1,
                name: 'Gourav Khurana',
                avatar: '/images/room-demo1.png',
            },
            {
                id: 2,
                name: 'Sahil Bansal',
                avatar: '/images/room-demo2.png',
            },
        ],
        totalPeople: 15,
    },
]

const Rooms = () => {
    return <>
        {/* Making an hr component so that it can be reusable in multiple pages  */}
        <hr />
        <div className='container'>
            <div className={styles.roomHeader}>
                <div className={styles.left}>
                    <span className={styles.roomHeadingText}>All voice rooms</span>
                    <div className={styles.searchBoxWrapper}>
                        <label htmlFor="search"><img src="/images/search.png" alt="search" className={styles.searchImage} /></label>
                        {/* <img src="/images/search.png" alt="search" className={styles.searchImage} /> */}
                        <input type="text" name="search" id='search' className={styles.searchBox} />
                    </div>
                </div>
                <div className={styles.right}>
                    <button className={styles.startRoomBtn}>
                        <img src="/images/start-room.png" alt="Start Room Emoji" />
                        <span className={styles.startRoomBtnText}>Start a room</span>
                    </button>
                </div>
            </div>
            {/* This list of rooms is coming from the backend currently we are using dummy data for creating the frontend and when our backend gets ready we replace it with real data */}
            {/* Now from here making the list of all of the available rooms */}
            <div className={styles.roomList}>
                {/* now here i add all of the fields of room object as the props so we save from writing it again and again */}
                {/* {rooms.map((room) => { return <RoomCard key={room.id} id={room.id} topic={room.topic} speakers={room.speakers} totalPeople={room.totalPeople} /> })} */}
                {rooms.map((room) => { return <RoomCard key={room.id} {...room} /> })}
            </div>
        </div>


    </>
}

export default Rooms
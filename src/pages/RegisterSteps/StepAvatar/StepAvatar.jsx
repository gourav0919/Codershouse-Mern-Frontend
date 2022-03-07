import React from 'react'
import styles from './StepAvatar.module.css';

const StepAvatar = ({ onNext }) => {
    return (
        <>
            <div>StepAvatar</div>
            <button onClick={onNext}>next</button>
        </>
    )
}

export default StepAvatar
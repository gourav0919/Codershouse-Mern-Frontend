import React from 'react'
import styles from './StepName.module.css'

const StepName = ({ onNext }) => {
    return (
        <>
            <div>StepName</div>
            <button onClick={onNext}>next</button>
        </>
    )
}

export default StepName
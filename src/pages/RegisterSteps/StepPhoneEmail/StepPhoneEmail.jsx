import React from 'react'
import styles from './StepPhoneEmail.module.css'

const StepPhoneEmail = ({ onNext }) => {
    return (
        <>
            <div>StepPhoneEmail</div>
            <button onClick={onNext}>next</button>
        </>
    )
}

export default StepPhoneEmail
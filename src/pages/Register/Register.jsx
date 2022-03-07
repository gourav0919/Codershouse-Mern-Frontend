import React, { useState } from 'react'
import styles from './Register.module.css'
import StepPhoneEmail from '../RegisterSteps/StepPhoneEmail/StepPhoneEmail'
import StepOtp from '../RegisterSteps/StepOtp/StepOtp'
import StepName from '../RegisterSteps/StepName/StepName'
import StepAvatar from '../RegisterSteps/StepAvatar/StepAvatar'
import StepUsername from '../RegisterSteps/StepUsername/StepUsername'

// creating a hashmaps of all the steps in the Register Process from taking number or email to creating the username for a new user. See the design docs and you will understand it.
const registerSteps = {
    1: StepPhoneEmail,
    2: StepOtp,
    3: StepName,
    4: StepAvatar,
    5: StepUsername,
}

const Register = () => {
    const [stepNumber, setStepNumber] = useState(1);
    const RegisterStepPage = registerSteps[stepNumber];

    const onNext = () => {
        setStepNumber(stepNumber + 1);
    }

    return <RegisterStepPage onNext={onNext} />
}

export default Register
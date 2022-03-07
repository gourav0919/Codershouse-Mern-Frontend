import React, { useState } from 'react'
import styles from './Login.module.css'
import StepPhoneEmail from '../RegisterSteps/StepPhoneEmail/StepPhoneEmail'
import StepOtp from '../RegisterSteps/StepOtp/StepOtp'

// As we know that Login also have some steps same as the Register first 2 step of getting number and otp is same.
const loginSteps = {
    1: StepPhoneEmail,
    2: StepOtp,
}

const Login = () => {
    const [stepNumber, setStepNumber] = useState(1);
    const LoginStepPage = loginSteps[stepNumber];

    const onNext = () => {
        setStepNumber(stepNumber + 1);
    }

    return (
        <LoginStepPage onNext={onNext} />
    )
}

export default Login
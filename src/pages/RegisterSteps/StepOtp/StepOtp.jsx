import React, { useState } from 'react'
import styles from './StepOtp.module.css'
import Card from '../../../components/shared/Card/Card';
import Button from '../../../components/shared/Button/Button';
import TextInput from '../../../components/shared/TextInput/TextInput';

const StepOtp = ({ onNext }) => {
    const [otp, setOtp] = useState('');
    return (
        <>
            <div className={styles.cardWrapper}>
                <Card title="Enter the code we just texted you" icon="lock">
                    <TextInput size="15" value={otp} onChange={(e) => setOtp(e.target.value)} />
                    <div>
                        <p className={styles.resendBtnText}>Didn’t receive? Tap to resend</p>
                        <div className={styles.actionButtonWrap}>
                            <Button onClick={onNext} btnText="Next" />
                        </div>
                    </div>
                </Card >
            </div>
        </>
    )
}

export default StepOtp
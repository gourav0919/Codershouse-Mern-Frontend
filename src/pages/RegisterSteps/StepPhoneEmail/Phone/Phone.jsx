import React, { useState } from 'react'
import Card from '../../../../components/shared/Card/Card';
import Button from '../../../../components/shared/Button/Button';
import TextInput from '../../../../components/shared/TextInput/TextInput';
import styles from '../StepPhoneEmail.module.css'

const Phone = ({ onNext }) => {
    const [phoneNumber, setPhoneNumber] = useState('');

    return (
        <Card title="Enter Your Phone Number" icon="phone">

            {/* On the Occurence of onchange event we are changing our state to the new value enter by the user. */}
            <TextInput placeholder="+91 98233 24223" size="25" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />

            <div>
                <div className={styles.actionButtonWrap}>
                    <Button onClick={onNext} btnText="Next" />
                </div>
                <p className={styles.termsText}>By entering your number, you’re agreeing to our Terms of Service and Privacy Policy. Thanks!</p>
            </div>

        </Card >
    )
}

export default Phone
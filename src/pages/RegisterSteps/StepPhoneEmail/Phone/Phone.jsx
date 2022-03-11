import React, { useState } from 'react'
import Card from '../../../../components/shared/Card/Card';
import Button from '../../../../components/shared/Button/Button';
import TextInput from '../../../../components/shared/TextInput/TextInput';
import styles from '../StepPhoneEmail.module.css'
import { sendOtp } from '../../../../http/index';
import { useDispatch } from 'react-redux';
import { setOtpKey } from '../../../../store/authSlice'

const Phone = ({ onNext }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const dispatch = useDispatch();
    async function onNextBtnClick() {
        // we know that it return a object which have a key name as data which contain the data that is returned as the response
        const { data } = await sendOtp({ phone: phoneNumber });
        console.log(data);
        dispatch(setOtpKey({ phone: data.phone, hash: data.hash }));

        // before calling onnext we have to do the several works like sending the otp
        onNext();
    }

    return (
        <Card title="Enter Your Phone Number" icon="phone">

            {/* On the Occurence of onchange event we are changing our state to the new value enter by the user. */}
            <TextInput placeholder="+91 98233 24223" size="25" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />

            <div>
                <div className={styles.actionButtonWrap}>
                    <Button onClick={onNextBtnClick} btnText="Next" />
                </div>
                <p className={styles.termsText}>By entering your number, you’re agreeing to our Terms of Service and Privacy Policy. Thanks!</p>
            </div>

        </Card >
    )
}

export default Phone
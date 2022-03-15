import React, { useState } from 'react'
import styles from './StepAvatar.module.css';
import Card from '../../../components/shared/Card/Card';
import Button from '../../../components/shared/Button/Button';
import { useSelector, useDispatch } from 'react-redux';
import { setAvatarKeyRedux } from '../../../store/activateSlice';
import { activateUser } from '../../../http';
import { setAuth } from '../../../store/authSlice';

const StepAvatar = ({ onNext }) => {
    const { fullName, avatar } = useSelector((state) => state.activate);

    const dispatch = useDispatch();


    const [image, setImage] = useState('/images/avatar-default.png');


    const onNextBtnClick = async () => {
        console.log("Now you have to perform the server query for adding theh name and avatar of the user in the database.");
        // now we have to redirect directly to the rooms page so for doing this we have to set in the redux store the user is activated so it automaticlly redirect it to room page 

        // here we have to call the activate user route and set in the database the user as the activated true and the auth slice of the redux store which containt the activate field set it to true also.
        try {
            // data is the key which contains the response coming from axios requests 
            const { data } = await activateUser({ name: fullName, avatar });
            const { success, user } = data;

            if (success) {
                // now setting the user as activated in the redux store 
                dispatch(setAuth({ user }));
            }
        } catch (error) {
            console.log(error);
        }
    }

    // This will give us an event which have some properties we have to go to the target which have an array of object in the files field
    const captureImage = (e) => {
        // This is a array so we can use array index to get the first item from the list of inputs if come 
        const file = e.target.files[0];

        // if we got the file then 
        if (file) {
            // using browsers apis and converting it to base64
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                // so now in this way we convert our string to the base 64 string format 
                setImage(reader.result);
                // console.log(reader.result);
                //  now we have to store it in the redux store 
                dispatch(setAvatarKeyRedux(reader.result));
            };
        }
    }

    return (
        <>
            <div className="cardWrapper">
                {/* Now making the name as dynamic */}
                <Card title={`Okay, ${fullName}!`} icon="avatar_emoji">

                    <p className={styles.subHeading}>How’s this photo? </p>

                    <div className={styles.imageView}>
                        <img className={styles.image} src={image} alt="Avatar" />
                    </div>

                    <div>
                        <label htmlFor="avatarImageSelection" className={styles.imageFromDevice}>Choose a different photo</label>
                        <input onChange={captureImage} type="file" name="avatarImage" id="avatarImageSelection" className={styles.avatarImageSelection} />
                    </div>

                    <div className={styles.actionButtonWrap}>
                        <Button onClick={onNextBtnClick} btnText="Next" />
                    </div>

                </Card >
            </div>
        </>
    )
}

export default StepAvatar
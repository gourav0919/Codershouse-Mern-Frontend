import React from 'react'
import { Link } from 'react-router-dom';
// The Css file use the default export so we can gave the name according to us.
import styles from './Navigation.module.css';

const Navigation = () => {
    // Inline CSS for the link or anchor tag 
    const brandStyle = {
        textDecoration: 'none',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        fontWeight: '700',
        fontSize: '22px',
    }

    const logoText = {
        marginLeft: '10px',
    }

    const logoImage = {
        height: '30px',
    }

    return (
        // using Templates literals to provide strings
        <nav className={`${styles.navbar} container`}>
            {/* But the problem is this here that we can not be able to give module style to the child jsx elements so for this we have to write inline css*/}
            <Link style={brandStyle} to="/">
                <img style={logoImage} src="/images/logo.png" alt="logo" />
                <span style={logoText}>Codershouse</span>
            </Link>
        </nav>
    )
}

export default Navigation
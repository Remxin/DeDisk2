import React, { useState } from 'react'
import Navbar from '@/src/layout/Navbar/Navbar'

// styles
import loginStyles from "../styles/Login.module.css"

// components
import Modal from '@/src/components/Modal/Modal'
import Button from '@/src/components/forms/Button/Button'
import Input from '@/src/components/forms/Input/Input'

// validations
import { userValidations } from '@/src/validations/userData'

const Login = () => {
    const [showLogin, setShowLogin] = useState(false)
    const [showRegister, setShowRegister] = useState(false)
    return (
        <div className={loginStyles.login_container}>
            <Navbar />
            <img src="images/login-logo.svg" alt="login logo" className={loginStyles.backgroundImage} />
            <div className={loginStyles.buttons}>
                <Button text="Login" onClick={() => setShowLogin(true)} />
                <Button text="Register" onClick={() => setShowRegister(true)} />
            </div>
            <Modal visible={showLogin} setVisible={setShowLogin}>
                <h2>Login</h2>
                <Input placeholder='Email' validationFunction={userValidations.email} />
                <Input placeholder='Password' validationFunction={userValidations.password} secure={true} />
                <Button text="Login" onClick={() => console.log("a")} styles={{ marginTop: 10 }} />
            </Modal>
            <Modal visible={showRegister} setVisible={setShowRegister}>
                <h2>Register</h2>
                <Input placeholder='Name' validationFunction={userValidations.nick} />
                <Input placeholder='Email' validationFunction={userValidations.email} />
                <Input placeholder='Password' validationFunction={userValidations.password} secure={true} />
                <Button text="SignUp" onClick={() => console.log('a')} styles={{ marginTop: 10 }} />
            </Modal>
        </div>
    )
}

export default Login
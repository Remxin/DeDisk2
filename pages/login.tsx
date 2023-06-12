import React, { useState, useRef, MutableRefObject, useMemo } from 'react'
import Navbar from '@/src/layout/Navbar/Navbar'
// router
import { useRouter } from 'next/router'

// styles
import loginStyles from "../styles/Login.module.css"

// components
import Modal from '@/src/components/modals/Modal/Modal'
import Button from '@/src/components/forms/Button/Button'
import Input from '@/src/components/forms/Input/Input'
import FullScreenLoading from "@/src/components/modals/FullScreenLoading/FullScreenLoading"

// validations
import { userValidations } from '@/src/validations/userData'

// redux
import { useDispatch, useSelector } from "react-redux"
import { registerUser, loginUser } from '@/src/features/userSlice'
import { RootState } from '@/src/config/reduxStore'

const Login = () => {

    // refs
    const nameRef = useRef() as MutableRefObject<HTMLInputElement>
    const emailRef = useRef() as MutableRefObject<HTMLInputElement>
    const passwordRef = useRef() as MutableRefObject<HTMLInputElement>

    // modals
    const [showLogin, setShowLogin] = useState(false)
    const [showRegister, setShowRegister] = useState(false)

    // other
    const dispatch = useDispatch()
    const userState = useSelector((state: RootState) => state.user)

    const { push } = useRouter()
    if (userState.id) push("/")


    const RegisterForm = useMemo(() => (
        <form>
            <h2>Register</h2>
            <Input ref={nameRef} placeholder='Name' validationFunction={userValidations.nick} />
            <Input ref={emailRef} placeholder='Email' validationFunction={userValidations.email} parentError={userState.error} />
            <Input ref={passwordRef} placeholder='Password' validationFunction={userValidations.password} secure={true} />
            <Button text="SignUp" onClick={handleRegister} styles={{ marginTop: 10 }} />
        </form>
    ), [userState.error])

    const LoginForm = useMemo(() => (
        <form>
            <h2>Login</h2>
            <Input ref={emailRef} placeholder='Email' validationFunction={userValidations.email} />
            <Input ref={passwordRef} placeholder='Password' validationFunction={userValidations.password} secure={true} />
            <Button text="Login" onClick={handleLogin} styles={{ marginTop: 10 }} />
        </form>
    ), [userState.error])

    async function handleRegister() {
        const name = nameRef.current.value
        const email = emailRef.current.value
        const password = passwordRef.current.value

        if (!name || !email || !password) return // TODO: Error handling

        //@ts-ignore
        dispatch(registerUser({ name, email, password }))

    }

    async function handleLogin() {
        const email = emailRef.current.value
        const password = passwordRef.current.value
        if (!email || !password) return // TODO: Error handling
        //@ts-ignore
        dispatch(loginUser({ email, password }))
    }


    return (
        <div className={loginStyles.login_container}>
            <Navbar />
            <img src="images/login-logo.svg" alt="login logo" className={loginStyles.backgroundImage} />
            <div className={loginStyles.buttons}>
                <Button text="Login" onClick={() => setShowLogin(true)} />
                <Button text="Register" onClick={() => setShowRegister(true)} />
            </div>
            <Modal visible={showLogin} setVisible={setShowLogin}>
                {LoginForm}
            </Modal>
            <Modal visible={showRegister} setVisible={setShowRegister}>
                {RegisterForm}
            </Modal>
            <FullScreenLoading visible={userState.loading} />
        </div>
    )
}

export default Login
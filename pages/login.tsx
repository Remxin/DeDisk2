import React, { useState, useRef, MutableRefObject, useMemo } from 'react'
import Navbar from '@/src/layout/Navbar/Navbar'

// styles
import loginStyles from "../styles/Login.module.css"

// components
import Modal from '@/src/components/modals/Modal/Modal'
import Button from '@/src/components/forms/Button/Button'
import FormInput from '@/src/components/forms/FormInput/FormInput'
import FullScreenLoading from "@/src/components/modals/FullScreenLoading/FullScreenLoading"
import ErrorModal from "@/src/components/modals/ErrorModal/ErrorModal"

// lottie
import Lottie from 'lottie-react'
import LottieError from "@/public/lottie/error.json"

// redux
import { useDispatch, useSelector } from "react-redux"
import { registerUser, loginUser, resetError } from '@/src/features/userSlice'
import { RootState } from '@/src/config/reduxStore'

// validations
import { userValidations } from '@/src/validations/userData'
import { z } from 'zod'
import { otherValidations } from '@/src/validations/other'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { appConstants } from '@/src/constants/appConstants'
import { error } from 'console'

const registerSchema = z.object({ 
    name: z.string().min(3, { message: "Name must contain at least 3 characters"}).refine(v => !otherValidations.swearRegex().test(v), { message: "Please do not use swears in your name"}),
    email: z.string().email({message: "Please enter a valid email"}),
    password: z.string().min(6, { message: "Password must contain at least 6 characters"}).refine(v => userValidations.passwordRegex().test(v), { message: "Password must consist of number, special sign and capital letter"})
})

const loginSchema = z.object({
    email: z.string().email({message: "Please enter a valid email"}),
    password: z.string().min(6, { message: "Password must contain at least 6 characters"}).refine(v => userValidations.passwordRegex().test(v), { message: "Password must consist of number, special sign and capital letter"})
})

type UserRegisterSchemaT = z.infer<typeof registerSchema>
type UserLoginSchemaT = z.infer<typeof loginSchema>


const Login = () => {
    const { register: loginRegister, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors }} = useForm<UserLoginSchemaT>({
        resolver: zodResolver(loginSchema)
    })
    const { register: registerRegister, handleSubmit: handleRegisterSubmit, formState: { errors: registerErrors }} = useForm<UserRegisterSchemaT>({
        resolver: zodResolver(registerSchema)
    })
    const onLoginSubmit: SubmitHandler<UserLoginSchemaT> = (data) => { //@ts-ignore
        dispatch(loginUser({ email: data.email, password: data.password }))
    }
    const onRegisterSubmit: SubmitHandler<UserRegisterSchemaT> = (data) => { //@ts-ignore
        dispatch(registerUser({ name: data.name, email: data.email, password: data.password }))
    }
    
    // modals
    const [showLogin, setShowLogin] = useState(false)
    const [showRegister, setShowRegister] = useState(false)

    // other
    const dispatch = useDispatch()
    const userState = useSelector((state: RootState) => state.user)

    const RegisterForm = useMemo(() => (
        <form onSubmit={handleRegisterSubmit(onRegisterSubmit)} className={loginStyles.modal_form}>
            <img src="/images/logo.png" alt="logo" className={loginStyles.modal_logo}/>
            <h2 className={loginStyles.modal_title}>Register</h2>
            <FormInput register={registerRegister("name")} error={registerErrors.name?.message} placeholder='Name' id="name-register"/>
            <FormInput register={registerRegister("email")} error={registerErrors.email?.message} placeholder='Email' id="email-register"/>
            <FormInput register={registerRegister("password")} error={registerErrors.password?.message} placeholder='Password' type='password' id="password-register"/>
            <button type="submit" className={loginStyles.submit_button}>Login</button>
        </form>
    ), [userState.error, registerErrors])

    const LoginForm = useMemo(() => (
        <form onSubmit={handleLoginSubmit(onLoginSubmit)} className={loginStyles.modal_form}>
            <img src="/images/logo.png" alt="logo" className={loginStyles.modal_logo}/>
            <h2 className={loginStyles.modal_title}>Login</h2>
            <FormInput register={loginRegister("email")} error={loginErrors.email?.message} placeholder='Email' id="email-login"/>
            <FormInput register={loginRegister("password")} error={loginErrors.password?.message} placeholder='Password' type='password' id="password-login"/>
            <button type="submit" className={loginStyles.submit_button}>Login</button>

        </form>
    ), [userState.error, loginErrors])


    return (
        <div className={loginStyles.login_container}>
            <Navbar />
            <img src="/images/logo.png" alt=""  className={loginStyles.login_logo}/>
            <img src="images/login-logo.svg" alt="login logo" className={loginStyles.backgroundImage} />
            <div className={loginStyles.buttons}>
                <Button text="Login" onClick={() => setShowLogin(true)} />
                <Button text="Register" onClick={() => setShowRegister(true)} />
            </div>
            <Modal visible={showLogin} setVisible={setShowLogin} size={{ width: 300, height: 500 }}>
                {LoginForm}
            </Modal>
            <Modal visible={showRegister} setVisible={setShowRegister} size={{ width: 300, height: 500 }}>
                {RegisterForm}
            </Modal>
            <FullScreenLoading visible={userState.loading} />
            <ErrorModal visible={userState.error} setVisibleDispatch={resetError} size={{ width: 300, height: 500 }}>
                <div className={loginStyles.error_modal_container}>
                    <Lottie animationData={LottieError} loop={false}/>
                    <p>{userState.error}</p>
                </div>
            </ErrorModal>
        </div>
    )
}

export default Login
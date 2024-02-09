import React, { useState, useEffect } from 'react'

// form
import { InputHTMLAttributes } from 'react'
import { UseFormHandleSubmit, UseFormRegisterReturn, FieldError } from 'react-hook-form'

// styles
import inputStyles from "./Input.module.css"

// types
interface ComponentPropsT extends InputHTMLAttributes<HTMLInputElement> {
    register:  UseFormRegisterReturn<string>
    error: string | undefined
    input?: "text" | "number" | "email" | "password"
    placeholder?: string
    id?:string 

}

type BehaviorColorT = 'red' | "gray" | "purple"

const FormInput = ({ register, error, type = "text", placeholder = "", id = "" }: ComponentPropsT) => {
    if (!error) error = ""
    const [active, setActive] = useState(false)
    const [behaviorColor, setBehaviorColor] = useState<BehaviorColorT>("gray")
    
    useEffect(() => {
        if (error) setBehaviorColor("red")
    }, [error])

    function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
        setBehaviorColor("gray")
    }
    function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
        setBehaviorColor("purple")
        const value = e.target.value
        if (!value) setActive(false)
        else setActive(true)
    }

  return (
    <div className={inputStyles.input_container}>
        {active ? <p className={inputStyles.active_placeholder_text}>{placeholder}</p> : null}
        <input id={id} type={type} placeholder={placeholder} {...register}  className={inputStyles.input} onBlur={handleBlur} onInput={handleInput} style={{ borderColor: behaviorColor }}/>
        {error ? <p className={inputStyles.error_text}>{error}</p> : null}
    </div>
  )
}

export default FormInput
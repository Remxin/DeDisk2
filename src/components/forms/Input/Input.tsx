import React, { forwardRef, useState, Dispatch, useEffect } from 'react'

// styles
import inputStyles from "./Input.module.css"
// types
type componentProps = {
    style?: React.CSSProperties,
    inputStyle?: React.CSSProperties,
    placeholder?: string,
    parentError?: string,
    setParentError?: Dispatch<string>
    validationFunction?: (text: string) => string,
    secure?: boolean
}

const Input = React.forwardRef<HTMLInputElement, componentProps>(({ style, inputStyle, parentError = "", placeholder = "", validationFunction, setParentError, secure }, ref) => {
    const [error, setError] = useState(parentError)
    const [success, setSuccess] = useState(false)
    const [active, setActive] = useState(false)

    useEffect(() => {
        setError(parentError)
    }, [parentError])


    let behaviorColor = "gray"
    if (error) behaviorColor = "red"
    else if (success) behaviorColor = "green"

    function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
        setError("")
        setSuccess(false)
        const text = e.target.value
        let blurError = ""
        if (validationFunction) {
            blurError = validationFunction(text)
        }

        if (!blurError) setSuccess(true)
        else {
            setError(blurError)
            if (setParentError) setParentError(blurError)
        }
    }

    function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value
        setError("")
        setSuccess(false)
        if (!value) setActive(false)
        else setActive(true)
    }



    return (
        <div className={inputStyles.input_container} style={{ marginBottom: error ? 42 : 0 }}>
            {active ? <p className={inputStyles.active_placeholder_text}>{placeholder}</p> : null}
            <input className={inputStyles.input} ref={ref} placeholder={placeholder} onBlur={handleBlur} onInput={handleInput} style={{ borderColor: behaviorColor }} type={secure ? "password" : "text"} />
            {error ? <p className={inputStyles.error_text}>{error}</p> : null}
        </div>
    )
})


export default Input
import React from 'react'
import btnStyles from "./Button.module.css"

type componentProps = {
    className?: string
    text: string
    styles?: React.CSSProperties,
    onClick: () => any,
    disabled?: boolean
}

const Button = ({ className, text, styles, onClick, disabled = false }: componentProps) => {

    return (
        <button className={btnStyles.button} style={styles} onClick={onClick} disabled={disabled} type="button">{text}</button>
    )
}

export default Button
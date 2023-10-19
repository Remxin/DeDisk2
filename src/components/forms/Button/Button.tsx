import React from 'react'
import btnStyles from "./Button.module.css"

type componentProps = {
    className?: string
    text: string
    styles?: React.CSSProperties,
    onClick: () => any
}

const Button = ({ className, text, styles, onClick }: componentProps) => {
    return (
        <div className={btnStyles.button} style={styles} onClick={onClick}>{text}</div>
    )
}

export default Button
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import modalStyles from "./Modal.module.css"

const modalVariants = {
    initial: {
        opacity: 0
    },
    animate: {
        opacity: 1
    }
}
const modalContentVariants = {
    initial: {
        opacity: 0.6,
        scale: 0.5
    },
    animate: {
        opacity: 1,
        scale: 1
    }
}

type componentProps = {
    children: JSX.Element | JSX.Element[],
    visible: boolean
    setVisible: React.Dispatch<boolean>
    className?: string
    size?: { width: number | string, height: number | string }
}

const Modal = ({ children, visible, setVisible, className, size = { width: "80%", height: "80%"} }: componentProps) => {

    function handleVisibility(e: React.MouseEvent) {
        if (e.currentTarget === e.target) setVisible(false)
        
    }
console.log(visible)
    return (
        <AnimatePresence>
            {visible &&
                <motion.div variants={modalVariants} className={`${modalStyles.modal} ${className}`} onClick={handleVisibility} initial="initial" animate="animate" exit="initial" >
                    <motion.div variants={modalContentVariants} className={modalStyles.modal_content} initial="initial" animate="animate" exit="initial" style={{ width: size?.width, height: size?.height}}>
                        {children}
                    </motion.div>
                </motion.div>
            }
        </AnimatePresence>
    )
}

export default Modal
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'


import { useDispatch } from 'react-redux'

import modalStyles from "./ErrorModal.module.css"

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
    size?: { width: number | string, height: number | string}
    setVisible?: React.Dispatch<boolean>
    setVisibleDispatch?: () => any
}

const Modal = ({ children, visible, size = { width: "80%", height: "80%" }, setVisible, setVisibleDispatch}: componentProps) => {
    const dispatch = useDispatch()
    function handleVisibility(e: React.MouseEvent) {
        if (e.currentTarget === e.target) {
            if (setVisible) return setVisible(false)
            if (setVisibleDispatch) {
                dispatch(setVisibleDispatch())
            } 
        }
    }
    return (
        <AnimatePresence>
            {visible &&
                <motion.div variants={modalVariants} className={modalStyles.modal} onClick={handleVisibility} initial="initial" animate="animate" exit="initial" >
                    <motion.div variants={modalContentVariants} className={modalStyles.modal_content} initial="initial" animate="animate" exit="initial" style={{ width: size.width, height: size.height }}>
                        {children}
                    </motion.div>
                </motion.div>
            }
        </AnimatePresence>
    )
}

export default Modal
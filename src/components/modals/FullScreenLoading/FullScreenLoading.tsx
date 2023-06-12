import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Lottie from "lottie-react"
import squareLoading from "../../../../public/lottie/loading.json"

import modalStyles from "./FullScreenLoading.module.css"

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

    visible: boolean

}

const Modal = ({ visible }: componentProps) => {
    return (
        <AnimatePresence>
            {visible &&
                <motion.div variants={modalVariants} className={modalStyles.modal} initial="initial" animate="animate" exit="initial">
                    <motion.div variants={modalContentVariants} className={modalStyles.modal_content} initial="initial" animate="animate" exit="initial">
                        <Lottie animationData={squareLoading} />
                        Loading...
                    </motion.div>
                </motion.div>
            }
        </AnimatePresence>
    )
}

export default Modal
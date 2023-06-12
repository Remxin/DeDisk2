import React, { useState, useContext } from 'react'

// components
import { BsArrowRightCircle, BsPlusSquareFill } from "react-icons/bs"

// styles
import styles from "./RightMenu.module.css"

// animations
import { motion, useAnimationControls } from "framer-motion"


// variants
const menuVariants = {
    shrunk: {
        width: 80
    },

    extended: {
        width: 200
    }
}

const arrowVariants = {
    normal: {
        rotate: 0,
        transition: {
            duration: .2
        }
    },

    rotate: {
        rotate: 180,
        transition: {
            duration: .2
        }
    }
}

const optionsListVariants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: .1
        }
    }
}

const optionVariants = {
    initial: {
        opacity: 0,
        left: -10
    },
    animate: {
        opacity: 1,
        left: 0
    }
}

const RightMenu = () => {
    const menuControlls = useAnimationControls()
    const arrowControlls = useAnimationControls()
    const [selected, setSelected] = useState("My drive")

    const [extended, setExtended] = useState(false)

    function manageSize() {
        if (extended) {
            setExtended(false)
            menuControlls.start("shrunk")
            arrowControlls.start("normal")
        } else {
            setExtended(true)
            menuControlls.start("extended")
            arrowControlls.start("rotate")
        }
    }

    return (
        <motion.div variants={menuVariants} className={styles.container} initial="shrunk" animate={menuControlls}>
            <motion.button onClick={manageSize} className={styles.arrow_button} variants={arrowVariants} initial="normal" animate={arrowControlls}>
                <BsArrowRightCircle />
            </motion.button>
            {extended ? (
                <>
                    <motion.button variants={optionVariants} initial="initial" animate="animate">
                        <BsPlusSquareFill /> New
                    </motion.button>
                    <motion.div variants={optionsListVariants} initial="initial" animate="animate" className={styles.options_container}>
                        <motion.button style={{ backgroundColor: selected === "My drive" ? "#C996CC" : "#C996CC88" }} variants={optionVariants} onClick={() => setSelected("My drive")}>My drive</motion.button>
                        <motion.button style={{ backgroundColor: selected === "Last" ? "#C996CC" : "#C996CC88" }} variants={optionVariants} onClick={() => setSelected("Last")}>Last</motion.button>
                        <motion.button style={{ backgroundColor: selected === "Shared to me" ? "#C996CC" : "#C996CC88" }} variants={optionVariants} onClick={() => setSelected("Shared to me")}>Shared to me</motion.button>
                    </motion.div>
                </>
            )
                : null}
        </motion.div>
    )
}

export default RightMenu
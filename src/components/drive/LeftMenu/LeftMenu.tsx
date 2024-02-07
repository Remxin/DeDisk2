import React, { useState, useContext } from 'react'

// icons
import { BsArrowRightCircle, BsPlusSquareFill, BsFillHeartFill } from "react-icons/bs"
import { BiSolidStar, BiSolidTime, BiSolidShareAlt } from "react-icons/bi"

// components
import FreeSpace from '../FreeSpace/FreeSpace'
import Button from '../../forms/Button/Button'
import Modal from '../../modals/Modal/Modal'
import PlanCard from '../PlanCard/PlanCard'
import CreateMenu from '../CreateMenu/CreateMenu'

// styles
import styles from "./LeftMenu.module.css"

// animations
import { motion, useAnimationControls } from "framer-motion"

// context
import { DriveContext } from '@/src/contexts/DriveContext'

// navigation
import Link from 'next/link'


// variants
import { menuVariants, arrowVariants, optionVariants, optionsListVariants, buttonVariants } from './variants'
import { appConstants } from '@/src/constants/appConstants'


const RightMenu = () => {
    // for additional data
    const { data } = useContext(DriveContext)

    // for animations
    const menuControlls = useAnimationControls()
    const arrowControlls = useAnimationControls()

    const selected = data.data.searchType

    const [extended, setExtended] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showChoosePlan, setShowChoosePlan] = useState(false)



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
                    <div className={styles.new_button_container}>
                        <motion.button variants={optionVariants} initial="initial" animate="animate" className={styles.new_button} onClick={() => setShowNew(true)}>
                            <BsPlusSquareFill /> New
                        </motion.button>
                        <CreateMenu visible={showNew} setVisible={setShowNew} />
                    </div>
                    <motion.div variants={optionsListVariants} initial="initial" animate="animate" className={styles.options_container}>
                        <Link href={`${appConstants.clientUrl}/drive`}><motion.button style={{ backgroundColor: selected === "" ? "#C996CC" : "#C996CC88" }} variants={optionVariants} onClick={() => null}><BiSolidStar/>My drive</motion.button></Link>
                        <Link href={`${appConstants.clientUrl}/drive?search=favourites`}><motion.button style={{ backgroundColor: selected === "favourites" ? "#C996CC" : "#C996CC88" }} variants={optionVariants} onClick={() => null}><BsFillHeartFill/>Favourites</motion.button></Link>
                        <Link href={`${appConstants.clientUrl}/drive?search=shared`}><motion.button style={{ backgroundColor: selected === "shared" ? "#C996CC" : "#C996CC88" }} variants={optionVariants} onClick={() => null}><BiSolidShareAlt/>Shared to me</motion.button></Link>
                    </motion.div>
                    <FreeSpace plan="15_GB" usedSpace='5_GB' />
                    <motion.div variants={buttonVariants} initial="initial" animate="animate">
                        <Button text="Change Plan" onClick={() => setShowChoosePlan(true)} />
                    </motion.div>
                </>
            )
                : null}
            <Modal visible={showChoosePlan} setVisible={setShowChoosePlan} className={styles.plan_modal} size={{ height: 300, width: 300 }}>
                <h2>Choose plan </h2>
                <div className={styles.plan_cards}>
                    <PlanCard plan="15GB" price="10zł" />
                    <PlanCard plan="50GB" price="25zł" />
                    <PlanCard plan="100GB" price="35zł" />
                </div>
            </Modal>
        </motion.div>
    )
}

export default RightMenu
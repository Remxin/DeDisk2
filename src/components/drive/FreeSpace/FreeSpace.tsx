import React, { MutableRefObject, useRef, useEffect } from 'react'

// componenst
import { BsFillCloudyFill } from "react-icons/bs"

// styles
import styles from "./FreeSpace.module.css"

// animations
import { motion, useAnimationControls } from 'framer-motion'

// helpers
import { getBytes } from '@/helpers/data/size'

// types
type ComponentProps = {
    plan: string
    usedSpace: string
}

// variants
const containerVariants = {
    initial: {
        opacity: 0
    },
    animate: {
        opacity: 1,
        transition: {
            delay: .3
        }
    }
}

const FreeSpace = ({ plan, usedSpace }: ComponentProps) => {
    const usedSpaceControlls = useAnimationControls()
    const allSpaceRef = useRef() as MutableRefObject<HTMLDivElement>

    useEffect(() => {
        if (!allSpaceRef.current) return
        setTimeout(() => {
            const percent = Math.round((getBytes(usedSpace) / getBytes(plan)) * 100) / 100
            const usedSpaceWidth = Math.round(allSpaceRef.current.clientWidth * percent)

            usedSpaceControlls.start({ width: usedSpaceWidth })
        }, 300)


    }, [allSpaceRef?.current, allSpaceRef?.current?.clientWidth])

    return (
        <motion.div className={styles.space_container} variants={containerVariants} initial="initial" animate="animate">
            <div className={styles.index_container}>
                <p className={styles.text}><BsFillCloudyFill /> Your space</p>
                <div className={styles.all_space} ref={allSpaceRef}>
                    <motion.div className={styles.used_space} animate={usedSpaceControlls} initial={{ width: 0 }}></motion.div>
                </div>
            </div>
            <p className={styles.information}>Used {usedSpace.replace("_", "")} of {plan.replace("_", "")} space</p>
        </motion.div>
    )
}

export default FreeSpace
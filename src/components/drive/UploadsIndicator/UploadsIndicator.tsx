import { useContext, useEffect, useState } from 'react'
import { DriveContext } from '@/src/contexts/DriveContext'

// icons
import { BsArrowDownCircleFill } from 'react-icons/bs'

// styles
import styles from "./UploadsIndicator.module.css"

// helpers
import { getBytesString } from '@/helpers/data/size'

// animations
import { motion, useAnimation } from 'framer-motion'
import { containerVariants, arrowVariants } from './animationVariants'


const UploadsIndicator = () => {
    // key states
    const { data } = useContext(DriveContext)
    const [visible, setVisible] = useState(false)

    // animation controlls
    const containerControlls = useAnimation()
    const arrowControlls = useAnimation()

    // functions
    function handleArrowClick() {
        if (visible) {
            containerControlls.start("initial")
            arrowControlls.start("initial")
        } else {
            containerControlls.start("animate")
            arrowControlls.start("animate")
        }
        setVisible(p => !p)
    }

    // useEffect (show on file upload)
    useEffect(() => {
        if (data.uploads.length > 0) {
            setVisible(true)
            containerControlls.start('animate')
            arrowControlls.start("animate")
        }
    }, [JSON.stringify(data.uploads)])

    // render
    return (
        <motion.div className={styles.container} variants={containerVariants} initial='initial' animate={containerControlls}>
            <motion.button className={styles.arrow} onClick={handleArrowClick} variants={arrowVariants} initial="initial" animate={arrowControlls}><BsArrowDownCircleFill/></motion.button>
            {visible && data.uploads.map((u, i) => (
                <div key={i}>
                    <p>{u.file}</p>
                    <span>
                        <progress value={u.loaded} max={u.total}></progress>
                        {Math.round(u.loaded/u.total * 100) + "%"}
                    </span>
                    <p>{getBytesString(u.loaded, 1)} / {getBytesString(u.total, 1)}</p>
                </div>
            ))}
        </motion.div>
    )
}

export default UploadsIndicator
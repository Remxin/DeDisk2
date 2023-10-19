import React from 'react'

import styles from ".//PlanCard.module.css"
import { motion } from 'framer-motion'

const containerVariants = {
    initial: {
        opacity: 0
    },
    animate: {
        opacity: 1
    }
}

type componentProps = {
    price: string
    plan: string
}


const PlanCard = ({ price, plan }: componentProps) => {
    return (
        <motion.div className={styles.card} variants={containerVariants} initial="initial" animate="animate">
            <h3>{plan}</h3>
            <p>{price} (per month)</p>
            <button className={styles.button}>Buy</button>
        </motion.div>
    )
}

export default PlanCard
import Navbar from '@/src/layout/Navbar/Navbar'
import React from 'react'

// components
import RightMenu from '@/src/components/drive/RightMenu/RightMenu'

// styles
import styles from "@/styles/drive/Drive.module.css"

const Path = () => {

    return (
        <>
            <Navbar />
            <div className={styles.drive}>
                <RightMenu />
            </div>
        </>
    )
}

export default Path
import React, { Dispatch, useContext, useState } from 'react'

// components
import Modal from '../../modals/Modal/Modal'

// context
import { DriveContext } from '@/src/contexts/DriveContext'

import styles from "./CreateMenu.module.css"
type componentProps = {
    visible: boolean
    setVisible: Dispatch<boolean>
}


const CreateMenu = ({ visible, setVisible }: componentProps) => {
    //@ts-ignore
    const { dispatch, setCreateFolder, data } = useContext(DriveContext)

    function handleCreation() {
        setCreateFolder(true)
        setVisible(false)
    }
   
    if (!visible) return <></>
    return (
        <>
            <div className={styles.background} onClick={() => setVisible(false)}>
            </div>
            <div className={styles.container}>
                <ul>
                    <li onClick={handleCreation}>Create folder</li>
                    <hr />
                    <li>Send file</li>
                    <li>Send Folder</li>
                </ul>
            </div>
        </>
    )
}

export default CreateMenu
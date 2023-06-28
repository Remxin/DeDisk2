import React, { Dispatch, useContext, useState } from 'react'


// icons
import { BiSolidFolderPlus, BiSolidFilePlus } from "react-icons/bi"
import { BsFileEarmarkArrowUpFill, BsFolderSymlinkFill } from "react-icons/bs"

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
                    <li onClick={handleCreation}><BiSolidFolderPlus/>Create folder</li>
                    <hr />
                    <li><BsFileEarmarkArrowUpFill/>Send file</li>
                    <li><BsFolderSymlinkFill/> Folder</li>
                </ul>
            </div>
        </>
    )
}

export default CreateMenu
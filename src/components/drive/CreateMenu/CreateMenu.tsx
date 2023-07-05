import React, { Dispatch, useContext, useState, useRef, MutableRefObject, ReactEventHandler } from 'react'


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
    const fileInputRef = useRef() as MutableRefObject<HTMLInputElement>

    function handleCreation() {
        setCreateFolder(true)
        setVisible(false)
    }

    function handleFileSelect() {
        fileInputRef.current.click()
    }

    function handleFileSend(e: React.ChangeEvent) {
        // @ts-ignore
        const files = e.target.files

        if (!files) return
        const formData = new FormData()

        // @ts-ignore
        Array.from(files).forEach((f: File, i: number) => {
            formData.append(`File${i}`, f)
        })
        console.log(formData)
        dispatch({ type: "sendFile", payload: formData})

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
                    <li onClick={handleFileSelect}><BsFileEarmarkArrowUpFill/>Send file</li>
                    <input type="file" className={styles.image_input} ref={fileInputRef} multiple onChange={handleFileSend}/>
                    <li><BsFolderSymlinkFill/> Folder</li>
                </ul>
            </div>
        </>
    )
}

export default CreateMenu
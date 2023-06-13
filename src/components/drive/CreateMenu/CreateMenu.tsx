import React, { Dispatch } from 'react'

import styles from "./CreateMenu.module.css"
type componentProps = {
    visible: boolean
    setVisible: Dispatch<boolean>
}


const CreateMenu = ({ visible, setVisible }: componentProps) => {
    if (!visible) return <></>
    return (
        <>
            <div className={styles.background} onClick={() => setVisible(false)}>
            </div>
            <div className={styles.container}>
                <ul>
                    <li>Create folder</li>
                    <hr />
                    <li>Send file</li>
                    <li>Send Folder</li>
                </ul>
            </div>
        </>
    )
}

export default CreateMenu
import Navbar from '@/src/layout/Navbar/Navbar'
import React, {  } from 'react'

// components
import RightMenu from '@/src/components/drive/RightMenu/RightMenu'
import FolderContent from '@/src/components/drive/FolderContent/FolderContent'

// styles
import styles from "@/styles/drive/Drive.module.css"

// hooks
import { useDrive } from '@/src/hooks/useDrive'


const Path = () => {

    const { data, dispatch } = useDrive()


    return (
        // @ts-ignor
        <>
            <Navbar />
            <div className={styles.drive}>
                <RightMenu />
                <FolderContent content={data.data.folderContent}/>
            </div>
        </>
    )
}

export default Path
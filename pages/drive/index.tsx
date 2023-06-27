import Navbar from '@/src/layout/Navbar/Navbar'

// components
import RightMenu from '@/src/components/drive/RightMenu/RightMenu'
import FolderContent from '@/src/components/drive/FolderContent/FolderContent'

// styles
import styles from "@/styles/drive/Drive.module.css"

// hooks
import { useDrive } from '@/src/hooks/useDrive'

// context
import DriveContextProvider from '@/src/contexts/DriveContext'


const Path = () => {

    return (
        <DriveContextProvider>
            <Navbar />
            <div className={styles.drive}>
                <RightMenu />
                <FolderContent/>
            </div>
        </DriveContextProvider>
    )
}

export default Path
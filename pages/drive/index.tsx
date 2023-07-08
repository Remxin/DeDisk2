import Navbar from '@/src/layout/Navbar/Navbar'

// components
import RightMenu from '@/src/components/drive/RightMenu/RightMenu'
import FolderContent from '@/src/components/drive/FolderContent/FolderContent'
import UploadsIndicator from '@/src/components/drive/UploadsIndicator/UploadsIndicator'

// styles
import styles from "@/styles/drive/Drive.module.css"

// hooks
import { useDrive } from '@/src/hooks/useDrive'

// context
import DriveContextProvider from '@/src/contexts/DriveContext'
import { useSearchParams } from "next/navigation"


const Path = () => {
    
    return (
        <DriveContextProvider>
            <Navbar />
            <div className={styles.drive}>
                <RightMenu />
                <FolderContent/>
            </div>
            <UploadsIndicator/>
        </DriveContextProvider>
    )
}

export default Path
import SharedDriveContent from '@/src/components/sharedDrive/SharedDriveContent'
import SharedDriveFolderIndicator from '@/src/components/sharedDrive/SharedDriveFolderIndicator'
import { SharedDriveContextProvider } from '@/src/contexts/ShareDriveContext'
import React from 'react'

import styles from "@/styles/shared/Shared.module.css"

const Shared = () => {
    
  return (
    <div className={styles.page_container}>
      <SharedDriveContextProvider>
        <SharedDriveFolderIndicator/>
        <SharedDriveContent/>
      </SharedDriveContextProvider>
    </div>
  )
}

export default Shared
import SharedDriveFolderIndicator from '@/src/components/sharedDrive/SharedDriveFolderIndicator'
import { SharedDriveContextProvider } from '@/src/contexts/ShareDriveContext'
import React from 'react'

const Shared = () => {
    
  return (
    <div>
      <SharedDriveContextProvider>
        <SharedDriveFolderIndicator/>
      </SharedDriveContextProvider>
    </div>
  )
}

export default Shared
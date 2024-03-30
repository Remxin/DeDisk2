import React from 'react'
import { useSharedDriveContext } from '../contexts/ShareDriveContext'

const useSharedDrive = () => {
    const context = useSharedDriveContext()

    async function moveToPath(newPath: string) {

    }

    return { ...context, moveToPath }
}

export default useSharedDrive
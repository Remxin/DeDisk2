import React, { useEffect} from 'react'
import { useSharedDriveContext } from '../contexts/ShareDriveContext'
import { appConstants } from '../constants/appConstants'


const useSharedDrive = () => {
    const context = useSharedDriveContext()

    async function moveToPath(newPath: string) {
        const res = await fetch(`${appConstants.serverUrl}/api/shared?token=${context.token}&path=${context.path}`)
        const resData = await res.json()
        context.setContent(resData.data)
    }

    useEffect(() => {
        if (!context.token || !context.path) return
        moveToPath(context.path)
    }, [context.token])

    return { ...context, moveToPath }
}

export default useSharedDrive
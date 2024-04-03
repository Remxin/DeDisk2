import React, { useEffect} from 'react'
import { useSharedDriveContext } from '../contexts/ShareDriveContext'
import { appConstants } from '../constants/appConstants'


const useSharedDrive = () => {
    const context = useSharedDriveContext()

    async function moveToPath(newPath: string) {
        newPath = newPath.replaceAll("/", "%2F")
        const res = await fetch(`${appConstants.serverUrl}/api/shared?token=${context.token}&path=${newPath}`)
        const resData = await res.json()
        context.setContent(resData.data)
    }

    useEffect(() => {
        if (!context.token || !context.path) return
        moveToPath(context.path)
    }, [context.path, context.token])

    console.log(context)

    return { ...context, moveToPath }
}

export default useSharedDrive
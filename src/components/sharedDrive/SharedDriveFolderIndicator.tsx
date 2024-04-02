import React, { useEffect} from 'react'
import styles from "./SharedDriveFolderIndicator.module.css"

import { useSearchParams } from 'next/navigation'
import { useSharedDriveContext } from '@/src/contexts/ShareDriveContext'
import { useRouter } from 'next/router'
import useSharedDrive from '@/src/hooks/useSharedDrive'
import { updateQuery } from './helpers'




const SharedDriveFolderIndicator = () => {
   const context = useSharedDrive()
  const searchParams = useSearchParams()
  const router = useRouter()

   let path = context.path! as string
   path.length > 1 ? path = path.slice(0, -1) : null

  function getProperPath(newPath: string) {
    let pathParts = context.path.split("/")
    let newPathIndex = pathParts.findIndex((e) => e === newPath)
    let slicedPath = pathParts.slice(0, newPathIndex+1)
    return slicedPath.join('/') + "/"
  }


 return (
   <div className={styles.container}>
     <div className={styles.path_container}>
        { path.length > 1 ? 
          path.split("/").map((e, i) => (
            <span key={i} onClick={() => updateQuery(router, "path", getProperPath(e))} className={styles.path_part}>{e}/</span>
        )) : <span onClick={() => updateQuery(router, "path", "/")} className={styles.path_part}>{path}</span>}
     </div>
   </div>
 )
}

export default SharedDriveFolderIndicator


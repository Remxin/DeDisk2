import React, { useEffect} from 'react'
import styles from "./SharedDriveFolderIndicator.module.css"

import { useRouter } from 'next/router'
import { useSearchParams } from 'next/navigation'
import { useSharedDriveContext } from '@/src/contexts/ShareDriveContext'
import useSharedDrive from '@/src/hooks/useSharedDrive'



const SharedDriveFolderIndicator = () => {
   const context = useSharedDrive()
  



    useEffect(() => {
    }, [])
    
   const path = context.path


 return (
   <div className={styles.container}>
     <span className={styles.path_container}>
        { path.length > 1 ? 
          path.split("/").map((e, i) => (
            <span key={i} onClick={() => context.moveToPath(e)} className={styles.path_part}>{e}/</span>
        )) : <span onClick={() => context.moveToPath("/")} className={styles.path_part}>{path}</span>}
     </span>
   </div>
 )
}

export default SharedDriveFolderIndicator


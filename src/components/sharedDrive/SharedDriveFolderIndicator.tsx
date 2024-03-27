import React, { useEffect} from 'react'
import styles from "./SharedDriveFolderIndicator.module.css"

import { useRouter } from 'next/router'
import { useSearchParams } from 'next/navigation'



const SharedDriveFolderIndicator = () => {
    const router = useRouter()
    const searchParams= useSearchParams()
    const path = searchParams.get("path")


    useEffect(() => {
        if (!path) router.push("/login")
    }, [])
    


 return (
   <div className={styles.container}>
     <span>
        {/* { path.length > 1 ? 
          path.split("/").map((e, i) => (
            <span key={i} onClick={() => handleOnClick(e, i)} className={styles.path_part}>{e}/</span>
        )) : <span onClick={() => handleOnClick("/", 0)} className={styles.path_part}>{path}</span>} */}
     </span>
   </div>
 )
}

export default SharedDriveFolderIndicator


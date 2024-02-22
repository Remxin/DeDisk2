import React, { useContext } from 'react'

// context
import { DriveContext } from '@/src/contexts/DriveContext'

// styles
import styles from "./CurrentFolderIndicator.module.css"

const CurrentFolderIndicator = () => {
     const { data, dispatch } = useContext(DriveContext)
     let currentFolder = data.data.currentFolder ? data.data.currentFolder : ""
     
     function handleOnClick(e: string, i: number) {
       if (i === 0) return dispatch({ type: "move", payload: "/"})
       const pathParts = currentFolder.split("/")
       const newPathParts = pathParts.slice(0, i + 1)
       const newPath = "/" + newPathParts.join("/")
      dispatch({ type: "move", payload: newPath.slice(1)})
     }
 
  return (
    <div className={styles.container}>
      <span>
        { currentFolder.length > 1 ? 
          currentFolder.split("/").map((e, i) => (
            <span key={i} onClick={() => handleOnClick(e, i)} className={styles.path_part}>{e}/</span>
        )) : <span onClick={() => handleOnClick("/", 0)} className={styles.path_part}>{currentFolder}</span>}
      </span>
    </div>
  )
}

export default CurrentFolderIndicator
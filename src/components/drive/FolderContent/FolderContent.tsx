import { MutableRefObject, useContext, useEffect, useRef } from 'react'

// icons
import { BiSolidFolder } from "react-icons/bi"

// components
import ClickableInstance from '../ClickableInstance/ClickableInstance'
import CurrentFolderIndicator from '../CurrentFolderIndicator/CurrentFolderIndicator'

// context
import { DriveContext } from '@/src/contexts/DriveContext'

// styles
import styles from "./FolderContent.module.css"

// helpers
import { getFileIcon } from './helpers'

// types


const FolderContent = () => {
  const { createFolder, setCreateFolder, data, dispatch } = useContext(DriveContext)
  // console.log(data)
  const content = data.data.folderContent
  const folderInputRef = useRef() as MutableRefObject<HTMLInputElement>

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    if (!e.target.value) return setCreateFolder(false) 
  }

  function handleKeyEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return
    //@ts-ignore
    if (!e.target.value) return setCreateFolder(false)
    
    // @ts-ignore
    const newFolderPath = data.data.currentFolder + "/" + e.target.value
 
    dispatch({ type: "createDir", payload: newFolderPath})
    setCreateFolder(false)
  }

  useEffect(() => {
    if (createFolder) return folderInputRef.current.focus()
  }, [createFolder])
  return (
    <div className={styles.container}>
      <CurrentFolderIndicator/>
        <ul className={styles.element_list}>
        {content.map((c, i) => (
           <ClickableInstance name={c.name} type={c.type} key={i}/>
        ))}
        {createFolder ? <li className={styles.element}> <BiSolidFolder/><input placeholder='Folder name' ref={folderInputRef} onBlur={handleBlur} onKeyDown={handleKeyEnter}/></li> : null}
        </ul>
    </div>
  )
}

export default FolderContent
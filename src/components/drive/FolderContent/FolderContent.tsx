import { MutableRefObject, useContext, useEffect, useRef } from 'react'
import { BiSolidFolder } from "react-icons/bi"

// context
import { DriveContext } from '@/src/contexts/DriveContext'

// styles
import styles from "./FolderContent.module.css"

// helpers
import { getFileIcon } from './helpers'

// types


const FolderContent = () => {
  const { createFolder, setCreateFolder, data, dispatch } = useContext(DriveContext)
  const content = data.data.folderContent
  console.log(data)
  const folderInputRef = useRef() as MutableRefObject<HTMLInputElement>

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    if (!e.target.value) return setCreateFolder(false) 
  }

  function handleKeyEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") return
    //@ts-ignore
    if (!e.target.value) return setCreateFolder(false)
    
    // @ts-ignore
    dispatch({ type: "createDir", payload: e.target.value})
    setCreateFolder(false)
  }

  useEffect(() => {
    if (createFolder) return folderInputRef.current.focus()
  }, [createFolder])
  return (
    <div className={styles.container}>
        <ul className={styles.element_list}>
        {content.map((c) => (
            <li className={styles.element} key={Math.random()* 55}>{c.type === "folder" ? <BiSolidFolder/> : getFileIcon(c.name)} {c.name}</li>
        ))}
        {createFolder ? <li className={styles.element}> <BiSolidFolder/><input placeholder='Folder name' ref={folderInputRef} onBlur={handleBlur} onKeyDown={handleKeyEnter}/></li> : null}
        </ul>
    </div>
  )
}

export default FolderContent
import { MutableRefObject, useContext, useEffect, useRef, useState } from 'react'

// icons
import { BiSolidFolder } from "react-icons/bi"

// components
import ClickableInstance from '../ClickableInstance/ClickableInstance'
import CurrentFolderIndicator from '../CurrentFolderIndicator/CurrentFolderIndicator'
import ContextMenuModal from '../ContextMenuModal/ContextMenuModal'

// context
import { DriveContext } from '@/src/contexts/DriveContext'

// styles
import styles from "./FolderContent.module.css"

// helpers
import { getFileIcon } from './helpers'

// types
export type ContextActionType = "" | "rename" | "details" | "delete"


const FolderContent = () => {
  const { createFolder, setCreateFolder, data, dispatch } = useContext(DriveContext)

  // edit object
  
  const content = data.data.folderContent
  const folderInputRef = useRef() as MutableRefObject<HTMLInputElement>
  
  // ___ for clickable instance ___
  // ____ for custom context
  const [customContext, setCustomContext] = useState({ show: false, x: 0, y: 0, value: ""})
  const [contextAction, setContextAction] = useState<ContextActionType>("")
  
  function handleRightClick(e: React.MouseEvent, value: string) {
    e.preventDefault()
    setCustomContext({ show: true, x: e.clientX, y: e.clientY, value })
  }
 

  function resetContextActions() {
    setCustomContext({ show: false, x: 0, y: 0, value: ""})
    setContextAction("")
  }
  function handleContextBlur(e: React.TouchEvent) {
    //@ts-ignore
    if (e.target.dataset?.action) {
      //@ts-ignore
        setContextAction(e.target.dataset.action)
        setCustomContext(p => ({ ...p, show: false }))
    } else {
      setCustomContext(p => ({ ...p, show: false, value: "" }))
      setContextAction("")
    }

  }

  // handle delete and get info
  useEffect(() => {
    if (!contextAction || contextAction === "rename" || !customContext.value) return

    if (contextAction === "delete") { // delete structure
      let target = null
      if (data.data.currentFolder === "/") target = customContext.value
      else {
        console.log(data.data.currentFolder)
        target = (data.data.currentFolder.slice(1) + "/").replaceAll("/", "|") + customContext.value
      }

      dispatch({ type: "delete", payload: { target }})
    } else if (contextAction === "details") {

    }
  }, [contextAction])




  // ___ for folder creation ___
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
          //@ts-ignore
           <ClickableInstance name={c.name} type={c.type} key={i} handleRightClick={handleRightClick} edit={contextAction === "rename" && customContext.value === c.name} handleInputBlur={resetContextActions}/>
        ))}
        {createFolder ? <li className={styles.element}> <BiSolidFolder/><input placeholder='Folder name' ref={folderInputRef} onBlur={handleBlur} onKeyDown={handleKeyEnter}/></li> : null}
        </ul>
        { customContext.show && <ContextMenuModal x={customContext.x} y={customContext.y} setVisible={handleContextBlur} />}
    </div>
  )
}

export default FolderContent
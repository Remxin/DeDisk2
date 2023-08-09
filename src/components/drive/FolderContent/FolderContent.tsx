import { MutableRefObject, useContext, useEffect, useRef, useState } from 'react'

// icons
import { BiSolidFolder } from "react-icons/bi"

// components
import ClickableInstance from '../ClickableInstance/ClickableInstance'
import BasicInstance from "../ClickableInstance/BasicInstance"
import CurrentFolderIndicator from '../CurrentFolderIndicator/CurrentFolderIndicator'
import ContextMenuModal from '../ContextMenuModal/ContextMenuModal'

// context
import { DriveContext } from '@/src/contexts/DriveContext'

// styles
import styles from "./FolderContent.module.css"

// helpers
import { getFileIcon } from './helpers'
import Modal from '../../modals/Modal/Modal'
import { getBytesString, getStringBytesFromUnit } from '@/helpers/data/size'

// types
export type ContextActionType = "" | "rename" | "details" | "delete" | "add to favourites" | "share"


const FolderContent = () => {
  const { createFolder, setCreateFolder, data, dispatch, queryProps } = useContext(DriveContext)

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
        target = (data.data.currentFolder.slice(1) + "/").replaceAll("/", "|") + customContext.value
      }

      dispatch({ type: "delete", payload: { target }})
    } else if (contextAction === "details") {
      let target = null
      if (data.data.currentFolder === "/") target = customContext.value
      else {
        target = (data.data.currentFolder.slice(1) + "/").replaceAll("/", "|") + customContext.value
      }

      dispatch({ type: "informations", payload: { target }})
      
    } else if (contextAction === "add to favourites") {
      const instance = data.data.folderContent.find(e => e.name === customContext.value)
      if (!instance) return
      dispatch({ type: "add to favourites", payload: { path: data.data.currentFolder, fileName: instance.name, type: instance.type }})

    } else if (contextAction === "share") {
      
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
        {data.data.searchType === "" && content.map((c, i) => (
          //@ts-ignore
           <ClickableInstance name={c.name} type={c.type} key={i} handleRightClick={handleRightClick} edit={contextAction === "rename" && customContext.value === c.name} handleInputBlur={resetContextActions}/>
        ))}
        { data.data.searchType === "favourites" && content.map((c, i) => (
          //@ts-ignore
          <BasicInstance name={c.name} type={c.type} date={c.date} path={c.path} key={i}/>
        ))}
        {createFolder ? <li className={styles.element}> <BiSolidFolder/><input placeholder='Folder name' ref={folderInputRef} onBlur={handleBlur} onKeyDown={handleKeyEnter}/></li> : null}
        </ul>
        { customContext.show && <ContextMenuModal x={customContext.x} y={customContext.y} setVisible={handleContextBlur} />}
        {/* informations modal */}
        <Modal visible={!!data.data.additionalData?.type} setVisible={() => dispatch({ type: "clear additional data" })} size={{ width: "90vw", height: "90vw"}}>
          <h2 className={styles.infoTitle}>File informations</h2>
          <table className={styles.infoTable}>
            <tbody>
              <tr>
                <td>name</td>
                <td>{data.data.additionalData?.name}</td>
              </tr>
              <tr>
                <td>path</td>
                <td>{data.data.currentFolder}</td>
              </tr>
              <tr>
                <td>size</td>
                <td>{getStringBytesFromUnit("B", data.data.additionalData?.size!, 1)}</td>
              </tr>
              <tr>
                <td>extension</td>
                <td>{data.data.additionalData?.extension}</td>
              </tr>
              <tr>
                <td>last modified</td>
                {/* @ts-ignore */}
                <td>{new Date(data.data.additionalData?.atime).toDateString()}</td>
              </tr>
              <tr>
                <td>creation date</td>
                {/* @ts-ignore */}
                <td>{new Date(data.data.additionalData?.birthtime).toDateString()}</td>
              </tr>
            </tbody>
          </table>
        </Modal>
    </div>
  )
}

export default FolderContent
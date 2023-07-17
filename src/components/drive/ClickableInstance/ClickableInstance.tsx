import React, { useContext, useState } from 'react'

// icons
import { getFileIcon } from '../FolderContent/helpers'
import { BiSolidFolder } from 'react-icons/bi'

// components
import ContextMenuModal from '../../modals/ContextMenuModal/ContextMenuModal'

// styles
import styles from "./ClickableInstance.module.css"

// context
import { DriveContext } from '@/src/contexts/DriveContext'

type componentProps = {
    name: string
    type: "folder" | "file",
    handleRightClick: (value: string) => void
}

const ClickableInstance = ({ name, type, handleRightClick }: componentProps) => {
  const { dispatch, data} = useContext(DriveContext)
  const [rename, setRename] = useState({ start: false, newName: "" })
 

  function renameInstance() {

  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key !== "Enter") return
    console.log(e.key)
  }

  function handleClick() {
    if (type !== "folder") return
    const newPath = `${data.data.currentFolder}${name}`
    dispatch({ type: "move", payload: newPath})
  }
  return (
    <>
      {/* @ts-ignore */}
      <li className={styles.element} onClick={handleClick} onContextMenu={(e) => handleRightClick(e, name)}>
        {type === "folder" ? <BiSolidFolder/> : getFileIcon(name)}
        {rename.start ? <input placeholder='new name' value={name} onKeyDown={handleKeyPress} /> : <p>{name}</p>}
      </li>
      
    </>
  )
}

export default ClickableInstance
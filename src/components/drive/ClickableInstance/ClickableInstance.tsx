import React, { useContext, useState,useEffect, MutableRefObject, useRef } from 'react'

// icons
import { getFileIcon } from '../FolderContent/helpers'
import { BiSolidFolder } from 'react-icons/bi'

// components
import ContextMenuModal from '../ContextMenuModal/ContextMenuModal'

// styles
import styles from "./ClickableInstance.module.css"

// context
import { DriveContext } from '@/src/contexts/DriveContext'

type componentProps = {
    name: string
    type: "folder" | "file",
    edit: boolean
    handleRightClick: (value: string) => void
    handleInputBlur: () => void
}

const ClickableInstance = ({ name, type, handleRightClick, edit, handleInputBlur }: componentProps) => {
  const { dispatch, data} = useContext(DriveContext)
  // const [newName, setNewName] = useState(name)
  const inputRef = useRef() as MutableRefObject<HTMLInputElement>
 
  useEffect(() => {
    if (!inputRef.current) return
    if (edit) inputRef.current.focus()
  }, [edit])

  

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key !== "Enter" ) return

    if (inputRef.current.value === name || !inputRef.current.value) return handleInputBlur()

    // TODO: handle instance name validation
    dispatch({ type: "rename", payload: { name, newName: inputRef.current.value, currentLocation: data.data.currentFolder }})
    handleInputBlur()
  }

  function handleClick() {
    if (type !== "folder" || edit) return
    const newPath = `${data.data.currentFolder}${name}`
    dispatch({ type: "move", payload: newPath})
  }
  return (
    <>
      {/* @ts-ignore */}
      <li className={styles.element} onClick={handleClick} onContextMenu={(e) => handleRightClick(e, name)}>
        {type === "folder" ? <BiSolidFolder/> : getFileIcon(name)}
        {edit ? <input placeholder='new name' onKeyDown={handleKeyPress} defaultValue={name} ref={inputRef} onBlur={handleInputBlur}/> : <p>{name}</p>}
      </li>
      
    </>
  )
}

export default ClickableInstance
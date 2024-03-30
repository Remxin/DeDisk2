import React, { useContext, useState,useEffect, MutableRefObject, useRef } from 'react'

// icons
import { getFileIcon } from '../FolderContent/helpers'
import { BiSolidFolder } from 'react-icons/bi'


// styles
import styles from "./ClickableInstance.module.css"

// navigation
import Link from 'next/link'

// context
import { DriveContext } from '@/src/contexts/DriveContext'
import { appConstants } from '@/src/constants/appConstants'

// helpers
import { getRedirectUrl } from './helpers'

// types
type componentProps = {
    name: string
    type: "folder" | "file",
    edit: boolean
    handleRightClick: (value: string) => void
    handleInputBlur: () => void
}

const ClickableInstance = ({ name, type, handleRightClick, edit, handleInputBlur }: componentProps) => {
  const { dispatch, data} = useContext(DriveContext)
  
  const inputRef = useRef() as MutableRefObject<HTMLInputElement>

  // for navigation
  const moveUrl = getRedirectUrl(data.data.currentFolder, name)

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

 
  return (
    <Link href={`${appConstants.clientUrl}/drive?path=${moveUrl}`}>
      {/* @ts-ignore */}
      <li className={styles.element} onContextMenu={(e) => handleRightClick(e, name)}>
        {type === "folder" ? <BiSolidFolder/> : getFileIcon(name)}
        {edit ? <input placeholder='new name' onKeyDown={handleKeyPress} defaultValue={name} ref={inputRef} onBlur={handleInputBlur}/> : <p>{name}</p>}
      </li>
    </Link>
    
  )
}

export default ClickableInstance
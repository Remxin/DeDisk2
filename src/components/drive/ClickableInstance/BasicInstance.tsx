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
}

const ClickableInstance = ({ name, type }: componentProps) => {
  const { dispatch, data} = useContext(DriveContext)

  function handleClick() {
    if (type !== "folder") return
    const newPath = `${data.data.currentFolder}${name}`
    // TODO: change path 

  }
  return (
    <>
      {/* @ts-ignore */}
      <li className={styles.element} onClick={handleClick} onContextMenu={(e) => handleRightClick(e, name)}>
        {type === "folder" ? <BiSolidFolder/> : getFileIcon(name)}
        {name}
      </li>
      
    </>
  )
}

export default ClickableInstance
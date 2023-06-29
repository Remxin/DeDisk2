import React, { useContext } from 'react'

// icons
import { getFileIcon } from '../FolderContent/helpers'
import { BiSolidFolder } from 'react-icons/bi'

// styles
import styles from "./ClickableInstance.module.css"

// context
import { DriveContext } from '@/src/contexts/DriveContext'

type componentProps = {
    name: string
    type: "folder" | "file"
}

const ClickableInstance = ({ name, type }: componentProps) => {
  const { dispatch, data} = useContext(DriveContext)

  function handleClick() {
    if (type !== "folder") return
    // console.log(data.data.currentFolder, data.data.currentFolder.replaceAll("/", "|"))
    const newPath = `${data.data.currentFolder}${name}`
    // console.log(newPath)
    dispatch({ type: "move", payload: newPath})
  }
  return (
    <li className={styles.element} onClick={handleClick}>{type === "folder" ? <BiSolidFolder/> : getFileIcon(name)} {name}</li>
  )
}

export default ClickableInstance
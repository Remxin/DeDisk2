import React from 'react'

// icons
import { getFileIcon } from '../FolderContent/helpers'
import { BiSolidFolder } from 'react-icons/bi'

// styles
import styles from "./ClickableInstance.module.css"


type componentProps = {
    name: string
    type: "folder" | "file"
}

const ClickableInstance = ({ name, type }: componentProps) => {
  return (
    <li className={styles.element}>{type === "folder" ? <BiSolidFolder/> : getFileIcon(name)} {name}</li>
  )
}

export default ClickableInstance
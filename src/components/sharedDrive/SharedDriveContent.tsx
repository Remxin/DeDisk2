import useSharedDrive from '@/src/hooks/useSharedDrive'
import React from 'react'
import { getFileIcon } from '../drive/FolderContent/helpers'
import { BiSolidFolder } from 'react-icons/bi'


import styles from "./SharedDriveContent.module.css"

const SharedDriveContent = () => {
    const context = useSharedDrive()
  return (
    <ul className={styles.instance_container}>
       {context.content.map((e, i) => {
        const name = e.name.split("/").pop() as string
        return (
        <li id={i + ""} className={styles.instance}>
          <p className={styles.name}>{e.type === "folder" ? <BiSolidFolder/> : getFileIcon(name)} {name}</p>
        </li>)}
       )}
    </ul>
  )
}

export default SharedDriveContent
import React, { useContext, useState,useEffect, MutableRefObject, useRef } from 'react'

// icons
import { getFileIcon } from '../FolderContent/helpers'
import { BiSolidFolder } from 'react-icons/bi'

// components
import Link from 'next/link'

// styles
import styles from "./ClickableInstance.module.css"

// context
import { DriveContext } from '@/src/contexts/DriveContext'
import { appConstants } from '@/src/constants/appConstants'

type componentProps = {
    name: string
    type: "folder" | "file",
    date: string
    path: string
}

const ClickableInstance = ({ name, type, date, path }: componentProps) => {
  const { data } = useContext(DriveContext)

  function handleClick() {
    if (type !== "folder") return
    const newPath = `${data.data.currentFolder}${name}`
    // TODO: change path 

  }
  return (
    <>
      {/* @ts-ignore */}
      <li className={styles.element} onClick={handleClick}>
        <Link href={`${appConstants.clientUrl}/drive?path=${path}`} className={styles.favourite}>
          <p className={styles.name}>{type === "folder" ? <BiSolidFolder/> : getFileIcon(name)} {name}</p>
          <p className={styles.path}>folder: {path}</p>
          <p className={styles.date}>{new Date(date).toDateString()}</p>
        </Link>
      </li>
      
    </>
  )
}

export default ClickableInstance
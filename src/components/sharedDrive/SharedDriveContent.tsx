import useSharedDrive from '@/src/hooks/useSharedDrive'
import React from 'react'
import { getFileIcon } from '../drive/FolderContent/helpers'
import { BiSolidFolder } from 'react-icons/bi'
import { useSearchParams } from 'next/navigation'
import { useRouter }from "next/router"

import { createQueryString } from './helpers'
import { updateQuery } from './helpers'

import styles from "./SharedDriveContent.module.css"
import Link from 'next/link'

const SharedDriveContent = () => {
    const context = useSharedDrive()
    const searchParams = useSearchParams()
    const router = useRouter()



  return (
    <ul className={styles.instance_container} id="aa">
       {context.content.map((e, i) => {
        const name = e.name.split("/").pop() as string
        return (
        <li id={i + ""} className={styles.instance} onClick={() => updateQuery(router, "path", context.path+e.name+"%2F")}>
         <p className={styles.name}>{e.type === "folder" ? <BiSolidFolder/> : getFileIcon(name)} {name}</p>
        </li>)}
       )}
    </ul>
  )
}

export default SharedDriveContent
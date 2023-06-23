import { useContext } from 'react'

import styles from "./FolderContent.module.css"

type componentType = {
    content: { name: string, type: "folder" | "file" }[]
   
}


const FolderContent = ({ content}: componentType) => {
  return (
    <div className={styles.container}>
        {content.map((c) => (
            <span key={c.name}>{c.type} {c.name}</span>
        ))}
    </div>
  )
}

export default FolderContent
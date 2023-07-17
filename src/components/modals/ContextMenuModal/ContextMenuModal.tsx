import React, { Dispatch, SetStateAction } from 'react'

// styles
import styles from "./ContextMenuModal.module.css"

// icons
import { AiFillInfoCircle, AiFillDelete, AiFillEdit } from 'react-icons/ai'

type componentProps = {
    x: number
    y: number,
    setVisible: (props: any) => void
}

const ContextMenuModal = ({ x, y, setVisible }: componentProps) => {



  return (
    <div onClick={setVisible} className={styles.container}>
    <div className={styles.modal} style={{ top: y, left: x }}>
        <ul className={styles.choice_list}>
          <li><AiFillEdit/> Rename</li>
          <li><AiFillInfoCircle/> Details</li>
          <li><AiFillDelete/> Delete</li>
        </ul>
      </div>
    </div>
  )
}

export default ContextMenuModal
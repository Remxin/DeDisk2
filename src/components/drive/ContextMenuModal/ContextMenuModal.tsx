import React, { Dispatch, SetStateAction } from 'react'

// styles
import styles from "./ContextMenuModal.module.css"

// icons
import { AiFillInfoCircle, AiFillDelete, AiFillEdit, AiFillHeart, AiOutlineShareAlt } from 'react-icons/ai'

// types
import { ContextActionType } from '../FolderContent/FolderContent'

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
            <li data-action="rename"><AiFillEdit/> Rename</li>
            <li data-action="details"><AiFillInfoCircle/> Details</li>
            <li data-action="add to favourites"><AiFillHeart/> Add to favourites</li>
            <li data-action="share"><AiOutlineShareAlt/> Share</li>
            <li data-action="delete"><AiFillDelete/> Delete</li>
          </ul>
        </div>
    </div>
  )
}

export default ContextMenuModal
import { useState } from "react"

// components
import { BiSolidFolder} from "react-icons/bi"
import Modal from '../../modals/Modal/Modal'

// styles
import styles from "./ClickableInstance.module.css"
import { setUncaughtExceptionCaptureCallback } from "process"


type ComponentPropsT = {
    name: string
    createData: Date
    sharedTo: string
}

type ParsedSharedToT = string[]

const SharedInstance = ({name, createData, sharedTo}: ComponentPropsT) => {
    const sharedToTab = JSON.parse(sharedTo) as ParsedSharedToT

    const [clicked, setClicked] = useState(false)

  return (
    <>
    
    <div onClick={() => setClicked(true)}>
    {/* @ts-ignore */}
    <li className={styles.element}>
      <BiSolidFolder/>
      <p>{name}</p>
     
      
      <p className={styles.date}>{new Date(createData).toDateString()}</p>
      
    </li>
   
          
       
  </div>
  <Modal visible={clicked} setVisible={setClicked} size={{ width: 300, height: 300}}>
    <p>SharedTo: </p>
    <ul>
        {sharedToTab.map((email, i) => {
            return <ul key={i}>{email}</ul>
        })}
    </ul>
    </Modal>

  </>
  )
}

export default SharedInstance
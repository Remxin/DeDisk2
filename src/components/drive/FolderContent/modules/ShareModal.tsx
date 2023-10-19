import React, { MutableRefObject, useRef, useState } from 'react'

// components
import Modal from '@/src/components/modals/Modal/Modal'
import Input from '@/src/components/forms/Input/Input'
import Button from '@/src/components/forms/Button/Button'

// icons
import { BiSolidUser } from "react-icons/bi"

// validations
import { userValidations } from '@/src/validations/userData'

// data 
import { shareTimes } from './data'

// types
type ShareData = {
  mode: "DeDisk account" | "email",
  targetUsers: string[]
  expires: typeof shareTimes[number]["value"]
}

type componentsProps = {
  visible: boolean
  setVisible: React.Dispatch<boolean>
  targetName: string
}

const ShareModal = ({visible, setVisible, targetName}: componentsProps) => {
  const inputRef = useRef() as MutableRefObject<HTMLInputElement>
  const [shareData, setShareData] = useState<ShareData>({
    mode: "DeDisk account",
    targetUsers: [],
    expires: ""
  })

  function addReceiver() {
    if (!inputRef.current.value) return
    setShareData(p => ({...p, targetUsers: [...p.targetUsers, inputRef.current.value]}))
    inputRef.current.value = ""
  }

  return (
    <Modal visible={visible} setVisible={setVisible}>
          <h2>Share {targetName}</h2>
          <form>
            {/* selecting share form */}
            <label>By DeDisk account<input type="radio" name="share-who" defaultChecked onChange={() => setShareData(p => ({...p, mode: "DeDisk account"}))}/></label>
            <label>By email <input type="radio" name="share-who" onChange={() => setShareData(p => ({...p, mode: "email"}))}/></label>
            {/* adding receivers */}
            { shareData.mode === "DeDisk account" ?
              <Input key="DeDisk account" placeholder='Type user email or name' ref={inputRef}/> :
              <Input key="email" placeholder='Type user email' ref={inputRef} validationFunction={userValidations.email}/>
            }
            <Button onClick={addReceiver} text="Add receiver"/>

            {/* showing all receivers */}
            <ul>
              {shareData.targetUsers.map(t => (
                <ul key={t}><BiSolidUser/> {t}</ul>
              ))}
            </ul>
            <p>Share time</p>
            <select>
              {shareTimes.map(s => (
                <option value={s.value} key={s.value}>{s.name}</option>
              ))}
            </select>
            <Button text="Share" onClick={() => null}/>
          </form>
        </Modal>
  )
}

export default ShareModal
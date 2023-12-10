import React, { ChangeEvent, MutableRefObject, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'

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
import { appConstants } from '@/src/constants/appConstants'

// types
type ShareData = {
  targetUsers: string[]
  expires: typeof shareTimes[number]["value"]
}

type componentsProps = {
  visible: boolean
  setVisible: React.Dispatch<boolean>
  targetName: string
}

const ShareModal = ({visible, setVisible, targetName}: componentsProps) => {
  const searchParams = useSearchParams()
  const inputRef = useRef() as MutableRefObject<HTMLInputElement>
  const [shareData, setShareData] = useState<ShareData>({
    targetUsers: [],
    expires: ""
  })

  function addReceiver() {
    if (!inputRef.current.value) return
    setShareData(p => ({...p, targetUsers: [...p.targetUsers, inputRef.current.value]}))
    inputRef.current.value = ""
  }

  async function handleForm() {
    if (shareData.targetUsers.length < 1) return 
    console.log(shareData.expires)
    try {
      const res = await fetch(`${appConstants.serverUrl}/api/file/share`, {
        method: "POST",
        body: JSON.stringify({ emails: shareData.targetUsers, expiresIn: shareData.expires, filepath: `${searchParams.get("path")}/${targetName}`}) // email, expiresIn, filepath
      })
      if (res.status !== 200) {
        console.log("failed")
        // throw new Error((await res.json()).error)
        // error handling
        return
      }
      const resData = await res.json()
      console.log(resData)

    } catch (err) {
      throw new Error("fetch failed")
    }
  }

  function handleSubmit(e: ChangeEvent<HTMLSelectElement>) {
    const val = e.currentTarget.value as typeof shareTimes[number]["value"]
    if (val) setShareData(p => ({ ...p, expires: val }))
    else console.log(val)
  }

  return (
    <Modal visible={visible} setVisible={setVisible} size={{ width: "300px", height: "500px"}}>
          <h2>Share {targetName}</h2>
          <form>
        
            {/* adding receivers */}
            <Input placeholder='Type user email' ref={inputRef} validationFunction={userValidations.email}/>
            <Button onClick={addReceiver} text="Add receiver"/>

            {/* showing all receivers */}
            <ul>
              {shareData.targetUsers.map(t => (
                <ul key={t}><BiSolidUser/> {t}</ul>
              ))}
            </ul>
            <p>Share time</p> 
            {/* @ts-ignore */}
            <select onChange={handleSubmit}>
              {shareTimes.map(s => (
                <option value={s.value} key={s.value} onSelect={() => setShareData(p => ({...p, expires: s.value }))}>{s.name}</option>
              ))}
            </select>
            <Button text="Share" onClick={handleForm}/>
          </form>
        </Modal>
  )
}

export default ShareModal
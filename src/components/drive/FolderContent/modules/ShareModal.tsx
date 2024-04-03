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

// lottie
import Lottie from "lottie-react"
import SquareLoading from "../../../../../public/lottie/loading.json"
import SuccessAnim from "../../../../../public/lottie/success.json"
import ErrorAnim from "../../../../../public/lottie/error.json"

// styles
import styles from "./ShareModal.module.css"

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

const initialResponse = {
  loading: false,
  error: "",
  data: ""
}

const ShareModal = ({visible, setVisible, targetName}: componentsProps) => {
  const searchParams = useSearchParams()
  const inputRef = useRef() as MutableRefObject<HTMLInputElement>
  const [response, setResponse] = useState(initialResponse)
  const [inputHasContent, setInputHasContent] = useState(false)
  const [shareData, setShareData] = useState<ShareData>({
    targetUsers: [],
    expires: ""
  })

  function addReceiver() {
    if (!inputRef.current.value) return
    if (shareData.targetUsers.some(e => e === inputRef.current.value)) return setResponse(p => ({...p, error: `Email: ${inputRef.current.value} already added`}))
    setShareData(p => ({...p, targetUsers: [...p.targetUsers, inputRef.current.value]}))
    inputRef.current.value = ""
  }

  async function handleForm() {
    if (shareData.targetUsers.length < 1) return 
    setResponse(p => ({...p, loading: true}))
    try {
      const res = await fetch(`${appConstants.serverUrl}/api/file/share`, {
        method: "POST",
        body: JSON.stringify({ emails: shareData.targetUsers, expiresIn: shareData.expires, filepath: `${searchParams.get("path")}/${targetName}`}) // email, expiresIn, filepath
      })
      if (res.status !== 200) {
        // throw new Error((await res.json()).error)
        // error handling
        return
      }
      const resData = await res.json()
      setResponse(p => ({...p, data: resData.message, loading: false}))

    } catch (err) {
      throw new Error("fetch failed")
    }
  }

  function handleSelect(e: ChangeEvent<HTMLSelectElement>) {
    const val = e.currentTarget.value as typeof shareTimes[number]["value"]
    if (val) setShareData(p => ({ ...p, expires: val }))
  }

  function handleInputInput() {
    if (inputRef.current.value !== "") setInputHasContent(true)
    else setInputHasContent(false)
  }

  function handleOkButton() {
    setResponse(initialResponse)
  }

  return (
    <Modal visible={visible} setVisible={setVisible} size={{ width: "300px", height: "500px"}}>
          {response.data ? <div className={styles.overlapping_div}><Lottie animationData={SuccessAnim} loop={false}/><p>{response.data}</p><button type="button" onClick={handleOkButton}>ok</button></div> : <></>}
          {response.error ? <div className={styles.overlapping_div}><Lottie animationData={ErrorAnim} loop={false}/><p className={styles.error_text}>{response.error}</p><button type="button" onClick={handleOkButton}>ok</button></div> : <></>}
          {response.loading ? <div className={styles.overlapping_div}><Lottie animationData={SquareLoading}/><p>Loading...</p><button type="button" onClick={handleOkButton}>ok</button></div> : <></>}
          <h2>Share {targetName}</h2>
          <form>
        
            {/* adding receivers */}
            <Input placeholder='Type user email' ref={inputRef} validationFunction={userValidations.email} onChange={handleInputInput}/>
            <Button onClick={addReceiver} text="Add receiver" disabled={!inputHasContent}/>

            {/* showing all receivers */}
            <ul>
              {shareData.targetUsers.map(t => (
                <ul key={t}><BiSolidUser/> {t}</ul>
              ))}
            </ul>
            <p>Share time</p> 
            {/* @ts-ignore */}
            <select onChange={handleSelect}>
              {shareTimes.map(s => (
                <option value={s.value} key={s.value} onSelect={() => setShareData(p => ({...p, expires: s.value }))}>{s.name}</option>
              ))}
            </select>
            <Button text="Share" onClick={handleForm} disabled={shareData.targetUsers.length === 0}/>
          </form>
        </Modal>
  )
}

export default ShareModal
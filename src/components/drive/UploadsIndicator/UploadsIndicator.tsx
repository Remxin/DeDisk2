import { useContext, useEffect, useState } from 'react'
import { DriveContext } from '@/src/contexts/DriveContext'

// icons
import { BsArrowDownCircleFill } from 'react-icons/bs'

// styles
import styles from "./UploadsIndicator.module.css"

// helpers
import { getBytesString } from '@/helpers/data/size'


const UploadsIndicator = () => {
    const { data } = useContext(DriveContext)
    const [visible, setVisible] = useState(false)
    
    function handleArrowClick() {
        setVisible(p => !p)
    }

    useEffect(() => {
        console.log(data.uploads.length)
        if (data.uploads.length > 0) setVisible(true)
    }, [JSON.stringify(data.uploads)])

  return (
    <div className={styles.container} style={{ height: visible ? 300 : 30}}>
        <button className={styles.arrow} onClick={handleArrowClick}><BsArrowDownCircleFill/></button>
        {visible && data.uploads.map((u, i) => (
            <div key={i}>
                <p>{u.file}</p>
                <span>
                    <progress value={u.loaded} max={u.total}></progress>
                    {Math.round(u.loaded/u.total * 100) + "%"}
                </span>
                <p>{getBytesString(u.loaded, 1)} / {getBytesString(u.total, 1)}</p>
            </div>
        ))}
    </div>
  )
}

export default UploadsIndicator
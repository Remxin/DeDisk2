import React from 'react'

// components
import Modal from '@/src/components/modals/Modal/Modal'

// styles
import styles from "../FolderContent.module.css"

// helpers
import { getStringBytesFromUnit } from '@/helpers/data/size'

// types
import { AdditionalData } from '@/src/hooks/useDrive'

type componentsProps = {
    visible: boolean
    setVisible: () => any
    targetName: string
    size: {
        width: string | number
        height: string | number
    }
    data: AdditionalData
    currentFolder: string
  }
  

const InstanceInformations = ({visible, setVisible, size, data, currentFolder}: componentsProps) => {
    if (!data) return
  return (
    <Modal visible={visible} setVisible={setVisible} size={size}>
          <h2 className={styles.infoTitle}>File informations</h2>
          <table className={styles.infoTable}>
            <tbody>
              <tr>
                <td>name</td>
                <td>{data.name}</td>
              </tr>
              <tr>
                <td>path</td>
                <td>{currentFolder}</td>
              </tr>
              <tr>
                <td>size</td>
                <td>{getStringBytesFromUnit("B", data.size!, 1)}</td>
              </tr>
              <tr>
                <td>extension</td>
                <td>{data.extension}</td>
              </tr>
              <tr>
                <td>last modified</td>
                {/* @ts-ignore */}
                <td>{new Date(data.atime).toDateString()}</td>
              </tr>
              <tr>
                <td>creation date</td>
                {/* @ts-ignore */}
                <td>{new Date(data.birthtime).toDateString()}</td>
              </tr>
            </tbody>
          </table>
        </Modal>
  )
}

export default InstanceInformations
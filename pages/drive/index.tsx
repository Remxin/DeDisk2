import Navbar from '@/src/layout/Navbar/Navbar'

// components
import RightMenu from '@/src/components/drive/RightMenu/RightMenu'
import FolderContent from '@/src/components/drive/FolderContent/FolderContent'
import UploadsIndicator from '@/src/components/drive/UploadsIndicator/UploadsIndicator'

// styles
import styles from "@/styles/drive/Drive.module.css"

// hooks
import { useDrive } from '@/src/hooks/useDrive'

// context
import DriveContextProvider from '@/src/contexts/DriveContext'
import { useSearchParams } from "next/navigation"
import { GetStaticProps } from 'next'

// types
export type QueryProps = {
    search: null | "favourites" | "shared",
    path: null | string
} | null


const Path = (props: QueryProps) => {
    return (
        <DriveContextProvider queryProps={props}>
            <Navbar />
            <div className={styles.drive}>
                <RightMenu />
                <FolderContent/>
            </div>
            <UploadsIndicator/>
        </DriveContextProvider>
    )
}


export async function getServerSideProps(context: any) {
    //@ts-ignore
    const { params } = context

    const search = context.query?.search ? context.query.search : null
    const path = context.query?.path ? context.query.path : null
    return {
        props: {
            search,
            path
        }
    }
}

export default Path
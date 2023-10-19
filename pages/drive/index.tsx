import Navbar from '@/src/layout/Navbar/Navbar'

// components
import LeftMenu from '@/src/components/drive/LeftMenu/LeftMenu'
import FolderContent from '@/src/components/drive/FolderContent/FolderContent'
import UploadsIndicator from '@/src/components/drive/UploadsIndicator/UploadsIndicator'

// styles
import styles from "@/styles/drive/Drive.module.css"

// constants
import { appConstants } from '@/src/constants/appConstants'

// context
import DriveContextProvider from '@/src/contexts/DriveContext'

// helpers
import * as cookie from "cookie"

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
                <LeftMenu />
                <FolderContent/>
            </div>
            <UploadsIndicator/>
        </DriveContextProvider>
    )
}


export async function getServerSideProps(context: any) {
    // user authentication
    //@ts-ignore
  const parsedCookies = cookie.parse(context.req.headers.cookie);
  const res = await fetch(`${appConstants.serverUrl}/api/user/verify`, {
    method: "POST",
    credentials: "include",
    headers: {
      "cookie": `userToken=${parsedCookies.userToken}`
    }
  })

  if (res.status !== 200) {
    return {
      redirect: {
        destination: "/login",
        permanent: false
      },
    }
  }
    // functionality
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
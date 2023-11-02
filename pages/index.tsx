import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/home/Home.module.css'

// components
import Navbar from '@/src/layout/Navbar/Navbar'
import Link from 'next/link'

// constants
import { appConstants } from '@/src/constants/appConstants'

// helpers
import { GetServerSidePropsContext } from 'next'
import * as cookie from "cookie"

// variables
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>

      <Navbar />
      <main className={`${styles.main} ${inter.className}`}>
        <h1>Choose service</h1>
        <div className={styles.cards}>
          <div className={styles.service_card}><Link href="/drive"> <img src="/images/folder.jpg" alt="directory photo" />File Storage</Link></div>
        </div>
      </main>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  if (!context.req.headers?.cookie) return {
    redirect: {
      destination: "/login",
      permanent: false
    },
  }

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

  return {
    props: {
      data: null
    }
  }
}

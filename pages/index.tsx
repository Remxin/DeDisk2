import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/home/Home.module.css'

// components
import Navbar from '@/src/layout/Navbar/Navbar'
import { AiFillFolder } from "react-icons/ai"
import Link from 'next/link'

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

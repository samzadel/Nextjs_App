import Link from 'next/link'
import Head from 'next/head'
import styles from './header.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHistory, faUser, faBookmark } from '@fortawesome/free-solid-svg-icons'
import { config } from '@fortawesome/fontawesome-svg-core'
import { dom } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false

export default function Header() {
  return (
    <>
    <Head>
    <style type="text/css">{dom.css()}</style>
    </Head>
    <header className={styles.container}>

      <div className={styles.leftPartHeader}>
        <Link href='../components/layout'>
          <button className={styles.button_publication}>פרסום מודעה חדשה +</button>
        </Link>
        <Link href='/posts/test' passHref>
          <a><FontAwesomeIcon icon={faUser} width={20} className={styles.icons} /></a>
        </Link>
        <Link href='/posts/test' >
          <a><FontAwesomeIcon icon={faBookmark} width={20} className={styles.icons} /></a>
        </Link>
        <Link href='/posts/test' >
          <a><FontAwesomeIcon icon={faHistory} width={20} className={styles.icons} /></a>
        </Link>
      </div>

      <div className={styles.rightPartHeader}>
        <Link href='/'>
          <a>Logo HOMY</a>
        </Link>
      </div>

    </header>
    </>
  )
}

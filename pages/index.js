import Head from 'next/head'
import utilStyles from './styles/utils.module.css'
import fetch from 'node-fetch'
import Header from './Header/header'
import Search from '../components/Search2/search'



export default function Index() {
  return (
    <>
    <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
    </Head> 
    <Header/>  
    <Search/> 
    </>
  )

}


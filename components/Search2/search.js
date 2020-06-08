import styles from './search.module.css'
import React, { useState } from 'react';
import _, { debounce } from 'lodash';


export default function Search() {

  const [state, setState] = useState([])

  const handleChange = debounce(async (value) => {
    const url = `http://localhost:3100/`
    if (value === '') {
      setState([])
      return
    }
    let response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ value })
    })
    let test = await response.json()
    setState(test)
   }, 1000)


  return (
    <>
      <div className={styles.suggestion_input}>
      <h2>Search Places</h2>
        <input placeholder='jerusalem' onChange={e => handleChange(e.target.value)} />
        {
          state.map((item,index)=>{
          return <div className={styles.suggests} key={index}>{item}</div>
          })
        }
      </div>
    </>
  )
}

import styles from './search.module.css'
import React, { useState } from 'react';
import _, { debounce } from 'lodash';


export default function Search() {

  const [state, setState] = useState([])

  const [valueClick, setValueClick] = useState('')

  const sendRequest = debounce(async (value) => {
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
  },500)

  const handleChange = (content)=>{
    setValueClick(content)
    sendRequest(content)
  }


  const getSuggest = (value) => {
    setValueClick(value)
  }

  return (
    <>
      <div className={styles.suggestion_input}>
        <h2>Search Places</h2>
        <input placeholder='חפשו איזור, שכונה או בי״ס' className={styles.input_suggests} onChange={e => handleChange(e.target.value)} value={valueClick} />
        {
          state.map((item, index) => {
            return <div className={styles.suggests} onClick={e => getSuggest(item.description)} key={index}>{item.description} <span className={styles.suggests_type}>{item.type}</span>
            </div>
          })
        }
      </div>
    </>
  )
}

import styles from './search.module.css'
import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { config } from '@fortawesome/fontawesome-svg-core'
import { dom } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false

export default function Search() {

  const [state, setState] = useState([])

  const [valueClick, setValueClick] = useState('')

  const [isVisible, setVisible] = useState(true)

  const suggestions = useRef(null)

  useEffect(() => {
    document.addEventListener("click", catchClick)
    return () => {
      document.removeEventListener("click", catchClick)
    }
  }, [])

  const catchClick = (event) => {
    if (suggestions.current && !suggestions.current.contains(event.target)) {
      setVisible(false)
    }

  }

  const sendRequest = async (value) => {
    const url = `http://localhost:3100/`
    let response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ value })
    })
    let test = await response.json()
    setState(test)
  }

  const handleChange = (content) => {
    setVisible(true)
    setValueClick(content)
    sendRequest(content)
    if (content === '') {
      setState([])
    }
  }


  const getSuggest = (value) => {
    setValueClick(value)
    setState([])
  }

  return (
    <>
      <h2 className={styles.title}>Search Places</h2>
      <div className={styles.suggestion_input}>
        <input placeholder='חפשו איזור, שכונה או בי״ס' className={styles.input_suggests} onChange={e => handleChange(e.target.value)} value={valueClick} />
        <button className={styles.iconSearch}><FontAwesomeIcon icon={faSearch} width={40} /></button>
          {(state.length > 0 && isVisible) &&
            <div ref={suggestions}>
              {
                state.map((item, index) => {
                  return <div className={styles.suggests} onClick={e => getSuggest(item.description)} key={index}>{item.description} <span className={styles.suggests_type}>{item.type}</span>
                  </div>
                })
              }
            </div>
          } 
      </div>
    </>
  )
}

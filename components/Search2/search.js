import styles from './search.module.css'
import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faMapMarkerAlt, faHistory } from '@fortawesome/free-solid-svg-icons'
import { config } from '@fortawesome/fontawesome-svg-core'
import { dom } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false

export default function Search() {

  const [state, setState] = useState([])

  const [valueClick, setValueClick] = useState('')

  const [isVisible, setVisible] = useState(true)

  const [historyVisible, setHistoryVisible] = useState(false)

  const suggestions = useRef(null)

  const histories = useRef(null)

  const catchInput = useRef(null)

  useEffect(() => {
    document.addEventListener("click", catchClick)
    return () => {
      document.removeEventListener("click", catchClick)
    }
  }, [])

  const catchClick = (event) => {

    console.log(suggestions.current, histories.current, catchInput.current)

    if ((suggestions.current && !suggestions.current.contains(event.target)) || (histories.current && !histories.current.contains(event.target) && !catchInput.current.contains(event.target))) {
      setVisible(false)
      setHistoryVisible(false)
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
    setHistoryVisible(false)
    sendRequest(content)
    if (content === '') {
      setState([])
      setHistoryVisible(true)
    }
  }

  const getSuggest = (value) => {
    var arrItem = []
    if (localStorage.getItem('historySearch') == null) {
      arrItem.push(value)
      localStorage.setItem('historySearch', JSON.stringify(arrItem))
    }
    else {
      var sameSearch = false
      var currentSearches = JSON.parse(localStorage.getItem('historySearch'))
      currentSearches.forEach(element => {
        if (element == value) {
          sameSearch = true
        }
      });
      if (currentSearches.length >= 5 && sameSearch == false) {
        currentSearches.pop()
      }
      if (sameSearch == false) {
        currentSearches.unshift(value)
      }
      localStorage.setItem('historySearch', JSON.stringify(currentSearches))
    }
    setValueClick(value)
    setHistoryVisible(false)
    setState([])
  }

  const getHistory = () => {
    if (valueClick === '') {
      setHistoryVisible(true)
    } else {
      setHistoryVisible(false)
    }
  }

  return (
    <>
      <h2 className={styles.title}>Search Places</h2>
      <div className={styles.suggestion_input}>
        <input placeholder='חפשו איזור, שכונה או בי״ס' ref={catchInput} className={styles.input_suggests} onChange={e => handleChange(e.target.value)} value={valueClick} onClick={getHistory} />
        <button className={styles.iconSearch}><FontAwesomeIcon icon={faSearch} width={40} /></button>
      </div>
      {
        historyVisible &&
        <div className={styles.suggestions_div}>
          {
            JSON.parse(localStorage.getItem('historySearch')).map((item, index) => {
              return <div className={styles.suggests} ref={histories} key={index} onClick={e => getSuggest(item)}>
                <div>
                  <FontAwesomeIcon icon={faHistory} width={40} />
                  <span className={styles.description}>{item}</span>
                </div>
              </div>
            })
          }
        </div>
      }

      {(state.length > 0 && isVisible) &&
        <div className={styles.suggestions_div}>
          {
            state.map((item, index) => {
              return <div className={styles.suggests} ref={suggestions} onClick={e => getSuggest(item.description)} key={index}>
                <div>
                  <FontAwesomeIcon icon={faMapMarkerAlt} width={40} />
                  <span className={styles.description}>{item.description}</span>
                </div>
                <div>
                  <span className={styles.suggests_type}>{item.type}</span>
                </div>
              </div>
            })
          }
        </div>
      }
    </>
  )
}

import styles from './search.module.css'
import Router from 'next/router'
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

  const [countEventArrow, setcountEventArrow] = useState(0)

  const [countSearchArrow, setSearchArrow] = useState(0)

  const [catchLastSuggest, setLastSuggest] = useState({allLast:[],onlyFirst:[]})

  const [radioInputBoolean, setRadioInput] = useState('השכרה')

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
    if ((suggestions.current && !suggestions.current.contains(event.target)) || (histories.current && !histories.current.contains(event.target) && !catchInput.current.contains(event.target))) {
      setVisible(false)
      setHistoryVisible(false)
      setcountEventArrow(0)
      setSearchArrow(0)
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
    let data = await response.json()
    setState(data)    
  }

  const handleChange = (content) => {
    setVisible(true)
    setValueClick(content)
    setHistoryVisible(false)
    sendRequest(content)
    if(state.length != 0){
      setLastSuggest({onlyFirst:[state.splice(0,1)]})
    }
    if (content === '') {
      setState([])
      setHistoryVisible(true)
    }
  }

  const handleLocalStorage = (value)=>{
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
  }

  const getSuggest = (value) => {
    setVisible(false)
    handleLocalStorage(value)
    setValueClick(value)
    setHistoryVisible(false)
    setLastSuggest({allLast:[state]})
    setState([])
  }

  const getHistory = () => {
    if (valueClick === '') {
      setHistoryVisible(true)
    } else {
      setHistoryVisible(false)
    }
  }

  const handleKeyDown = (event) => {
    var history_search = JSON.parse(localStorage.getItem('historySearch'))
    var array_search = state
    if (event.key == "ArrowDown") {
      if (historyVisible) {
        setcountEventArrow(countEventArrow + 1)
        if (countEventArrow == history_search.length) {
          setcountEventArrow(0)
        }
      }
      if(isVisible){
        setSearchArrow(countSearchArrow + 1)
        if (countSearchArrow == array_search.length) {
          setSearchArrow(0)
        }
      }
    }

    if(event.key == "ArrowUp"){
      if(historyVisible){
        if(countEventArrow == 0){
          setcountEventArrow(history_search.length)
        }
        else{
          setcountEventArrow(countEventArrow-1)
        } 
      }
      if(isVisible){
        if(countSearchArrow == 0){
          setSearchArrow(array_search.length)
        }
        else{
          setSearchArrow(countSearchArrow-1)
        }
      }
      
    }

    if (event.key == "Enter") {
      event.preventDefault()
      if(historyVisible){
        if(history_search[countEventArrow - 1] == undefined){
          return
        }
        else {
          handleLocalStorage(history_search[countEventArrow - 1])
          setValueClick(history_search[countEventArrow - 1])
          setHistoryVisible(false)
          setcountEventArrow(0)
        }
      }
      if(isVisible){
        if(state[countSearchArrow - 1] == undefined){
          return
        }
        else{
          setLastSuggest({allLast:[state]})
          handleLocalStorage(state[countSearchArrow - 1].description)
          setValueClick(state[countSearchArrow - 1].description)
          setState([])
          setSearchArrow(0)
        }
      }
    }
  }

  const handleRadioInput = (e)=>{
    setRadioInput(e.target.nextElementSibling.innerHTML)
  }

  const checkArrayObject = (array,item) =>{
    if(array == undefined || array.length == 0){
      return
    }
    var theArray = array[0]
    for(var i=0; i< theArray.length; i++){
      if(theArray[i]['description'] == item){
        return true
      }
    }
  } 

  const handleSubmit = async (e)=>{
    e.preventDefault()
    var data = {location:'',type:''}
    if(valueClick === ""){
      data.location = ''
    }
    if(state.length != 0){
      data.location = state.splice(0,1)[0]['description']
    }
    if(state.length == 0 && valueClick != '' && checkArrayObject(catchLastSuggest.allLast,valueClick)){
      data.location = valueClick
    }
    if(state.length == 0 && valueClick != '' && !checkArrayObject(catchLastSuggest.allLast,valueClick) && catchLastSuggest.onlyFirst.length != 0) {
      data.location = catchLastSuggest.onlyFirst[0][0]['description']
    }
    else{
      data.location = valueClick
    }
    data.type = radioInputBoolean

    const url = `http://localhost:3100/location`
    let response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ data })
    })
    let data_response = await response.json()
    console.log(data_response)
    Router.push('/Header/header')
    
    
  }

  return (
    <>
      <h2 className={styles.title}>Search Places</h2>
      <div className={styles.button_input}>
        <ul>
          <li>
            <input type="radio" value='1' name='radio' id='radio1' defaultChecked onChange={handleRadioInput}/>
            <label htmlFor='radio1'>השכרה</label>
          </li>
          <li>
            <input type="radio" value='2' name='radio'  id='radio2' onChange={handleRadioInput}/>
            <label htmlFor='radio2'>קניה</label>
          </li>
        </ul>
      </div>
      
      <div className={styles.suggestion_input}>
        <input placeholder='חפשו איזור, שכונה או בי״ס' ref={catchInput} className={styles.input_suggests} onChange={e => handleChange(e.target.value)} value={valueClick} onClick={getHistory} onKeyDown={handleKeyDown} />
        <button className={styles.iconSearch}><FontAwesomeIcon icon={faSearch} width={40} onClick={e=>handleSubmit(e)} /></button>
      </div>

      {
        historyVisible &&
        <div className={styles.suggestions_div}>
          {
            JSON.parse(localStorage.getItem('historySearch')).map((item, index) => {
              return <div className={[styles.suggests, index == countEventArrow - 1 ? styles.test : null].join(' ')} ref={histories} key={index} onClick={e => getSuggest(item)} >
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
              return <div className={[styles.suggests, index == countSearchArrow - 1 ? styles.test : null].join(' ')} ref={suggestions} onClick={e => getSuggest(item.description)} key={index}>
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

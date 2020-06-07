import Link from 'next/link'
import Head from 'next/head'
import styles from './search.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { config } from '@fortawesome/fontawesome-svg-core'
import { dom } from "@fortawesome/fontawesome-svg-core";
import React, { useState } from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
config.autoAddCss = false

export default function Search() {

  const [state,setState] = useState({address:'',errorMessage:''})

  const handleChange = (address) =>{
    setState({address,errorMessage:''})
  }

  // const searchOptions = {
  //   // types: ['address','(cities)'],
  //   types: ['locality', 'country'],
  //   componentRestrictions: { country: ['il'] },
  // }

  const onError = (status,clearSuggestions, address) => {
    clearSuggestions()
    setState({address,errorMessage:'No results found'})
  }

  const renderFunc = ({ getInputProps, getSuggestionItemProps, suggestions, loading }) => (
    <div>
      <input className={styles.inputSearchBar}  {...getInputProps({placeholder: 'תחפש עיר, שכונה, כתובת'})} />
      <Link href='/posts/test' passHref>
        <a><FontAwesomeIcon icon={faSearch} width={40} className={styles.icons} /></a>
      </Link>
      <div >
        {loading && <div>Loading...</div>}
        {suggestions.map(suggestion => {
          const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item';
          const style = suggestion.active
                  ? { backgroundColor: 'red', cursor: 'pointer',border: '1px solid' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer',border: '1px solid' };
          return (<div {...getSuggestionItemProps(suggestion,{className,style})}>
            <span>{suggestion.description}</span> 
          </div>
          )
        })}
        {state.errorMessage.length > 0 && (
          <div className={styles.noResult}>{state.errorMessage}</div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <style type="text/css">{dom.css()}</style>
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDbSUkccejPaUNn-GoAdqNkrKpAuQASvnY&libraries=places"></script>
      </Head>
      <h1 className={styles.mainSentence}>בואו למצוא את זה שמושלם בשבילכם</h1>
      <div className={styles.mainButton}>
        <div className={styles.btnThree}>
          <span>קניה</span>
        </div>
        <div className={styles.btnThree}>
          <span>השכרה</span>
        </div>
      </div>
      <div className={styles.searchBar}>

        <PlacesAutocomplete
          value={state.address}
          onChange={handleChange}
          // searchOptions={searchOptions}
          searchOptions={{componentRestrictions: { country: ['il'] }, types: ['address']}}
          onError={onError}
        >
          {renderFunc}
        </PlacesAutocomplete>
        

      </div>
    </>
  )
}

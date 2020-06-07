import Link from 'next/link'
import Head from 'next/head'
import styles from './search.module.css'
import React, { useState } from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';


export default function Search() {

  const searchWord = (query) => {

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&types=geocode&language=fr&key=MyapiKey`
    return fetch(url,{headers:{'Access-Control-Allow-Origin': '*','Content-type': 'application/json'}})
      .then((response) => response.json())
      .then((json) => {
        console.log(json)
        return json;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      <div>
        <input onChange={e => searchWord(e.target.value)} />
      </div>
    </>
  )
}

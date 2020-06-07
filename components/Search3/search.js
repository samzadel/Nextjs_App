import Head from 'next/head'
import React, { useState, useEffect } from 'react';


export default function Search() {

    const searchWord = (query) => {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?country=il&types=address,place,locality,neighborhood,region,postcode,district&language=en&access_token=MyToken`
        return fetch(url)
            .then((response) => response.json())
            .then((json) => {
                console.log(json['features'][0]['place_name'])
                return json;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <>
            <div>
                <input onChange={e => searchWord(e.target.value)}/>
            </div>
        </>
    )
}


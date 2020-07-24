import React, { createContext, useContext, useState, useEffect } from 'react'

export const GlobalContext = createContext()

const ContextProvider = ({ children }) => {
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    })
    useEffect(() => {
        const handleResize = () => {
        setDimensions({
            width: window.innerWidth,
            height: window.innerHeight,
        })
        }
        window.addEventListener('resize', handleResize)
        return () => { window.removeEventListener('resize', handleResize) }
    }, [])

    const [hoverSong, setHoverSong] = useState(null)

    /*const [data, setData] = useState(null)
    useEffect(() => {
        if (!data){
            console.log('fetching...')
            fetch('./data/data.json')
            .then(file => { console.log(file); file.text() })
            .then(json =>  { console.log(json); setData(json) })
        }
    })*/

    const mobile = dimensions.width < 700
    return (
        <GlobalContext.Provider value={{hoverSong,setHoverSong}}>
        {children}
        </GlobalContext.Provider>
    )
}

export default ContextProvider
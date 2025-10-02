import logo from '/vite.svg'
import { useEffect, useState } from 'react'
import classes from './Header.module.css'
import {styled} from 'styled-components'


const HeaderContainer = styled.header`
 
  color: blue;
`

export default function Header(){
  const [now, setNow] = useState(new Date())
  
  useEffect(()=>{
    const interval = setInterval(() => setNow(new Date()), 1000)

    return () => {
      clearInterval(interval)
    }
  },[])

  

  const name = 'Res'

  return(
    <HeaderContainer>
      <img src={logo} alt={name}/>

      <h2>OMG</h2>

      <span>Time now: { now.toLocaleTimeString() }</span>
    </HeaderContainer>
  )
}
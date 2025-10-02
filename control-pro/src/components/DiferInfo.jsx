import {differences} from '../data' 
import Button from './Button/Button'
import { useState } from 'react'

export default function DiferInfo(){

    const [contentType, setContentType] = useState(null)

    //const stateArray = useState('жмякни кнопу') 
    /*Всегда вернет массив */
    // используем внутри компонента и на верхнем уровне
    // никаких if и внутри state
    // 

    //const content = stateArray[0]
    //const setContent = stateArray[1]

    console.log('App Component render')

    //if(contentType){
    //  tabContent = <p>{differences[contentType]}</p>

    //} else {
    //  tabContent = <p> Надо жмякнуть</p>
    //}
    
    function handleClick(type) {
    console.log('button click',type)
    setContentType(type)
    // если будем выводить type в консоль, то будет предыдущее значение
    // пока не произойдет render
    }
    return(
        <section>
            <h3>Чем мы отличаемся от черепах</h3>
    
            <Button 
            isActive = {contentType === 'way'}
            onClick={() => handleClick('way')}>button 2</Button>

                <h1>{differences[contentType]}</h1>

            {/*contentType ? (<p>{differences[contentType]}</p>)  :(
                <div> Нажми на кнопку</div>)*/}
            
            { !contentType ? (<p>wash my belly</p>) : <p>clean my belly</p>}

            { !contentType && <p>check</p>}

            {/* tabContent */}

        </section>
    )
}
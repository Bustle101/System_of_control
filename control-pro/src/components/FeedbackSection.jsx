import Button from "./Button/Button"
import { useState, useRef } from "react"

function StateVsRef(){
    const input = useRef()
    const [show, setShow] = useState(false)

    function handleKeyDown(event){
        
        if(event.key === 'Enter'){
            
            setShow(true)
        }
        
    }

    return(
        <div>
            <h1>{input.current?.value}</h1>
            <h3 >Input value: {show && input.current.value}</h3>
            <input
            ref = {input} 
            onKeyDown={handleKeyDown}
            type="text" 
            ></input>

        </div>
    )
}

export default function FeedbackSection(){
    const [form, setForm] = useState({
        name: '',
        error: false,
        reason: 'help',
    })
    //const [name,setName] = useState('')
    //const [error,setError] = useState(false)
    //const [reason,setReason] = useState('help')

    function handleNameChange(event){
        //setName(event.target.value)
        //setError(event.target.value.trim().length === 0 )

        setForm(prev => ({
            ...prev,
            name: event.target.value,
            error: event.target.value.trim().length === 0,
        }))

    }


    return(
        <section>
            <h3 style={{color: 'red'}}>Обратная связь</h3>



            <form>
                <label htmlFor="name">Имя</label>
                <input 
                className='inpput' 
                id='name' type="text" 
                value={form.name} 
                onChange={handleNameChange}
                style={{
                    border: form.error ? '1px solid red': null
                }}
                />

                <label htmlFor="reason"> Причина остановки </label>
                <select id="reason" className="inpput" value={form.reason} onChange={event => setForm( prev => ({...prev, reason: event.target.value}) )}>
                    <option value="error">Ошибка </option>
                    <option value="help">Нужна помощь</option>
                    <option value="suggest">Предложение </option>
                </select>

                <pre>{JSON.stringify(form, null,2)}</pre>

                <Button disabled={form.error}
                isValid={!form.error}>Отправить</Button>



            </form>
                <hr />
                <StateVsRef />
        </section>
    )
}
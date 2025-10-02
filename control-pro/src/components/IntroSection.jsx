import React from 'react'

/*export default function IntroSection(){
    return (
        <section>
            <h1 style = {{color: '#666'}}>Good morning</h1>
        </section>
    )
}*/

const cr = React.createElement
export default function IntroSection(){
    return cr(
        'section', null, 
        [
        cr('h1', {className: 'centered', style:{color:'rgba(55, 127, 200, 1)'}, key: 1}, 'Result'),
        cr('h3', {key: 3}, 'afsfdf'),
        ])
    // принимает 3 параметра
    // 1 тэг
    // 2 опции которые передаем тэгу
    // 3 какие дети будут у данного тэга 
}
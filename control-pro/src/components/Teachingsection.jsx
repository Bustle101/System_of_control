import {ways} from '../data' 
import Paragraph from './Paragraph'

export default function Teachingsection() {

    

    return(
        
        <section>
        <h3>наш подход </h3>
        <ul>
            {/*Всегда при такой записи должен быть key */}
            {ways.map(way => <Paragraph key={way.title} {...way} />)}
            {/*<Paragraph title="111" description= "222"/>*/}
            {/*Смотреть функцию Paragraph*/ }
            {/*<Paragraph title = {ways[0].title} description = {ways[0].description}/>
            <Paragraph {...ways[1]}/ >*/}

        </ul>
        </section>
    )
}
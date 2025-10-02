import { useState } from "react"
import Button from "./Button/Button"
import Modal from "./Modal/Modal"


export default function EffectSection(){
    const [modal, setModal] = useState(false)
    const [loading, setLoading]= useState(false)

    

    useEffect(() => {})

    function openModal(){
        setModal(true)
    }



    return(
        <section>
            <h3>
                Effects
            </h3>
            <Button 
            onClick = {openModal}>
                Openn the info
            </Button>
            <Modal open={modal}>
                <h3>Hiii</h3>
                <p>Bee</p>
                <Button onClick={() => setModal(false)}>close</Button>
            </Modal>
        </section>
    )
}
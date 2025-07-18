import { Circle, CircleCheck } from "lucide-react"
import { useState, useEffect } from "react"

export default function CardImagem(props){

    const [isSet, setIsSet] = useState(false)

    useEffect(()=> {
        setIsSet(t => !t)
    }, [props.isTrue])

    return(
        <div className="flex flex-row w-full h-12 border border-[#A29797] rounded-[12px] p-2 justify-around items-center">
            <strong>
                <p className="text-black">{props.texto}</p>
            </strong>
            {!isSet && (<Circle size={14}/>)}
            {isSet && <CircleCheck color="green" size={14}/>}
        </div>
    )
}
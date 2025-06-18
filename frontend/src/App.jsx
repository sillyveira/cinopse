import { useState } from 'react'
import Header from './componentes/Header'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Header/>
    <div className=''>Página inicial</div>
    </>
  )
}

export default App

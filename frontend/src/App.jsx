import { useState } from 'react'
import Header from './componentes/Header'
import Footer from './componentes/Footer'

function App() {
  const [count, setCount] = useState(0)

  return (
    
      <div className='h-max'>
        <Header />
        <div className=''>Página inicial</div>
        <Footer />
      </div>
  )
}

export default App

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './componentes/Header'
import Footer from './componentes/Footer'
import Home from './pages/Home'
import Descobrir from './pages/Descobrir'

function App() {
  return (
    <Router>
      <div className='h-screen flex flex-col'>
        <Header />
        <div className='flex-1 overflow-hidden'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/descobrir" element={<Descobrir/>}></Route>
          </Routes>
        </div>
      </div>
      
    </Router>
  )
}

export default App

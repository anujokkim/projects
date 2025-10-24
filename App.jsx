import Todo from './Todo'
import './App.css'
import { BrowserRouter, Route ,Routes} from 'react-router-dom'

function App() {
  

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Todo/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App

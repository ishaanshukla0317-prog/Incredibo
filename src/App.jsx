import { BrowserRouter, Route,Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import AI from "./pages/AI";
import ClickControl from "./controller/ClickControl";

const App=()=>{
  return(
    <div className='min-h-screen flex flex-col'>
    <Navbar/>
<Routes>
  <Route path='/' element={<Home/>}/>
   <Route path='/about' element={<About/>}/>
   <Route path='/about/:id' element={<ClickControl/>}/>
    <Route path='/contact' element={<Contact/>}/>
    <Route path='/signup' element={<Signup/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/ai' element={<AI/>}/>
</Routes>

    </div>
  )
}
export default App;
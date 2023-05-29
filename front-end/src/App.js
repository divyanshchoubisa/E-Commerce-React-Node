import './App.css';
import Nav from './Components/Nav';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Footer from './Components/Footer';
import SignUp from './Components/SignUp';
import PrivateComponent from './Components/PrivateComponent';
import Login from './Components/Login';
import AddProduct from './Components/AddProduct';
import ProductsList from './Components/ProductList';
import UpdateProduct from './Components/UpdateProduct';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Nav/>
      <Routes>
        <Route element={<PrivateComponent />} >
        <Route path="/" element={<ProductsList/>} />
        <Route path="/add" element={<AddProduct/>} />
        <Route path="/update/:id" element={<UpdateProduct/>} />
        <Route path="/logout" element={<h1>Logout Component</h1>} />
        <Route path="/profile" element={<h1>Profile Component</h1>} /> 
        </Route>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} /> 
      </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;

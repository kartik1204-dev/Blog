import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Route, Routes , BrowserRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Signup from './Signup.jsx';
import Login from './Login.jsx';
import Home from './Home'
import { Provider } from 'react-redux'
import store from './store.js';
import CreateBlog from './CreateBlog.jsx';
import Profile from './profile.jsx';
import About from './About.jsx';
import Membership from './Membership.jsx';
import Help from './Help.jsx'
import Condition from "./Condition.jsx"
import Privacy from "./Privacy.jsx"
import Contact from "./Contact.jsx"
import Blog from './Blog.jsx';
import Show from './show.jsx'
import PrivateRoute from './routes/PrivateRoute.jsx'
import PublicRoute from './routes/PublicRoute.jsx'

createRoot(document.getElementById('root')).render(
  
  <Provider store={store}>
    <BrowserRouter>
    <Routes>
    {/* <Route path="/" element={<HomePage />} /> */}
    <Route path='/' element={<App/>}/>
    <Route path="/Login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/Signup" element={<PublicRoute><Signup /></PublicRoute>} />
    <Route element={<PrivateRoute />}>
      <Route path='/home' element={<Home/>}/>
      <Route path='/addBlog'element={<CreateBlog/>}/>
      <Route path='/edit/:id' element={<CreateBlog/>}/>
      <Route path='/profile'element={<Profile/>}/>
      <Route path='/blog'element={<Blog/>}/>
      <Route path = '/show' element={<Show/>}/>
    </Route>
    <Route path='/about'element={<About/>}/>
    <Route path='/membership'element={<Membership/>}/>
    <Route path='/help'element={<Help/>}/>
    <Route path='/privacy'element={<Privacy/>}/>
    <Route path='/contact'element={<Contact/>}/>
    <Route path='/condition'element={<Condition/>}/>






  </Routes></BrowserRouter>
  </Provider>
)

import logo from './logo.svg';
import './App.css';
import { 
  BrowserRouter ,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'

import AddCar from './pages/AddCar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import BookingCar  from './pages/BookingCar'
import 'antd/dist/antd.css'
import UserBookings  from './pages/UserBookings'
import AdminHome from './pages/AdminHome'
import EditCar from './pages/EditCar'

function App() {
  return (
   
    <div className="App">
      <BrowserRouter>
         <Switch>
           <ProtectedRoute  exact path='/'   component={Home}/>
           <Route exact path='/login' component={Login}/>
           <Route exact path='/register'  component={Register}/>
           <ProtectedRoute exact path='/booking/:carid'  component={BookingCar}/>
           <ProtectedRoute path='/userbookings' exact component={UserBookings} />
           <ProtectedRoute path='/addcar' exact component={AddCar} />
           <ProtectedRoute path='/editcar/:carid' exact component={EditCar} />
           <ProtectedRoute path='/admin' exact component={AdminHome} />
           </Switch>
    </BrowserRouter>
    </div>
  );
}

export default App;



export function ProtectedRoute(props)
{


    if(localStorage.getItem('user'))
    {
      return <Route {...props}/>
    }
    else{
      return      <Redirect to='/login'/>
    }

}
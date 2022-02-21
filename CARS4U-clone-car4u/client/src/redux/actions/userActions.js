import { message } from 'antd';
import axios from 'axios'



export const userLogin =(reqobj) => async dispatch=>{

         dispatch({type:'LOADING',payload:true});
    
         try{
             const  response=await axios.post('/api/users/login',reqobj)
          localStorage.setItem('user',JSON.stringify(response.data))
          message.success('Login success');
          setTimeout(() => {
            window.location.href='/'
         
        }, 500);
             dispatch({type:'LOADING',payload:false})
         }catch(error){
                console.log(error)
                message.error('Something went wrong');
                dispatch({type:'LOADING',payload:false})
         }

}


export const userRegister =(reqobj) => async dispatch=>{

    dispatch({type:'LOADING',payload:true});

    try{
        const  response=await axios.post('/api/users/register',reqobj)
        message.success('Registration successfull');
        setTimeout(() => {
            window.location.href='/login'
         
        }, 500);
        dispatch({type:'LOADING',payload:false})
    }catch(error){
           console.log(error)
           message.error('Something went wrong');
           dispatch({type:'LOADING',payload:false})
    }

}
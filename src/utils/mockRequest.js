import axios from 'axios'
import store from '@/store'
import {MessageBox, Message} from "element-ui";
import {getToken} from './auth'


const service = axios.create({
  bassURL:process.env.VUE_APP_MOCK_API,
  timeout:5000
})

service.interceptors.request.use(
  config=>{
  if (store.getters.token){
    config.headers['token'] = getToken()  //token exist
  }
  return config
},
  error => {
      console.log(error)
      return  Promise.reject(error)
  }
)

service.interceptors.response.use(
  response=>{
    const result = response.data
    console.log(result)
    // if success ?
    if (result.code !== 2000 || result.code !== 200){
      Message({
        type:'error',
        message:result.message || 'Error',
        duration:5000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    }else{
      return result
    }
},error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  })

export default service

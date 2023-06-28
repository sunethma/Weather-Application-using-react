import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '/node_modules/bootstrap/dist/css/bootstrap.min.css'
//import 'bootstrap/dist/js/bootstrap.min.js';
import './Components/WeatherInformation.css';



ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,

)
/*ReactDOM.createRoot(document.getElementById('container overflow-hidden text-center') as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,

)*/

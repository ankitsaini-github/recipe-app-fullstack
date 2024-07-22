import './index.css'
import "react-toastify/dist/ReactToastify.css";

import App from './App.jsx'
import { Provider } from "react-redux";
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ToastContainer } from "react-toastify";
import store from './store/index.js';

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <App />
      <ToastContainer
          bodyClassName="toastBody"
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
    </Provider>,
)
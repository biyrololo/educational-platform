import React, { useEffect } from 'react';
import './App.css';
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import MainPage from './pages/MainPage';
import './Main.css';
import TestPage from 'pages/TestPage';
import ResultPage from './pages/ResultPage';
import CreateUserPage from 'pages/CreateUserPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateTestPage from 'pages/CreateTestPage';
import UsersResultPage from 'pages/UsersResultPage';
import AllUsersPage from 'pages/AllUsersPage';
import LoginPage from 'pages/LoginPage';
import AdminLoginPage from 'pages/AdminLoginPage';
import axios from 'axios';
import TestsPage from 'pages/TestsPage';
import AnalyticsPage from 'pages/AnalyticsPage';

function App() {

  axios.defaults.baseURL = process.env.REACT_APP_SERVER_URL;
  // axios.defaults.baseURL = 'http://localhost:8000';

  useEffect(() => {
    const token = localStorage.getItem('pass_key');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainPage/>}/>
        <Route path='/test/:id' element={<TestPage/>}/>
        <Route path="/result/:resultId" element={<ResultPage/>}/>
        <Route path="/create_user" element={<CreateUserPage/>}/>
        <Route path='/create_test/:test_id?' element={<CreateTestPage/>}/>
        <Route path='/user_results' element={<UsersResultPage/>}/>
        <Route path='/users' element={<AllUsersPage/>}/>
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/admin_login" element={<AdminLoginPage/>} />
        <Route path="/tests" element={<TestsPage/>} />
        <Route path="/analytics" Component={AnalyticsPage} />
      </Routes>
      <ToastContainer 
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"/>
    </BrowserRouter>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthProvider';
import Header from './Header/Header';
import Home from './Home/Home';
import Api from './Home/Api';
import Faq from './Home/Faq';
import Contact from './Home/Contact';
import Confidentiality from './Home/Confidentiality';
import Donate from './Home/Donate';
import Login from './Login/Login';
import SignUp from './SignUp/SignUp';
import ConfirmSignUp from './SignUp/ConfirmSignUp';
import ResetPassword from './Login/ResetPassword';
import ResetPasswordConfirm from './Login/ResetPasswordConfirm';
import Account from './Account/Account';
import Footer from './Footer/Footer';
import NotFound from './NotFound';

function App() {

return (
    <AuthProvider>
        <div className="container">
            <Router>
                <Header />
                    <main className="main">
                        <Routes>
                            <Route path='/' element={<Home />} />
                            <Route path='/api' element={<Api />} />
                            <Route path='/faq' element={<Faq />} />
                            <Route path='/contact' element={<Contact />} />
                            <Route path='/confidentiality' element={<Confidentiality />} />
                            <Route path='/donate' element={<Donate />} />

                            <Route path='/login' element={<Login />} />
                            <Route path='/signup' element={<SignUp />} />
                            <Route path='/reset-password' element={<ResetPassword />} />
                            <Route path='/reset-password/:token' element={<ResetPasswordConfirm />} />
                            <Route path='/confirm-email/:token' element={<ConfirmSignUp />} />

                            <Route path='/account/:menu' element={<Account />} />
                            <Route path='/account/:menu/:subMenu/:urlId' element={<Account />} />
                            <Route path='/account' element={<Account />} />

                            <Route path='*' element={<NotFound />} />
                        </Routes>
                    </main>
                <Footer />
            </Router>
        </div>
    </AuthProvider>
);

}

export default App;
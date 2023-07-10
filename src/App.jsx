import { BrowserRouter, Routes, Route } from 'react-router-dom'
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import { useEffect, useState } from 'react'
import Template from './layout/Template';
import Home from './pages/Home';
import Notfound from './pages/Notfound';

const firebaseConfig = {
	apiKey: "AIzaSyCTABIz5dzghTRAHKhuaKOi_QZeW8mrFHE",
	authDomain: "online-gallery-ddec5.firebaseapp.com",
	projectId: "online-gallery-ddec5",
	storageBucket: "online-gallery-ddec5.appspot.com",
	messagingSenderId: "194427279434",
	appId: "1:194427279434:web:afdb4e322b97da66966eb3",
	measurementId: "G-LN6MYTK2QZ"
};

firebase.initializeApp(firebaseConfig);

function App() {

	
	return (
		<>
			<BrowserRouter basename='/'>
				<Routes>
					<Route element={<Template />}>
						<Route path='/' element={<Home />}/>
					</Route>
					<Route path='*' element={<Notfound />}/>
				</Routes>
			</BrowserRouter>
		</>
	)
}

export default App

import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const Header = () => {
	const navigate = useNavigate();
	let [activeLink, setActiveLink] = useState('');
	const location = useLocation();


	let handleNavLinkClick = (link) => {
		setActiveLink(link);
		localStorage.setItem('activeLink', link);
		// Close the navbar when a link is clicked on mobile
		let navbarToggler = document.querySelector('.navbar-toggler');
		let navbarCollapse = document.querySelector('.navbar-collapse');
		if (navbarToggler && navbarCollapse) {
		navbarToggler.classList.add('collapsed');
		navbarCollapse.classList.remove('show');
		}
	};

	useEffect(() => {
		const storedActiveLink = localStorage.getItem('activeLink');
		if (storedActiveLink) {
		setActiveLink(storedActiveLink);
		}
	}, []);

	useEffect(() => {
		const currentPath = location.pathname;
		const link = currentPath.substring(1);
		setActiveLink(link);
	}, [location.pathname]);



	return (
		<header>
			<nav className="navbar navbar-expand-lg navbar-dark navbar-bg fixed-top">
				<div className="container-fluid">
				<button
					className="navbar-toggler"
					type="button"
					data-mdb-toggle="collapse"
					data-mdb-target="#navbarSupportedContent"
					aria-controls="navbarSupportedContent"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<i className="fas fa-bars"></i>
				</button>
				<div className="collapse navbar-collapse" id="navbarSupportedContent">
					<a className="navbar-brand mt-2 mt-lg-0" href="/">Online Gallery
					{/* <img
						src="../assets/images/brand/pokemonBrandName.png"
						height="30"
						alt="Pokemon"
						loading="lazy"
					/> */}
					</a>
		
					<ul className="navbar-nav me-auto mb-2 mb-lg-0">
						<li className="nav-item">
							<Link
							to="/"
							onClick={() => handleNavLinkClick('home')}
							className={`nav-link hvr-underline-from-center ${
								activeLink === 'pokedex' ? 'active' : ''
							}`}
							>
							Home
							</Link>
						</li>

						{/* <li className="nav-item">
							<Link
							to="/pokedex"
							onClick={() => handleNavLinkClick('pokedex')}
							className={`nav-link hvr-underline-from-center ${
								activeLink === 'pokedex' ? 'active' : ''
							}`}
							>
							Pokedex
							</Link>
						</li>

						<li className="nav-item">
							<Link
							to="/pokecard"
							onClick={() => handleNavLinkClick('pokecard')}
							className={`nav-link hvr-underline-from-center ${
								activeLink === 'pokedex' ? 'active' : ''
							}`}
							>
							Pokecard
							</Link>
						</li> */}
			
						{/* <li className="nav-item">
							<Link
							to="/about"
							onClick={() => handleNavLinkClick('about')}
							className={`nav-link hvr-underline-from-center ${
								activeLink === 'pokedex' ? 'active' : ''
							}`}
							>
							About
							</Link>
						</li> */}
					</ul>
		
					
		
				</div>
				</div>
			</nav>
		</header>
	);
}

export default Header
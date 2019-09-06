import React from 'react';
import { Link } from 'react-router-dom';
const Header = () => {
    return (
        <nav>
            <div className="nav-wrapper">
                <Link to={'/'} className="brand-logo">Eric's ChatBot</Link>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li><Link to={'/ask'}>What to Ask the ChatBot?</Link></li>
                    <li><Link to={'/about'}>About ChatBot</Link></li>
                </ul>
            </div>
        </nav>
    )
};

export default Header;
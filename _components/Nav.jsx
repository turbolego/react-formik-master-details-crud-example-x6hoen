import React from 'react';
import { NavLink } from 'react-router-dom';

function Nav() {
    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark">
            <div className="navbar-nav">
                <NavLink exact to="/" className="nav-item nav-link">Hjem</NavLink>
                <NavLink to="/users" className="nav-item nav-link">Foretak</NavLink>
            </div>
        </nav>
    );
}

export { Nav }; 
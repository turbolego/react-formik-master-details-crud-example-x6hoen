import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div>
            <h1>Prototype</h1>
            <p>Rediger eller opprett foretak for å teste med mock-data.</p>
            <p><Link to="users">Foretak</Link></p>
        </div>
    );
}

export { Home };
import React from 'react';
import HeaderVideo from './HeaderVideo';
import Navbar from './Navbar';


const Header = (props) => {
    return (
        <div>
            <Navbar ></Navbar>
            <HeaderVideo  ></HeaderVideo>
        </div>
    );
};

export default Header;
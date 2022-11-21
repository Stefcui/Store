import React from 'react';
import Footer from '../Footer/Footer';
import PageHome from '../Home/PageHome';
import Header from './../Header/Header';
import Social from './Social';
 



const MainBody = () => {

    return (
        <section >
            <Social></Social>
            <Header></Header>
            <PageHome></PageHome>
            <Footer></Footer>
        </section>
    );
};

export default MainBody;
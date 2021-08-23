import React from 'react';
import Banner from "./Banner";
import styled from "styled-components";
import {rem} from "../../helpers/common-function";
import Introduce from "./Introduce";
import GetCoin from "./GetCoin";
import ContactUs from "./ContactUs";
import Footer from "./Footer";

const LandingTemplate = () => {
    return (
        <div>
            <Layout>
                <Banner />
            </Layout>
            <Introduce />
            <GetCoin />
            <LayoutWhite>
                <ContactUs />
            </LayoutWhite>

            <Footer />
        </div>
    );
};

export default LandingTemplate;

const Layout = styled.div`
  max-width: ${rem`1440px`};
  margin: 0 auto;
`

const LayoutWhite = styled.div`
  max-width: ${rem`1440px`};
  margin: 0 auto;
  background-color: white;
`
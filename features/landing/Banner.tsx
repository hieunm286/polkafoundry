import React from 'react';
import styled from "styled-components";
import {CommonPTag, DEFAULT_DEVICE} from '../../constants/styles';
import {rem} from "../../helpers/common-function";
import {useIntl} from "react-intl";

const Banner = () => {
    const { formatMessage } = useIntl()
    return (
        <BannerContainer>
            <Title>PolkaFi</Title>
            <CommonPTag fSize={24} weight='normal' tAlign={`center`}>{formatMessage( {id:'homepage.bannerDescription'} )}</CommonPTag>
            <Button>{formatMessage( {id: 'homepage.learnMore' })}</Button>
        </BannerContainer>
    );
};

export default Banner;

//---------------------
const BannerContainer = styled.div`
  width: 57%;
  padding: ${rem`5px`} ${rem`10px`};
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  
  padding-bottom: ${rem`300px`};
`

const Title = styled.p`
  font-style: normal;
  font-weight: bold;
  font-size: ${rem`72px`};
  line-height: 150%;
  margin-bottom: ${rem`15px`};
  background: linear-gradient(
    to right,
    rgba(255, 160, 46, 1) 42%,
    rgba(189, 14, 193, 1) 50%,
    rgba(38, 242, 255, 1) 51%
  );
  
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(140.62deg, #903AFD -13.58%, #492CFF 102.52%);
  border-radius: ${rem`32px`};
  border: none;
  color: white;
  cursor: pointer;
  
  margin-top: ${rem`40px`};

  @media ${DEFAULT_DEVICE.laptop} {
    width: ${rem`255px`};
    height: ${rem`64px`};
  }
`
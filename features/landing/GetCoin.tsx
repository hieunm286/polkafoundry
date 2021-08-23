import React from 'react';
import styled from "styled-components";
import {rem} from "../../helpers/common-function";
import {CommonPTag, DEFAULT_DEVICE} from "../../constants/styles";
import {useIntl} from "react-intl";

const GetCoin = () => {
    const { formatMessage } = useIntl()
    return (
        <GetCoinContainer>
            <Layout>
                <GetCoinArea>
                    <CommonPTag fSize={36} weight={700}>
                        {formatMessage({ id: 'homepage.pUSDStable2' })}
                    </CommonPTag>
                    <CommonPTag fSize={16} weight={`normal`} m={`12px 0 48px`}>
                        {formatMessage({ id: 'homepage.tutorial' })}
                    </CommonPTag>
                    <ButtonGroup>
                        <Button bg={`#F8A335`}>{formatMessage({ id: 'homepage.borrowPUSD' })}</Button>
                        <Button>{formatMessage({ id: 'homepage.buyPUSD' })}</Button>
                    </ButtonGroup>
                </GetCoinArea>
            </Layout>
        </GetCoinContainer>
    );
};

export default GetCoin;

// ---------------------------
const GetCoinContainer = styled.div`
  background-color: white;
`

const Layout = styled.div`
  background: url("/images/background/img.png") top left no-repeat;
  background-size: contain;
  max-width: ${rem`1440px`};
  margin: 0 auto;
  min-height: ${rem`500px`};

`

const GetCoinArea = styled.div`
  @media ${DEFAULT_DEVICE.laptopL} {
    padding: ${rem`105px`} ${rem`165px`};
  }
`

const ButtonGroup = styled.div`
  display: flex;
`

const Button = styled.button<{ bg?: string }>`
  border: ${props => props.bg ? `1px solid ${props.bg}` : `1px solid white`};
  background-color: ${props => props.bg ?? 'transparent'};
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;
  
  @media ${DEFAULT_DEVICE.laptopL} {
    width: ${rem`130px`};
    height: ${rem`45px`};
    border-radius: ${rem`32px`};
    margin-right: ${rem(20)}

  }
`

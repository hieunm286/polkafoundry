import React from 'react';
import {Box, Grid} from "theme-ui";
import {useIntl} from "react-intl";
import CustomLoanInput from "../../components/CustomLoanInput";
import styled from "styled-components";
import {CommonPTag, CommonSpanTag, DEFAULT_DEVICE} from "../../constants/styles"
import {orange} from "../../constants/color";
import {rem} from "../../helpers/common-function";

const LoanEditing = () => {
  const { formatMessage } = useIntl()
  let div = <div>
    <Grid>
      <CustomLoanInput walletLabel={'In Wallet'} action={`Deposit`}/>
      <Divider>
        <CommonPTag fColor={orange}>----------------------</CommonPTag>
        <img src={'/images/icon/down.svg'} alt={''} />
        <CommonPTag fColor={orange}>----------------------</CommonPTag>
      </Divider>
      <CustomLoanInput walletLabel={'Max'} action={`Borrow`}/>
      <Button>
        <CommonSpanTag>Setup Proxy</CommonSpanTag>
      </Button>
    </Grid>
  </div>;
  return div;
};

export default LoanEditing;

const Divider = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const Button = styled.button`
  background: linear-gradient(to bottom, #903AFD -13.58%, #492CFF 102.52%);
  border-radius: 32px;
  margin: ${rem(20)} auto;
  border: none;
  cursor: pointer;
  @media ${DEFAULT_DEVICE.tablet} {
    width: ${rem(218)};
    height: ${rem(40)};
  }
`
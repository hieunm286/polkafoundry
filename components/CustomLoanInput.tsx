import React from "react"
import { Grid } from "theme-ui"
import { CommonPTag, CommonSpanTag } from "../constants/styles"
import styled from "styled-components"
import { useRecoilState } from "recoil"
import { inputValueCreateLoan } from "../recoil/atoms"
import {orange, vanilla} from "../constants/color"
import {rem} from "../helpers/common-function";

interface CustomLoanInput {
  action?: string
  walletLabel: string
}

const CustomLoanInput: React.FC<CustomLoanInput> = (props) => {
  const { action, walletLabel } = props
  const [value, setValue] = useRecoilState(inputValueCreateLoan)

  return (
    <div>
      <Grid columns={["1fr 2fr"]}>
        <div>
          {action && (
            <CommonPTag fSize={12} fColor={"white"} weight={700}>
              {action}
            </CommonPTag>
          )}
        </div>
        <WalletLabelGroup>
          <CommonSpanTag fSize={12} weight={400}>
            {walletLabel}
          </CommonSpanTag>
          <CommonSpanTag fSize={12} weight={700}>
            600 pUSD
          </CommonSpanTag>
        </WalletLabelGroup>
      </Grid>
      <Grid
        columns={["5fr 1fr"]}
        sx={{
          borderBottom: "1px solid",
          borderColor: vanilla,
          alignItems: "center",
          paddingBottom: 2
        }}
      >
        <Grid gap={0}>
          <InputBlock>
            <InputAmount value={value} onChange={(e) => setValue(e.target.value)} placeholder={`0 ETH`} />
            <CommonPTag fSize={12} weight={400} fColor={vanilla}>~0.00USDT</CommonPTag>
          </InputBlock>
        </Grid>
        <CommonPTag fSize={12} weight={700} fColor={orange}>MAX</CommonPTag>
      </Grid>
    </div>
  )
}

export default CustomLoanInput

const WalletLabelGroup = styled.p`
  text-align: right;
  margin: 0;
`

const InputBlock = styled.div`
  //border-bottom: 1px solid ${vanilla};
`

const InputAmount = styled.input`
  border: none;
  background-color: transparent;
  height: ${rem(40)};
  font-size: ${rem(24)};
  color: white;
  &::placeholder {
    font-size: ${rem(24)};
    color: white;
  }

  &:focus,
  &:active {
    border: none;
    outline: none;
    background-color: transparent;
  }
`

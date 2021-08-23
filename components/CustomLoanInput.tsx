import React, { useMemo } from "react"
import { Grid } from "theme-ui"
import { CommonPTag, CommonSpanTag } from "../constants/styles"
import styled from "styled-components"
import { gray, orange, vanilla } from "../constants/color"
import {formatInputNumber, rem} from "../helpers/common-function"

interface CustomLoanInputProp {
  value: string
  onChange: (e: any) => void
  action?: string
  walletLabel: string
  maxValue: string
  token: string
  showExchangeUSDT?: boolean
  disabled?: boolean
  showMax?: boolean
}

const CustomLoanInput: React.FC<CustomLoanInputProp> = (props) => {
  const {
    action,
    walletLabel,
    value,
    onChange,
    maxValue,
    token,
    showExchangeUSDT = true,
    disabled = false,
    showMax = true,
  } = props

  const mainColor = useMemo((): string => (disabled ? gray : "#FFFFFF"), [disabled])

  return (
    <Container disabled={disabled}>
      <Grid columns={["1fr 2fr"]}>
        <div>
          {action && (
            <CommonPTag fSize={12} fColor={mainColor} weight={700}>
              {action}
            </CommonPTag>
          )}
        </div>
        <WalletLabelGroup>
          <CommonSpanTag fSize={12} weight={400} fColor={mainColor}>
            {walletLabel}
          </CommonSpanTag>
          <CommonSpanTag fSize={12} weight={700} fColor={mainColor} m={`0 0 0 10px`}>
            {formatInputNumber(maxValue)} {token}
          </CommonSpanTag>
        </WalletLabelGroup>
      </Grid>
      <Grid
        columns={["5fr 1fr"]}
        sx={{
          borderBottom: "1px solid",
          borderColor: vanilla,
          alignItems: "center",
          paddingBottom: 2,
        }}
      >
        <Grid gap={0}>
          <InputBlock>
            <InputAmount
              value={value}
              onChange={onChange}
              placeholder={`0 ${token}`}
              fColor={mainColor}
              disabled={disabled}
            />
            {showExchangeUSDT && (
              <CommonPTag fSize={12} weight={400} fColor={vanilla}>
                ~0.00USDT
              </CommonPTag>
            )}
          </InputBlock>
        </Grid>
        {showMax && (
          <CommonPTag fSize={12} weight={700} fColor={orange}>
            MAX
          </CommonPTag>
        )}
      </Grid>
    </Container>
  )
}

export default CustomLoanInput

const Container = styled.div<{ disabled?: boolean }>`
  cursor: ${(props) => (props.disabled ? "not-allowed" : "initial")};
  pointer-events: ${(props) => (props.disabled ? "none" : "initial")};
`

const WalletLabelGroup = styled.p`
  text-align: right;
  margin: 0;
`

const InputBlock = styled.div`
  //border-bottom: 1px solid ${vanilla};
`

const InputAmount = styled.input<{ fColor: string; disabled: boolean }>`
  border: none;
  background-color: transparent;
  height: ${rem(40)};
  font-size: ${rem(24)};
  color: ${(props) => props.fColor};

  &::placeholder {
    font-size: ${rem(24)};
    color: ${(props) => props.fColor};
  }

  &:focus,
  &:active {
    border: none;
    outline: none;
    background-color: transparent;
  }
`

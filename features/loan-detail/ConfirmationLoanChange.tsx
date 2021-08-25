import React from "react"
import { CreateLoanTitle } from "../loan/CreateNewLoan"
import {Grid, Spinner} from "theme-ui"
import {CommonPTag, CommonSpanTag, DEFAULT_DEVICE, DivTextCenter} from "../../constants/styles"
import { rem } from "../../helpers/common-function"
import styled from "styled-components"
import { orange } from "../../constants/color"
import {CREATE_LOAN_STAGE} from "../../recoil/atoms";

const ConfirmExamData = [
  {
    label: "In wallet",
    value: "1.00005 ETH",
  },
  {
    label: "Remaining in Wallet",
    value: "0.1 ETH",
  },
  {
    label: "pUSD being borrowed",
    value: "600 ETH",
  },
  {
    label: "Collateral Ratio",
    value: "250%",
  },
  {
    label: "Liquidation Price",
    value: "$1,7400.05",
  },
]

interface Prop {
  onClickBack: () => void;
  onConfirm: () => void;
  loading?: boolean;
  tx?: string
}

const ConfirmationLoanChange: React.FC<Prop> = ({ onClickBack, onConfirm, loading = false, tx }) => {
  return (
    <>
      <CreateLoanTitle title={`Confirm Loan Changes`} lead={`Final review of loan details.`} />
      <Grid columns={["2fr 1fr"]} sx={{ marginTop: 4, marginBottom: 3 }}>
        {ConfirmExamData.map(({ label, value }, idx) => (
          <React.Fragment key={idx}>
            <CommonPTag fSize={14} weight={400}>
              {label}
            </CommonPTag>
            <CommonPTag fSize={14} weight={900} tAlign={`right`}>
              {value}
            </CommonPTag>
          </React.Fragment>
        ))}
      </Grid>
      <DivTextCenter>
        {tx ? (
          // Uncomment for moonbeam or kovan
          // <a
          //   href={`https://moonbase-blockscout.testnet.moonbeam.network/tx/${tx}`}
          //   target="_blank"
          //   rel={`noreferrer noopener`}
          // >
            <a href={`https://kovan.etherscan.io/tx/${tx}`} target="_blank" rel={`noreferrer noopener`}>
            <Button>
              <CommonSpanTag>View transaction</CommonSpanTag>
            </Button>
          </a>
        ) : (
          <Button onClick={onConfirm} disabled={loading}>
            {loading && <Spinner sx={{ color: "#500EC1", marginRight: 2 }} size={24} />}
            <CommonSpanTag>Confirm</CommonSpanTag>
          </Button>
        )}
        {
          !loading && (
            <CommonPTag
              pointer
              fSize={14}
              weight={900}
              fColor={orange}
              tAlign={"center"}
              m={"10px 0 0"}
              onClick={onClickBack}
            >
              Back to Loan Setup
            </CommonPTag>
          )
        }
      </DivTextCenter>
    </>
  )
}

export default ConfirmationLoanChange

//----------------------------------
const Button = styled.button`
  background: ${(props) =>
          props.disabled ? "#C8C6E5" : `linear-gradient(to bottom, #903afd -13.58%, #492cff 102.52%)`};
  border-radius: 32px;
  margin: ${rem(20)} auto 0;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;

  span {
    color: ${(props) => (props.disabled ? "#500EC1" : "white")};
  }

  @media ${DEFAULT_DEVICE.tablet} {
    width: ${rem(218)};
    height: ${rem(40)};
  }
`
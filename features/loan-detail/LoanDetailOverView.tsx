import React, { useMemo } from "react"
import { rem } from "../../helpers/common-function"
import styled from "styled-components"
import TemplateCreate from "../../components/TemplateCreate"
import { CREATE_LOAN_STAGE } from "../../recoil/atoms"
import { CommonPTag, Space } from "../../constants/styles"
import LoanEditing from "../loan/LoanEditing"
import CreateProxy from "../loan/CreateProxy"
import { Grid } from "theme-ui"

const LoanDetail = () => {
  const PUSDInfo = useMemo(
    (): { label: string; value: string }[] => [
      {
        label: "available",
        value: "1.08M pUSD",
      },
      {
        label: "liquidationRatio",
        value: "150%",
      },
      {
        label: "stabilityFee",
        value: "4.05%",
      },
      {
        label: "liquidationFee",
        value: "13.06%",
      },
      {
        label: "debtFloor",
        value: "100 pUSD",
      },
    ],
    [],
  )

  return (
    <CreateContainer>
      <TemplateCreate />
      <CreateCard>
        <>
          {/*<CreateLoanTitle title={`setUpLoad`} lead={`setUpLoanLead`} />*/}
          <Space top={25} />
          <LoanEditing />
        </>

        <Grid columns={[1]} sx={{ marginTop: "3" }}>
          {PUSDInfo.map(({ label, value }, idx) => (
            <Grid columns={["1fr 1fr"]} key={idx}>
              <CommonPTag fSize={12} weight={400}>
                {label}
              </CommonPTag>
              <CommonPTag fSize={12} weight={900} tAlign={`right`}>
                {value}
              </CommonPTag>
            </Grid>
          ))}
        </Grid>
      </CreateCard>
    </CreateContainer>
  )
}

export default LoanDetail

//----------------------------
const CreateContainer = styled.div`
  position: relative;
`

const CreateCard = styled.div`
  position: absolute;
  background-color: #3c2b6c;
  min-height: 100%;
  width: ${rem(350)};
  border-radius: ${rem(15)};

  top: ${rem(-15)};
  right: 10%;

  padding: ${rem(30)} ${rem(35)};
`

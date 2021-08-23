import React, {useMemo} from "react"
import TemplateCreate from "../../components/TemplateCreate"
import styled from "styled-components"
import { rem } from "../../helpers/common-function"
import { CommonPTag, Space } from "../../constants/styles"
import LoanEditing from "./LoanEditing"
import { useTranslation } from "next-i18next"
import { useRecoilValue } from "recoil"
import { CREATE_LOAN_STAGE, createLoanStage } from "../../recoil/atoms"
import CreateProxy from "./CreateProxy"
import {Grid} from "theme-ui";

export const CreateLoanTitle = ({ title, lead }: { title?: string; lead?: string }) => {
  const { t } = useTranslation()

  return (
    <>
      {
        title && (
          <CommonPTag fSize={20} fColor={"white"} weight={700} m={`0 0 10px`}>
            {t(title)}
          </CommonPTag>
        )
      }

      {lead && (
        <CommonPTag fSize={14} fColor={"white"} weight={400} m={"0"}>
          {t(lead)}
        </CommonPTag>
      )}
    </>
  )
}

const CreateNewLoan = ({ ilk }: { ilk: string }) => {
  console.log(ilk)
  const createStage = useRecoilValue(createLoanStage)

  const PUSDInfo = useMemo((): {label: string; value: string}[] => ([
    {
      label: 'available',
      value: '1.08M pUSD'
    },
    {
      label: 'liquidationRatio',
      value: '150%'
    },
    {
      label: 'stabilityFee',
      value: '4.05%'
    },
    {
      label: 'liquidationFee',
      value: '13.06%'
    },
    {
      label: 'debtFloor',
      value: '100 pUSD'
    },
  ]), [])

  return (
    <CreateContainer>
      <TemplateCreate title={"Create new ETH-1 Loan"} />
      <CreateCard>
        {createStage === CREATE_LOAN_STAGE.editForm && (
          <>
            <CreateLoanTitle title={`setUpLoad`} lead={`setUpLoanLead`} />
            <Space top={25} />
            <LoanEditing ilk={ilk} />
          </>
        )}
        {createStage === CREATE_LOAN_STAGE.createProxy && (
          <>
            <CreateLoanTitle
              title={`Create your smart Proxy
`}
              lead={`With your smart proxy we can perform multiple actions in one transaction for your Vault. This proxy only needs to be set up once.`}
            />
            <Space top={25} />
            <CreateProxy />
          </>
        )}

        <Grid columns={[1]} sx={{ marginTop: '3' }}>
          {
            PUSDInfo.map(({ label, value }, idx) => (
              <Grid columns={['1fr 1fr']} key={idx}>
                <CommonPTag fSize={12} weight={400}>{label}</CommonPTag>
                <CommonPTag fSize={12} weight={900} tAlign={`right`}>{value}</CommonPTag>
              </Grid>
            ))
          }
        </Grid>
      </CreateCard>
    </CreateContainer>
  )
}

export default CreateNewLoan

//------------------------
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

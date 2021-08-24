import React, { useEffect, useMemo, useState } from "react"
import TemplateCreate from "../../components/TemplateCreate"
import styled from "styled-components"
import {formatInputNumber, ilkToToken, rem} from "../../helpers/common-function"
import { CommonPTag, Space } from "../../constants/styles"
import LoanEditing from "./LoanEditing"
import { useTranslation } from "next-i18next"
import { useRecoilState, useRecoilValue } from "recoil"
import {
  CREATE_LOAN_STAGE,
  createLoanStage,
  inputValueCreateLoanBorrow,
  inputValueCreateLoanDeposite,
} from "../../recoil/atoms"
import CreateProxy from "./CreateProxy"
import { Grid } from "theme-ui"
import { createOraclePriceData$ } from "../../helpers/pip/oracle"
import { createIlkData$ } from "../../helpers/ilks"
import {TagFilter} from "../../helpers/model";
import {BigNumber} from "bignumber.js";

export const CreateLoanTitle = ({ title, lead }: { title?: string; lead?: string }) => {
  const { t } = useTranslation()

  return (
    <>
      {title && (
        <CommonPTag fSize={20} fColor={"white"} weight={700} m={`0 0 10px`}>
          {t(title)}
        </CommonPTag>
      )}

      {lead && (
        <CommonPTag fSize={14} fColor={"white"} weight={400} m={"0"}>
          {t(lead)}
        </CommonPTag>
      )}
    </>
  )
}

export const caculateLiquidationPrice = (deposit: string, borrow: string, maxDebt: string, currentPrice: string) => {
  const intDeposit = deposit ? parseFloat(deposit) : 0
  const intBorrow = borrow ? parseFloat(borrow) : 0
  const intMaxDebt = parseFloat(maxDebt)
  const intCurrentPrice = parseFloat(currentPrice)

  if (intDeposit === 0 || intBorrow === 0) return formatInputNumber('0')

  const rs = intBorrow / intMaxDebt / intDeposit * intCurrentPrice
  return formatInputNumber(rs)
}

const CreateNewLoan = ({ ilk }: { ilk: string }) => {
  console.log(ilk)
  const createStage = useRecoilValue(createLoanStage)
  const [loanInfo, setLoanInfo] = useState<any>()
  const [tagFilter, setTagFilter] = useState<TagFilter>("loanDetail")
  const { t } = useTranslation()

  const onTagChain = (tagFilter: TagFilter) => {
    setTagFilter(tagFilter)
  }

  const options: { value: TagFilter; label: string }[] = [
    {
      value: "loanDetail",
      label: t("filters.loanDetail"),
    },
    // {
    //   value: "loanHistory",
    //   label: t("filters.loanHistory"),
    // },
  ]

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

  useEffect(() => {
    const setup = async () => {
      try {
        const token = ilkToToken(ilk)
        const oracleData = await createOraclePriceData$(token)
        const ilkData = await createIlkData$(ilk)

        console.log(oracleData)
        console.log(ilkData)

        setLoanInfo({
          ...oracleData,
          ...ilkData,
        })
      } catch (err) {}
    }

    void setup()
  }, [])

  const onChangeAmount = (amount: string, kind: "borrow" | "deposit") => {
    console.log(amount)
    if (loanInfo?.maxDebtPerUnitCollateral && loanInfo?.currentPrice) {
      if (kind === "borrow") {
        const liquidationPrice = caculateLiquidationPrice(loanInfo?.deposit ?? '0', amount, formatInputNumber(loanInfo?.maxDebtPerUnitCollateral?.toString()), formatInputNumber(loanInfo?.currentPrice.toString()))
        const big = new BigNumber(liquidationPrice)
        setLoanInfo({ ...loanInfo, liquidationPrice: big, [kind]: amount || undefined })
      } else if (kind === "deposit") {
        const liquidationPrice = caculateLiquidationPrice(amount, loanInfo?.borrow ?? '0', formatInputNumber(loanInfo?.maxDebtPerUnitCollateral?.toString()), formatInputNumber(loanInfo?.currentPrice.toString()))
        const big = new BigNumber(liquidationPrice)
        setLoanInfo({ ...loanInfo, liquidationPrice: big, [kind]: amount || undefined })
      }
    }

  }

  console.log(loanInfo)

  return (
    <CreateContainer>
      <TemplateCreate title={"Create new ETH-1 Loan"} loanInfo={loanInfo} tagFilter={tagFilter} options={options} onTagChain={onTagChain} />
      <CreateCard>
        {(createStage === CREATE_LOAN_STAGE.editForm || createStage === CREATE_LOAN_STAGE.confirmation) && (
          <>
            <CreateLoanTitle title={createStage !== CREATE_LOAN_STAGE.confirmation ? `setUpLoad` : `confirmLoanCreation`} lead={createStage !== CREATE_LOAN_STAGE.confirmation ? `setUpLoanLead` : `finalReview`} />
            <Space top={25} />
            <LoanEditing ilk={ilk} onChangeAmount={onChangeAmount} maxDebt={loanInfo?.maxDebtPerUnitCollateral} />
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
        {
          createStage !== CREATE_LOAN_STAGE.confirmation && (
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
          )
        }

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

import React, { useEffect, useMemo, useState } from "react"
import TemplateCreate from "../../components/TemplateCreate"
import styled from "styled-components"
import {
  formatCryptoBalance,
  formatInputNumber,
  formatPercent,
  ilkToToken,
  rem,
} from "../../helpers/common-function"
import { CommonPTag, Space } from "../../constants/styles"
import LoanEditing from "./LoanEditing"
import { useTranslation } from "next-i18next"
import { useRecoilValue, useSetRecoilState } from "recoil"
import {
  CREATE_LOAN_STAGE,
  createLoanStage,
  pageLoading,
} from "../../recoil/atoms"
import CreateProxy from "./CreateProxy"
import { createOraclePriceData$ } from "../../helpers/pip/oracle"
import { createIlkData$ } from "../../helpers/ilks"
import { TagFilter } from "../../helpers/model"
import { BigNumber } from "bignumber.js"
import LoanInformation from "../../components/LoanInformation"

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

export const caculateLiquidationPrice = (
  deposit: string,
  borrow: string,
  maxDebt: string,
  currentPrice: string,
) => {
  const intDeposit = deposit ? parseFloat(deposit) : 0
  const intBorrow = borrow ? parseFloat(borrow) : 0
  const intMaxDebt = parseFloat(maxDebt)
  const intCurrentPrice = parseFloat(currentPrice)

  if (intDeposit === 0 || intBorrow === 0) return formatInputNumber("0")

  const rs = (intBorrow / intMaxDebt / intDeposit) * intCurrentPrice
  return formatInputNumber(rs)
}

const CreateNewLoan = ({ ilk }: { ilk: string }) => {
  const createStage = useRecoilValue(createLoanStage)
  const [loanInfo, setLoanInfo] = useState<any>()
  const [tagFilter, setTagFilter] = useState<TagFilter>("loanDetail")
  const { t } = useTranslation()
  const setSpinning = useSetRecoilState(pageLoading)

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
        value: loanInfo ? `${formatCryptoBalance(loanInfo?.ilkDebtAvailable)} pUSD` : "0 pUSD",
      },
      {
        label: "liquidationRatio",
        value: loanInfo ? formatPercent(loanInfo?.liquidationRatio?.times(100)) : "0%",
      },
      {
        label: "stabilityFee",
        value: loanInfo
          ? formatPercent(loanInfo?.stabilityFee?.times(100), { precision: 2 })
          : "0%",
      },
      {
        label: "liquidationFee",
        value: loanInfo ? formatPercent(loanInfo?.liquidationPenalty?.times(100)) : "0%",
      },
      {
        label: "debtFloor",
        value: loanInfo ? `${formatCryptoBalance(loanInfo?.debtFloor)} pUSD` : "0 pUSD",
      },
    ],
    [loanInfo],
  )

  useEffect(() => {
    const setup = async () => {
      try {
        setSpinning(true)
        const token = ilkToToken(ilk)
        const oracleData = await createOraclePriceData$(token)
        const ilkData = await createIlkData$(ilk)

        setLoanInfo({
          ...oracleData,
          ...ilkData,
        })
        setSpinning(false)
      } catch (err) {
        setSpinning(false)
      }
    }

    void setup()
  }, [])

  const onChangeAmount = (amount: string, kind: "borrow" | "deposit") => {
    console.log(amount)
    if (loanInfo?.maxDebtPerUnitCollateral && loanInfo?.currentPrice) {
      if (kind === "borrow") {
        const liquidationPrice = caculateLiquidationPrice(
          loanInfo?.deposit ?? "0",
          amount,
          formatInputNumber(loanInfo?.maxDebtPerUnitCollateral?.toString()),
          formatInputNumber(loanInfo?.currentPrice.toString()),
        )
        const big = new BigNumber(liquidationPrice)
        setLoanInfo({ ...loanInfo, liquidationPrice: big, [kind]: amount || undefined })
      } else if (kind === "deposit") {
        const liquidationPrice = caculateLiquidationPrice(
          amount,
          loanInfo?.borrow ?? "0",
          formatInputNumber(loanInfo?.maxDebtPerUnitCollateral?.toString()),
          formatInputNumber(loanInfo?.currentPrice.toString()),
        )
        const big = new BigNumber(liquidationPrice)
        setLoanInfo({ ...loanInfo, liquidationPrice: big, [kind]: amount || undefined })
      }
    }
  }

  console.log(loanInfo)
  const review = useMemo(
    (): { label: string; value: string }[] => [
      {
        label: "stabilityFee",
        value: loanInfo
          ? formatPercent(loanInfo?.stabilityFee?.times(100), { precision: 2 })
          : "0%",
      },
      {
        label: "liquidationFee",
        value: loanInfo ? formatPercent(loanInfo?.liquidationPenalty?.times(100)) : "0%",
      },
    ],
    [loanInfo],
  )

  return (
    <CreateContainer>
      <TemplateCreate
        title={"Create new ETH-1 Loan"}
        loanInfo={loanInfo}
        tagFilter={tagFilter}
        options={options}
        onTagChain={onTagChain}
      />
      <CreateCard>
        {(createStage === CREATE_LOAN_STAGE.editForm ||
          createStage === CREATE_LOAN_STAGE.confirmation) && (
          <>
            <CreateLoanTitle
              title={
                createStage !== CREATE_LOAN_STAGE.confirmation ? `setUpLoad` : `confirmLoanCreation`
              }
              lead={
                createStage !== CREATE_LOAN_STAGE.confirmation ? `setUpLoanLead` : `finalReview`
              }
            />
            <Space top={25} />
            <LoanEditing
              ilk={ilk}
              onChangeAmount={onChangeAmount}
              maxDebt={loanInfo?.maxDebtPerUnitCollateral}
              review={review}
              currentPrice={loanInfo?.currentPrice}
              liquidationPrice={loanInfo?.liquidationPrice}
              debtFloor={loanInfo?.debtFloor}
            />
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
        {(createStage !== CREATE_LOAN_STAGE.confirmation && createStage !== CREATE_LOAN_STAGE.createProxy) && <LoanInformation loanInfo={PUSDInfo} />}
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

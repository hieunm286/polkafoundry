import React, { useMemo } from "react"
import { MANAGE_LOAN_STAGE, manageLoanStage, proxyAccountAddress } from "../../recoil/atoms"
import { CommonPTag, Space } from "../../constants/styles"
import LoanDetailEditing from "./LoanDetailEditing"
import { useRecoilState, useRecoilValue } from "recoil"
import { useTranslation } from "next-i18next"
import { TagFilter } from "../../helpers/model"
import CreateProxy from "../loan/CreateProxy"
import { CreateLoanTitle } from "../loan/CreateNewLoan"
import { ethers } from "ethers"
import {formatCryptoBalance, formatInputNumber, formatPercent, multi, sub} from "../../helpers/common-function"
import LoanInformation from "../../components/LoanInformation"
import { getAvailableToWithdraw } from "../../components/TemplateCreate"
import { EditLoan } from "./LoanDetailOverView"

interface PUSDProps {
  tagFilter: TagFilter
  loanInfo: any
  onNewEditLoan: (data: EditLoan) => void;
  resetEditLoan: () => void
}

const PUSDFilter: React.FC<PUSDProps> = ({ loanInfo, onNewEditLoan, resetEditLoan }) => {
  const { t } = useTranslation()
  const [manageStage, setManageStage] = useRecoilState(manageLoanStage)
  const userProxy = useRecoilValue(proxyAccountAddress)

  const onClickNext = () => {
    if (userProxy === ethers.constants.AddressZero) {
      setManageStage(MANAGE_LOAN_STAGE.createProxy)
    } else {
      setManageStage(MANAGE_LOAN_STAGE.confirmation)
    }
  }

  const onClickBack = () => {
    setManageStage(MANAGE_LOAN_STAGE.editForm)
  }

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

  const onNewInfo = (
    deposit: string,
    borrow: string,
    newLiquidation: string,
    newCollRatio: string,
  ) => {
    const newAvailableToBorrow = sub(
      multi(deposit, loanInfo?.maxDebtPerUnitCollateral?.toString(), 5),
      borrow,
    )
    const newAvailableToWithdraw = getAvailableToWithdraw(
      deposit,
      borrow,
      loanInfo?.maxDebtPerUnitCollateral?.toString(),
    )
    const newData: EditLoan = {
      newDeposit: formatInputNumber(deposit, 2),
      newBorrow: formatInputNumber(borrow, 2),
      newLiquidation,
      newCollRatio,
      newAvailableToBorrow: formatInputNumber(newAvailableToBorrow, 2),
      newAvailableToWithdraw,
    }

    onNewEditLoan(newData)
  }

  return (
    <>
      {(manageStage === MANAGE_LOAN_STAGE.editForm ||
        manageStage === MANAGE_LOAN_STAGE.confirmation) && (
        <>
          <>
            {!(manageStage === MANAGE_LOAN_STAGE.confirmation) && (
              <>
                <CommonPTag fSize={14} fColor={"white"} weight={400} m={"-15px 0 0"}>
                  {t("borrowMore")}
                </CommonPTag>
                <Space top={25} />
              </>
            )}
            <LoanDetailEditing
              onClickNext={onClickNext}
              loanInfo={loanInfo}
              onNewInfo={onNewInfo}
              resetEditLoan={resetEditLoan}
            />
          </>
          {manageStage !== MANAGE_LOAN_STAGE.confirmation && (
            <LoanInformation loanInfo={PUSDInfo} />
          )}
        </>
      )}
      {manageStage === MANAGE_LOAN_STAGE.createProxy && (
        <>
          <CreateLoanTitle
            title={`Create your smart Proxy
`}
            lead={`With your smart proxy we can perform multiple actions in one transaction for your Vault. This proxy only needs to be set up once.`}
          />
          <Space top={25} />
          <CreateProxy onClickBack={onClickBack} />
        </>
      )}
    </>
  )
}

export default PUSDFilter

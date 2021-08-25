import React, {useMemo} from "react"
import { useTranslation } from "next-i18next"
import { useRecoilState } from "recoil"
import { MANAGE_LOAN_STAGE, manageLoanStage } from "../../recoil/atoms"
import { CommonPTag, Space } from "../../constants/styles"
import MoreInformation from "./MoreInformation"
import ConfirmationLoanChange from "./ConfirmationLoanChange"
import { TagFilter } from "../../helpers/model"
import CollateralEditing from "./CollateralEditing"
import {CreateLoanTitle} from "../loan/CreateNewLoan";
import CreateProxy from "../loan/CreateProxy";
import LoanInformation from "../../components/LoanInformation";
import {formatCryptoBalance, formatPercent} from "../../helpers/common-function";

interface CollateralProp {
  tagFilter: TagFilter;
  loanInfo: any
}

const Collateral: React.FC<CollateralProp> = ({ loanInfo }) => {
  const { t } = useTranslation()
  const [manageStage, setManageStage] = useRecoilState(manageLoanStage)

  const onClickNext = () => {
    setManageStage(MANAGE_LOAN_STAGE.confirmationCollateral)
  }

  const onClickBack = () => {
    setManageStage(MANAGE_LOAN_STAGE.editFormCollateral)
  }

  const PUSDInfo = useMemo(
    (): { label: string; value: string }[] => [
      {
        label: "available",
        value: loanInfo ? `${formatCryptoBalance(loanInfo?.ilkDebtAvailable)} pUSD` : '0 pUSD',
      },
      {
        label: "liquidationRatio",
        value: loanInfo ? formatPercent(loanInfo?.liquidationRatio?.times(100)) : '0%',
      },
      {
        label: "stabilityFee",
        value: loanInfo ? formatPercent(loanInfo?.stabilityFee?.times(100), { precision: 2 }) : '0%',
      },
      {
        label: "liquidationFee",
        value: loanInfo ? formatPercent(loanInfo?.liquidationPenalty?.times(100)) : '0%',
      },
      {
        label: "debtFloor",
        value: loanInfo ? `${formatCryptoBalance(loanInfo?.debtFloor)} pUSD` : '0 pUSD',
      },
    ],
    [loanInfo],
  )

  return (
    <>
      {(manageStage === MANAGE_LOAN_STAGE.editFormCollateral || manageStage === MANAGE_LOAN_STAGE.confirmationCollateral) && (
        <>
          <>
            <CommonPTag fSize={14} fColor={"white"} weight={400} m={"-15px 0 0"}>
              {t("borrowMore")}
            </CommonPTag>
            <Space top={25} />
            <CollateralEditing onClickNext={onClickNext} loanInfo={loanInfo} />
          </>
          {
            manageStage !== MANAGE_LOAN_STAGE.confirmationCollateral && <LoanInformation loanInfo={PUSDInfo} />

          }
        </>
      )}
      {manageStage === MANAGE_LOAN_STAGE.createProxyCollateral && (
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

export default Collateral

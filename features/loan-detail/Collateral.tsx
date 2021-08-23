import React from "react"
import { useTranslation } from "next-i18next"
import { useRecoilState } from "recoil"
import { MANAGE_LOAN_STAGE, manageLoanStage } from "../../recoil/atoms"
import { CommonPTag, Space } from "../../constants/styles"
import MoreInformation from "./MoreInformation"
import ConfirmationLoanChange from "./ConfirmationLoanChange"
import { TagFilter } from "../../helpers/model"
import CollateralEditing from "./CollateralEditing"

interface CollateralProp {
  tagFilter: TagFilter
}

const Collateral: React.FC<CollateralProp> = () => {
  const { t } = useTranslation()
  const [manageStage, setManageStage] = useRecoilState(manageLoanStage)

  const onClickNext = () => {
    setManageStage(MANAGE_LOAN_STAGE.confirmationCollateral)
  }

  const onClickBack = () => {
    setManageStage(MANAGE_LOAN_STAGE.editFormCollateral)
  }
  return (
    <>
      {manageStage === MANAGE_LOAN_STAGE.editFormCollateral && (
        <>
          <>
            <CommonPTag fSize={14} fColor={"white"} weight={400} m={"-15px 0 0"}>
              {t("borrowMore")}
            </CommonPTag>
            <Space top={25} />
            <CollateralEditing onClickNext={onClickNext} />
          </>

          <MoreInformation />
        </>
      )}
      {manageStage === MANAGE_LOAN_STAGE.confirmationCollateral && (
        <ConfirmationLoanChange onClickBack={onClickBack} />
      )}
    </>
  )
}

export default Collateral

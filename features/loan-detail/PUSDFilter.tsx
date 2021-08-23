import React from "react"
import { MANAGE_LOAN_STAGE, manageLoanStage } from "../../recoil/atoms"
import { CommonPTag, Space } from "../../constants/styles"
import LoanDetailEditing from "./LoanDetailEditing"
import MoreInformation from "./MoreInformation"
import ConfirmationLoanChange from "./ConfirmationLoanChange"
import { useRecoilState } from "recoil"
import { useTranslation } from "next-i18next"
import { TagFilter } from "../../helpers/model"

interface PUSDProps {
  tagFilter: TagFilter
}

const PUSDFilter: React.FC<PUSDProps> = () => {
  const { t } = useTranslation()
  const [manageStage, setManageStage] = useRecoilState(manageLoanStage)

  const onClickNext = () => {
    setManageStage(MANAGE_LOAN_STAGE.confirmation)
  }

  const onClickBack = () => {
    setManageStage(MANAGE_LOAN_STAGE.editForm)
  }

  return (
    <>
      {manageStage === MANAGE_LOAN_STAGE.editForm && (
        <>
          <>
            <CommonPTag fSize={14} fColor={"white"} weight={400} m={"-15px 0 0"}>
              {t("borrowMore")}
            </CommonPTag>
            <Space top={25} />
            <LoanDetailEditing onClickNext={onClickNext} />
          </>

          <MoreInformation />
        </>
      )}
      {manageStage === MANAGE_LOAN_STAGE.confirmation && (
        <ConfirmationLoanChange onClickBack={onClickBack} />
      )}
    </>
  )
}

export default PUSDFilter

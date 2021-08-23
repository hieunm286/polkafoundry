import React, { useMemo, useState } from "react"
import { rem } from "../../helpers/common-function"
import styled from "styled-components"
import TemplateCreate from "../../components/TemplateCreate"
import { MANAGE_LOAN_STAGE, manageLoanStage } from "../../recoil/atoms"
import { FiltersWithPopular } from "../vaults-list/FiltersWithPopular"
import { TagFilter } from "../../helpers/model"
import { useTranslation } from "next-i18next"
import { useRecoilState } from "recoil"
import PUSDFilter from "./PUSDFilter"
import Collateral from "./Collateral"

const LoanDetailOverView = ({ loan }: { loan: string }) => {
  const { t } = useTranslation()
  const [tagFilter, setTagFilter] = useState<TagFilter>("pUSD")
  const [manageStage, setManageState] = useRecoilState(manageLoanStage)

  const options = useMemo(
    (): { value: TagFilter; label: string }[] => [
      {
        value: "pUSD",
        label: t("filters.pUSD"),
      },
      {
        value: "collateral",
        label: t("filters.collateral"),
      },
    ],
    [],
  )

  const onTagChain = (tagFilter: TagFilter) => {
    setTagFilter(tagFilter)
    if (tagFilter === "pUSD") {
      setManageState(MANAGE_LOAN_STAGE.editForm)
    } else {
      setManageState(MANAGE_LOAN_STAGE.editFormCollateral)
    }
  }

  return (
    <CreateContainer>
      <TemplateCreate title={"ETH-1 Loan # " + loan} />
      <CreateCard>
        {(manageStage === MANAGE_LOAN_STAGE.editForm ||
          manageStage === MANAGE_LOAN_STAGE.editFormCollateral) && (
          <FiltersWithPopular
            onTagChange={onTagChain}
            tagFilter={tagFilter}
            defaultTag={"pUSD"}
            page={"Loan detail"}
            searchPlaceholder={t("search-token")}
            options={options}
          />
        )}

        {tagFilter === "pUSD" && <PUSDFilter tagFilter={tagFilter} />}
        {tagFilter === "collateral" && <Collateral tagFilter={tagFilter} />}
      </CreateCard>
    </CreateContainer>
  )
}

export default LoanDetailOverView

//----------------------------
const CreateContainer = styled.div`
  position: relative;
`

const CreateCard = styled.div`
  position: absolute;
  background-color: #3c2b6c;
  height: calc(100% + 15px);
  width: ${rem(350)};
  border-radius: ${rem(15)};

  top: ${rem(-15)};
  right: 10%;

  padding: ${rem(30)} ${rem(35)};

  overflow-y: auto;
`

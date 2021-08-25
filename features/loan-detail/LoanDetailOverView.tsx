import React, { useEffect, useMemo, useState } from "react"
import { ilkToToken, rem } from "../../helpers/common-function"
import styled from "styled-components"
import TemplateCreate from "../../components/TemplateCreate"
import {MANAGE_LOAN_STAGE, manageLoanStage, pageLoading, triggerUpdate} from "../../recoil/atoms"
import { FiltersWithPopular } from "../vaults-list/FiltersWithPopular"
import { TagFilter } from "../../helpers/model"
import { useTranslation } from "next-i18next"
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil"
import PUSDFilter from "./PUSDFilter"
import Collateral from "./Collateral"
import { fetchLoanById } from "../loan-overview/LoanOverviewHandle"
import { createOraclePriceData$ } from "../../helpers/pip/oracle"
import { createIlkData$ } from "../../helpers/ilks"
import PageSpinning from "../../components/PageSpinning";

const getCollateral = () => {}

const LoanDetailOverView = ({ loan }: { loan: string }) => {
  const { t } = useTranslation()
  const [tagFilter, setTagFilter] = useState<TagFilter>("pUSD")
  const [manageStage, setManageState] = useRecoilState(manageLoanStage)
  const [loanInfo, setLoanInfo] = useState<any>()
  const [detailTagFilter, setDetailTagFilter] = useState<TagFilter>("loanDetail")
  const setPageLoading = useSetRecoilState(pageLoading)
  const trigger = useRecoilValue(triggerUpdate)

  const onDetailTagChain = (tagFilter: TagFilter) => {
    setDetailTagFilter(tagFilter)
  }

  const detailOptions: { value: TagFilter; label: string }[] = [
    {
      value: "loanDetail",
      label: t("filters.loanDetail"),
    },
    {
      value: "loanHistory",
      label: t("filters.loanHistory"),
    },
  ]

  useEffect(() => {
    const data = async () => {
      try {
        setPageLoading(true)
        const detail = await fetchLoanById(loan)
        const token = ilkToToken(detail.ilk)
        const oracleData = await createOraclePriceData$(token)
        const ilkData = await createIlkData$(detail.ilk)
        const rs = {
          ...oracleData,
          ...ilkData,
          detailData: detail,
        }
        setLoanInfo(rs)
        setPageLoading(false)
      } catch (err) {

      } finally {
        setPageLoading(false)

      }

    }

    void data()
  }, [loan, trigger])

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
      <TemplateCreate
        title={"ETH-A Loan # " + loan}
        loanInfo={loanInfo}
        tagFilter={detailTagFilter}
        options={detailOptions}
        onTagChain={onDetailTagChain}
      />
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

        {tagFilter === "pUSD" && <PUSDFilter tagFilter={tagFilter} loanInfo={loanInfo} />}
        {tagFilter === "collateral" && <Collateral tagFilter={tagFilter} loanInfo={loanInfo} />}
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
  z-index: 100;
  overflow-y: auto;
`

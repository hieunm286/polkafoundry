import React, { useMemo } from "react"
import styled from "styled-components"
import {
  formatCryptoBalance,
  formatFiatBalance,
  formatInputNumber,
  formatPercent,
  rem,
} from "../helpers/common-function"
import { CommonPTag, CommonSpanTag, DEFAULT_DEVICE, defaultBg, Space } from "../constants/styles"
import { fire, lightGreen, orange, silver, vanilla } from "../constants/color"
import { FiltersWithPopular } from "../features/vaults-list/FiltersWithPopular"
import { LoanDetail, LoanHistory, TagFilter } from "../helpers/model"
import { loadDetailTest } from "../constants/variables"
import { Box, Grid, Text } from "theme-ui"
import { ColumnDef, Table } from "./Table"
import moment from "moment"
import Link from "next/link"
import { Trans, useTranslation } from "next-i18next"

interface TemplateProp {
  title: string
  tagFilter: TagFilter
  onTagChain: (tagFilter: TagFilter) => void
  options: { value: TagFilter; label: string }[]
  loanInfo?: {
    [X: string]: any
  }
}

const getAvailableToWithdraw = (
  deposit: string,
  borrow: string,
  maxDebtPerUnitCollateral: string,
) => {
  const intDeposit = parseFloat(deposit)
  const intBorrow = parseFloat(borrow)
  const intMaxDebt = parseFloat(maxDebtPerUnitCollateral)

  const rs = intDeposit - intBorrow / intMaxDebt

  console.log(rs)

  if (rs <= 0) {
    // return formatInputNumber("0")
  }

  return formatInputNumber(rs)
}

const loanHistoryColumn: ColumnDef<LoanHistory, any>[] = [
  {
    headerLabel: "table.action",
    header: (abc) => {
      console.log(abc)
      return <p>{abc.label}</p>
    },
    cell: ({ action }) => <>{action}</>,
  },
  {
    headerLabel: "table.amount",
    header: ({ label }) => <p>{label}</p>,
    cell: ({ amount, token }) => (
      <>
        <CommonSpanTag fSize={16} weight={500}>
          {amount}
        </CommonSpanTag>{" "}
        {token && (
          <CommonSpanTag fSize={16} weight={500}>
            {token}
          </CommonSpanTag>
        )}
      </>
    ),
  },
  {
    headerLabel: "table.time",
    header: ({ label }) => <p>{label}</p>,
    cell: () => (
      <Text sx={{ textAlign: "right" }}>{moment(new Date()).format("DD/MM/YYYY HH:ss")}</Text>
    ),
  },
  {
    headerLabel: "table.txtHash",
    header: ({ label }) => <Text>{label}</Text>,
    cell: () => (
      <Box sx={{ flexGrow: 1, textAlign: "right" }}>
        <Link href={`/`}>
          <CommonPTag fSize={16} fColor={lightGreen} weight={500}>
            <Trans i18nKey={"viewOnPolkadot"} />
          </CommonPTag>
        </Link>
      </Box>
    ),
  },
]

export const caculateCollRatio = (currentPrice: string, borrow: string, deposit: string) => {
  console.log("1111")
  if (!borrow || borrow === "" || !deposit || deposit === "") return "0%"
  const intCurrentPrice = parseFloat(currentPrice) || 0
  const intBorrow = parseFloat(borrow) || 0
  const intDeposit = parseFloat(deposit) || 0

  if (intCurrentPrice === 0 || intBorrow === 0) return "0%"

  console.log((intDeposit * intCurrentPrice) / intBorrow)
  console.log(intBorrow)

  return formatInputNumber(((intDeposit * intCurrentPrice) / intBorrow) * 100) + "%"
}

const TemplateCreate: React.FC<TemplateProp> = ({
  title,
  loanInfo,
  tagFilter,
  options,
  onTagChain,
}) => {
  const { t } = useTranslation()

  const {
    liquidationPrice,
    collateralizationRatio,
    lockedCollateral,
    token,
    borrow,
    deposit,
    stabilityFee,
    liquidationRatio,
    liquidationPenalty,
    maxDebtPerUnitCollateral,
    currentPrice,
    nextPriceUpdate,
    nextPrice,
    detailData,
  } = loanInfo ?? {}

  const loanDetail = useMemo(
    (): LoanDetail[] => [
      {
        label: t("loanDetail.outstandingDebt"),
        value: detailData ? formatFiatBalance(detailData.debt) : borrow ?? 0,
        token: "pUSD",
      },
      {
        label: t("loanDetail.availableToBorrow"),
        value: detailData
          ? formatFiatBalance(detailData.availableDebt)
          : deposit && maxDebtPerUnitCollateral
          ? formatInputNumber(
              parseFloat(deposit) *
                parseFloat(formatInputNumber(maxDebtPerUnitCollateral.toString())),
              2,
            )
          : 0,
        token: "pUSD",
      },
      {
        label: t("loanDetail.availableToWithDraw"),
        value: detailData
          ? formatFiatBalance(detailData.freeCollateral)
          : deposit && borrow && maxDebtPerUnitCollateral
          ? getAvailableToWithdraw(
              deposit,
              borrow,
              formatInputNumber(maxDebtPerUnitCollateral.toString()),
            )
          : 0,
        token: token,
      },
      {
        label: t("loanDetail.liquidationRatio"),
        value: liquidationRatio ? formatPercent(liquidationRatio.times(100)) : "0%",
        token: "",
      },
      {
        label: t("loanDetail.stabilityFee"),
        value: stabilityFee ? formatPercent(stabilityFee.times(100)) : "0%",
        token: "",
      },
      {
        label: t("loanDetail.liquidationPenalty"),
        value: liquidationPenalty ? formatPercent(liquidationPenalty.times(100)) : "0%",
        token: "",
      },
    ],
    [loanInfo],
  )

  console.log(loanInfo)

  return (
    <Container>
      <Title>{t(title)}</Title>
      <PriceLayout>
        <Grid gap={2} columns={[1, "2fr 2fr"]}>
          <div>
            <CommonPTag fSize={16} fColor={vanilla} weight={500}>
              {t("liquidationPrice")}
            </CommonPTag>
            <CommonPTag fSize={48} fColor={fire} weight={700}>
              $
              {detailData
                ? formatFiatBalance(detailData.liquidationPrice)
                : liquidationPrice
                ? formatFiatBalance(liquidationPrice)
                : 0}
            </CommonPTag>
            <CommonPTag fSize={16} fColor={silver} weight={500} m={"40px 0 0"}>
              {t("currentETHPrice")}
            </CommonPTag>
            <CommonPTag fSize={20} fColor={"white"} weight={500}>
              ${currentPrice ? formatFiatBalance(currentPrice) : 0}
            </CommonPTag>
            <CommonPTag fSize={16} fColor={silver} weight={400} m={"7px 0 0"}>
              {t("nextPriceIn")} {moment(nextPriceUpdate).format("MMM DD, YYYY, h:mma")}
            </CommonPTag>
            <CommonPTag fSize={14} fColor={silver} weight={400}>
              ${nextPrice ? formatFiatBalance(nextPrice) : 0}
            </CommonPTag>
            <Link href={"/"}>
              <CommonPTag fSize={14} fColor={orange} weight={500} m={"10px 0 0 0"}>
                {t("goToOraclePrice")}
              </CommonPTag>
            </Link>
          </div>
          <div>
            <CommonPTag fSize={16} fColor={vanilla} weight={500}>
              {t("collaterizationRatio")}
            </CommonPTag>
            <CommonPTag fSize={48} fColor={lightGreen} weight={700}>
              {detailData
                ? formatPercent(detailData.collateralizationRatio.times(100))
                : collateralizationRatio
                ? formatPercent(collateralizationRatio.times(100))
                : currentPrice
                ? caculateCollRatio(formatInputNumber(currentPrice.toString()), borrow, deposit)
                : 0}
            </CommonPTag>
            <CommonPTag fSize={16} fColor={silver} weight={500} m={"40px 0 0"}>
              {t("collateralLocked")}
            </CommonPTag>
            <CommonPTag fSize={20} fColor={"white"} weight={500}>
              {detailData
                ? formatCryptoBalance(detailData.lockedCollateral)
                : lockedCollateral && formatCryptoBalance(lockedCollateral)}{" "}
              {token}
            </CommonPTag>
            <CommonPTag fSize={14} fColor={silver} weight={400} m={"10px 0 0 0"}>
              $ {detailData ? formatFiatBalance(detailData.lockedCollateralUSD) : ""}
            </CommonPTag>
          </div>
        </Grid>
      </PriceLayout>
      <Space top={60} />
      <LoanInfo>
        <FiltersWithPopular
          onTagChange={onTagChain}
          tagFilter={tagFilter}
          defaultTag="loanDetail"
          page={"Landing"}
          searchPlaceholder={t("search-token")}
          options={options}
        />
        <Space top={20} />

        {tagFilter === "loanDetail" && (
          <Grid gap={2} columns={[1, "1fr 1fr 1fr"]}>
            {loanDetail.map(({ label, value, token }, idx) => (
              <Grid key={idx} pl={0} gap={0}>
                <CommonPTag fSize={14} weight={400}>
                  {label}
                </CommonPTag>
                <Box key={label}>
                  <CommonSpanTag fSize={16} weight={500}>
                    {value}
                  </CommonSpanTag>{" "}
                  {token && (
                    <CommonSpanTag fSize={16} weight={500}>
                      {token}
                    </CommonSpanTag>
                  )}
                </Box>
                <Space top={40} />
              </Grid>
            ))}
          </Grid>
        )}

        {tagFilter === "loanHistory" && (
          <Table
            data={loadDetailTest}
            primaryKey={"txtHash"}
            state={{ search: "", tagFilter: "loanHistory" }}
            columns={loanHistoryColumn}
            noResults={<></>}
            //  deriveRowProps={(row) => ({
            //    // href: row.ilkDebtAvailable.isZero() ? undefined : `/vaults/open/${row.ilk}`,
            //    // onClick: () => trackingEvents.openVault(Pages.LandingPage, row.ilk),
            // )}
          />
        )}
      </LoanInfo>
    </Container>
  )
}

export default TemplateCreate

//--------------------------------
const Container = styled.div`
  width: 95%;
  border-radius: ${rem(20)};
  background-color: rgba(44, 32, 79, 0.69);
  margin: ${rem(40)} auto 0;
  padding: ${rem(20)} ${rem(150)};
  min-height: 90vh;
`

const Title = styled.p`
  font-style: normal;
  font-weight: bold;
  font-size: ${rem(32)};
  line-height: 150%;
  margin-bottom: 1rem;

  //text-align: center;
  background: linear-gradient(
    to right,
    rgba(255, 160, 46, 1) 10%,
    rgba(189, 14, 193, 1) 12%,
    rgba(38, 242, 255, 1) 18%
  );

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const PriceLayout = styled.div`
  background: url("/images/background/stars1.jpeg") top left;
  background-size: cover;
  background-color: ${defaultBg};

  padding: ${rem(36)} ${rem(50)};
  //display: flex;
  //justify-content: space-between;
  //align-items: flex-start;

  //border: 1px solid ${vanilla};
  border-radius: ${rem(20)};

  @media ${DEFAULT_DEVICE.tablet} {
    width: 90%;
  }
`

const LoanInfo = styled.div`
  width: 65%;
`

// const Liquidation = styled.div``

// const CollaterizationRatio = styled.div``

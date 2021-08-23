import React, { useMemo, useState } from "react"
import styled from "styled-components"
import { rem } from "../helpers/common-function"
import {FormattedMessage, useIntl} from "react-intl"
import {CommonPTag, CommonSpanTag, DEFAULT_DEVICE, defaultBg, Space} from "../constants/styles"
import { fire, lightGreen, orange, silver, vanilla } from "../constants/color"
import { Link } from "react-router-dom"
import { FiltersWithPopular } from "../features/vaults-list/FiltersWithPopular"
import {LoanDetail, LoanHistory, TagFilter} from "../helpers/model"
import {COIN_TAGS, loadDetailTest} from "../constants/variables"
import {Box, Button, Grid, Text} from "theme-ui"
import {ColumnDef, Table} from "./Table";
import moment from "moment";

const loanHistoryColumn: ColumnDef<LoanHistory, any>[] = [
  {
    headerLabel: 'table.action',
    header: (abc) => {
      console.log(abc)
      return <p>{abc.label}</p>
    },
    cell: ({ action }) => <>{action}</>,
  },
  {
    headerLabel: 'table.amount',
    header: ({ label }) => <p>{label}</p>,
    cell: ({ amount, token }) => (
      <>
        <CommonSpanTag fSize={16} weight={500}>{amount}</CommonSpanTag> {token && <CommonSpanTag fSize={16} weight={500}>{token}</CommonSpanTag>}
      </>
    ),
  },
  {
    headerLabel: 'table.time',
    header: ({ label }) => (
      <p>{label}</p>
    ),
    cell: ({ time }) => (
      <Text sx={{ textAlign: 'right' }}>{moment(new Date()).format('DD/MM/YYYY HH:ss')}</Text>
    ),
  },
  {
    headerLabel: 'table.txtHash',
    header: ({ label }) => <Text>{label}</Text>,
    cell: ({ ilk }: any) => (
      <Box sx={{ flexGrow: 1, textAlign: 'right' }}>
        <Link
          to={`/`}
        >
          <CommonPTag fSize={16} fColor={lightGreen} weight={500}>
            <FormattedMessage id={'viewOnPolkadot'} />
          </CommonPTag>
        </Link>
      </Box>
    ),
  },
]

const TemplateCreate = () => {
  const { formatMessage } = useIntl()
  const [tagFilter, setTagFilter] = useState<TagFilter>("loanDetail")

  const onTagChain = (tagFilter: TagFilter) => {
    setTagFilter(tagFilter)
  }

  const options: { value: TagFilter; label: string }[] = [
    {
      value: "loanDetail",
      label: formatMessage({ id: "filters.loanDetail" }),
    },
    {
      value: "loanHistory",
      label: formatMessage({ id: "filters.loanHistory" }),
    },
  ]

  const loanDetail = useMemo(
    (): LoanDetail[] => [
      {
        label: formatMessage({ id: "loanDetail.outstandingDebt" }),
        value: 51,
        token: "pUSD",
      },
      {
        label: formatMessage({ id: "loanDetail.availableToBorrow" }),
        value: 51,
        token: "pUSD",
      },
      {
        label: formatMessage({ id: "loanDetail.availableToWithDraw" }),
        value: 51,
        token: "pUSD",
      },
      {
        label: formatMessage({ id: "loanDetail.liquidationRatio" }),
        value: 51,
        token: "pUSD",
      },
      {
        label: formatMessage({ id: "loanDetail.stabilityFee" }),
        value: 51,
        token: "pUSD",
      },
      {
        label: formatMessage({ id: "loanDetail.liquidationFee" }),
        value: 51,
        token: "pUSD",
      },
    ],
    [],
  )

  return (
    <Container>
      <Title>{formatMessage({ id: "Create new ETH-1 Loan" })}</Title>
      <PriceLayout>
      <Grid gap={2} columns={[1, "2fr 2fr"]}>
        <div>
          <CommonPTag fSize={16} fColor={vanilla} weight={500}>
            {formatMessage({ id: "liquidationPrice" })}
          </CommonPTag>
          <CommonPTag fSize={48} fColor={fire} weight={700}>
            $1,500.05
          </CommonPTag>
          <CommonPTag fSize={16} fColor={silver} weight={500} m={"40px 0 0"}>
            {formatMessage({ id: "currentETHPrice" })}
          </CommonPTag>
          <CommonPTag fSize={20} fColor={"white"} weight={500}>
            $2,300.05
          </CommonPTag>
          <CommonPTag fSize={16} fColor={silver} weight={400} m={"7px 0 0"}>
            {formatMessage({ id: "nextPriceIn" })}
          </CommonPTag>
          <CommonPTag fSize={14} fColor={silver} weight={400}>
            $2,100.05
          </CommonPTag>
          <Link to={""}>
            <CommonPTag fSize={14} fColor={orange} weight={500} m={"10px 0 0 0"}>
              {formatMessage({ id: "goToOraclePrice" })}
            </CommonPTag>
          </Link>
        </div>
        <div>
          <CommonPTag fSize={16} fColor={vanilla} weight={500}>
            {formatMessage({ id: "liquidationPrice" })}
          </CommonPTag>
          <CommonPTag fSize={48} fColor={lightGreen} weight={700}>
            350.08%
          </CommonPTag>
          <CommonPTag fSize={16} fColor={silver} weight={500} m={"40px 0 0"}>
            {formatMessage({ id: "collateralLocked" })}
          </CommonPTag>
          <CommonPTag fSize={20} fColor={"white"} weight={500}>
            0.9005 ETH
          </CommonPTag>
          <CommonPTag fSize={14} fColor={silver} weight={400} m={"10px 0 0 0"}>
            ~ $2,100.08
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
          searchPlaceholder={formatMessage({ id: "search-token" })}
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
                  <CommonSpanTag fSize={16} weight={500}>{value}</CommonSpanTag> {token && <CommonSpanTag fSize={16} weight={500}>{token}</CommonSpanTag>}
                </Box>
                <Space top={40} />
              </Grid>
            ))}
          </Grid>
        )}

        {
          tagFilter === "loanHistory" && (
            <Table
              data={loadDetailTest}
              primaryKey={'txtHash'}
              state={{ search: "", tagFilter: "loanHistory" }}
              columns={loanHistoryColumn}
              noResults={<></>}
              deriveRowProps={(row) => ({
                // href: row.ilkDebtAvailable.isZero() ? undefined : `/vaults/open/${row.ilk}`,
                // onClick: () => trackingEvents.openVault(Pages.LandingPage, row.ilk),
              })}
            />
          )
        }
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

const Liquidation = styled.div``

const CollaterizationRatio = styled.div``

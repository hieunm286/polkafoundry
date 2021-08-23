import React, { useCallback, useState } from "react"
import { Box, Grid, Text } from "theme-ui"
import TemplateListing from "../../components/TemplateListing"
import { TagFilter } from "../../helpers/model"
import { test } from "../../constants/variables"
import { Trans, useTranslation } from "next-i18next"
import Link from "next/link"
import { rem } from "../../helpers/common-function"
import { CommonPTag, DEFAULT_DEVICE, Space } from "../../constants/styles"
import styled from "styled-components"
import { CREATE_LOAN_STAGE } from "../../recoil/atoms"
import LoanEditing from "../loan/LoanEditing"
import CreateProxy from "../loan/CreateProxy"
import { Table } from "../../components/Table"
import { FiltersWithPopular } from "../vaults-list/FiltersWithPopular"
import { Chart } from "react-google-charts"
import { lightGreen, orange } from "../../constants/color"

const ilksColumns: any = [
  {
    headerLabel: "system.assets",
    header: (abc: any) => {
      console.log(abc)
      return <p>{abc.label}</p>
    },
    cell: ({ name }: any) => <>{name}</>,
  },
  {
    headerLabel: "system.type",
    header: ({ label }: any) => <p>{label}</p>,
    cell: ({ ilk }: any) => <Text>{ilk}</Text>,
  },
  {
    headerLabel: "system.stabilityFee",
    header: ({ label }: any) => (
      // <TableSortHeader sx={{ ml: 'auto' }} filters={filters as any} sortBy="ilkDebtAvailable">
      <p>{label}</p>
      // </TableSortHeader>
    ),
    cell: ({ price }: any) => <Text sx={{ textAlign: "right" }}>{price}</Text>,
  },
  {
    headerLabel: "system.liquidityRatio",
    header: ({ label }: any) => (
      // <TableSortHeader sx={{ ml: 'auto' }} filters={filters as any} sortBy="ilkDebtAvailable">
      <p>{label}</p>
      // </TableSortHeader>
    ),
    cell: ({ price }: any) => <Text sx={{ textAlign: "right" }}>{price}</Text>,
  },
  {
    headerLabel: "system.liquidityPenalty",
    header: ({ label }: any) => (
      // <TableSortHeader sx={{ ml: 'auto' }} filters={filters as any} sortBy="ilkDebtAvailable">
      <p>{label}</p>
      // </TableSortHeader>
    ),
    cell: ({ price }: any) => <Text sx={{ textAlign: "right" }}>{price}</Text>,
  },
  {
    headerLabel: "system.pUSDAvailable",
    header: ({ label }: any) => (
      // <TableSortHeader sx={{ ml: 'auto' }} filters={filters as any} sortBy="ilkDebtAvailable">
      <p>{label}</p>
      // </TableSortHeader>
    ),
    cell: ({ price }: any) => <Text sx={{ textAlign: "right" }}>{price}</Text>,
  },
  {
    headerLabel: "empty",
    header: () => null,
    cell: ({ ilk }: any) => (
      <Box sx={{ flexGrow: 1, textAlign: "right" }}>
        {/*<div style={{ maxWidth: 100 }}>*/}
        <Link href={`/vaults/open/${ilk}`}>
          <Button variant="secondary" sx={{ width: "100%", maxWidth: ["100%", "150px"] }}>
            <Text>
              <Trans i18nKey="manageLoan" />
            </Text>
          </Button>
        </Link>
        {/*</div>*/}
      </Box>
    ),
  },
]

const chartLegends = [
  {
    token: "ETH",
    color: lightGreen,
  },
  {
    token: "BSC",
    color: orange,
  },
  {
    token: "LINK",
    color: "#7525DB",
  },
]

const LoanOverview = ({ address }: { address: string }) => {
  const [searchText, setSearchtext] = useState<string>("")
  const [tagFilter, setTagFilter] = useState<TagFilter>()
  const { t } = useTranslation()

  const onSearch = (value: string) => {
    setSearchtext(value)
  }

  const onTagChain = (tagFilter: TagFilter) => {
    setTagFilter(tagFilter)
  }

  const options: { value: TagFilter; label: string }[] = [
    {
      value: undefined,
      label: t("all-assets"),
    },
    {
      value: "stablecoin",
      label: t("filters.stablecoin"),
    },
  ]
  const FILTER_TOKEN = test.filter((token) => token.name.indexOf(searchText) !== -1)

  const RenderChart = useCallback(() => {
    return (
      <Chart
        // width={'600px'}
        // height={'600px'}
        chartType="PieChart"
        loader={<div>Loading Chart</div>}
        data={[
          ["Token", "Loan Ratio"],
          ["ETH", 4],
          ["BTC", 4],
          ["LINK", 2],
        ]}
        options={{
          title: "",
          // Just add this option
          pieHole: 0.5,
          backgroundColor: "transparent",
          colors: ["#5BDECD", "#FFAE46", "#7525DB"],
          border: "none",
          width: 250,
          height: 250,
          chartArea: { width: "100%", height: "100%" },
          legend: "none",
        }}
        rootProps={{ "data-testid": "3" }}
      />
    )
  }, [])

  return (
    <Grid
      gap={5}
      columns={["2fr 1fr"]}
      sx={{
        paddingRight: 5,
        paddingLeft: 5,
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        backgroundColor: "#2C204F",
        borderRadius: 20,
        paddingTop: 15,
      }}
    >
      <Grid>
        <Header />
        <Space />
        <FiltersWithPopular
          onSearch={onSearch}
          search={searchText}
          onTagChange={onTagChain}
          tagFilter={tagFilter}
          defaultTag={"all-assets"}
          page={"Loanoverviwe"}
          searchPlaceholder={t("search-token")}
          options={options}
        />
        <DisplayTable>
          <Table
            data={FILTER_TOKEN}
            state={{ search: "", tagFilter: "all-assets" }}
            primaryKey={"ilk"}
            columns={ilksColumns}
            noResults={<></>}
            deriveRowProps={() => ({
              // href: row.ilkDebtAvailable.isZero() ? undefined : `/vaults/open/${row.ilk}`,
              // onClick: () => trackingEvents.openVault(Pages.LandingPage, row.ilk),
            })}
          />
        </DisplayTable>
      </Grid>
      <CardContainer>
        <CreateCard>
          <CommonPTag fSize={20} weight={700}>
            $1200.05
          </CommonPTag>
          <CommonPTag fSize={14} weight={400}>
            Total Collateral Locked
          </CommonPTag>
          <Space top={25} />
          <CommonPTag fSize={20} weight={700}>
            400 pUSD
          </CommonPTag>
          <CommonPTag fSize={14} weight={400}>
            Total Debt
          </CommonPTag>
          <Space top={25} />
          <Grid columns={["2fr 1fr"]}>
            <CommonPTag fSize={14} weight={400}>
              No. of Loans
            </CommonPTag>
            <CommonPTag fSize={14} weight={700} tAlign={"right"}>
              4
            </CommonPTag>
          </Grid>
          <Grid columns={["2fr 1fr"]}>
            <CommonPTag fSize={14} weight={400}>
              Loans at risk
            </CommonPTag>
            <CommonPTag fSize={14} weight={700} tAlign={"right"}>
              0
            </CommonPTag>
          </Grid>
          <ChartContainer>
            <RenderChart />
          </ChartContainer>
          <Grid columns={["1fr 1fr"]} sx={{ marginTop: 5 }}>
            {chartLegends.map(({ token, color }, idx) => (
              <LegendLabel key={idx}>
                <LegendFill bg={color} />
                <CommonPTag fSize={14} weight={900} m={"0 0 0 10px"}>
                  {token}
                </CommonPTag>
              </LegendLabel>
            ))}
          </Grid>
        </CreateCard>
      </CardContainer>
    </Grid>
  )
}

const Header = () => {
  return (
    <Grid columns={["2fr 1fr"]}>
      <Grid columns={[1]}>
        <Title>My Loans</Title>
        <Lead>Select an asset and loan type from list below</Lead>
      </Grid>
      <div style={{ textAlign: "right" }}>
        <Button>Create new loan</Button>
      </div>
    </Grid>
  )
}

export default LoanOverview

//---------------------------
const Title = styled.p`
  font-style: normal;
  font-weight: bold;
  font-size: ${rem(32)};
  line-height: 150%;
  margin: 0;

  text-align: left;
  background: linear-gradient(
    to right,
    rgba(255, 160, 46, 1) 11.5%,
    rgba(189, 14, 193, 1) 12%,
    rgba(38, 242, 255, 1) 14%
  );

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const Lead = styled.p`
  font-style: normal;
  font-weight: 500;
  font-size: ${rem(14)};
  line-height: 150%;
  text-align: left;
  color: #a9a4e4;
  margin: 0;
`

const Button = styled.button`
  background: linear-gradient(to bottom, #903afd -13.58%, #492cff 102.52%);
  border-radius: 32px;
  margin: 0;
  border: none;
  cursor: pointer;
  color: white;
  width: 100%;
  @media ${DEFAULT_DEVICE.tablet} {
    width: ${rem(150)};
    height: ${rem(40)};
  }
`
const CardContainer = styled.div`
  position: relative;
`

const CreateCard = styled.div`
  position: absolute;
  background-color: #3c2b6c;
  min-height: 100%;
  width: 90%;
  border-radius: ${rem(15)};
  overflow: hidden;

  top: ${rem(-30)};
  //right: 10%;

  padding: ${rem(30)} ${rem(35)};
`

const DisplayTable = styled.div`
  overflow-x: auto;
`

const ChartContainer = styled.div`
  margin-top: ${rem(50)};
  display: flex;
  justify-content: center;
`

const LegendLabel = styled.div`
  display: flex;
  align-items: center;
`

const LegendFill = styled.div<{ bg: string }>`
  width: ${rem(14)};
  height: ${rem(14)};
  background-color: ${(props) => props.bg};
  border-radius: 50%;
`

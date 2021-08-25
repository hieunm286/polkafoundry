import React, {useEffect, useState} from "react"
import { Box, Button, Text } from "theme-ui"
import { TagFilter } from "../../helpers/model"
import { COIN_TAGS, test } from "../../constants/variables"
import TemplateListing from "../../components/TemplateListing"
import Link from "next/link"
import { Trans, useTranslation } from "next-i18next"
import {useRecoilValue} from "recoil";
import {appContext} from "../../recoil/atoms";
import App from "next/app";
import {createIlkData$} from "../../helpers/ilks";
import {ColumnDef} from "../../components/Table";
import {formatCryptoBalance, formatPercent} from "../../helpers/common-function";

const ilksColumns: ColumnDef<any, any>[] = [
  {
    headerLabel: "system.assets",
    header: (abc: any) => {
      console.log(abc)
      return <p>{abc.label}</p>
    },
    cell: ({ token }: any) => <>{token}</>,
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
    cell: ({ stabilityFee }: any) => <Text sx={{ textAlign: "right" }}>{formatPercent(stabilityFee.times(100), { precision: 2 })}</Text>,
  },
  {
    headerLabel: "system.liquidityRatio",
    header: ({ label }: any) => (
      // <TableSortHeader sx={{ ml: 'auto' }} filters={filters as any} sortBy="ilkDebtAvailable">
      <p>{label}</p>
      // </TableSortHeader>
    ),
    cell: ({ liquidationRatio }: any) => <Text sx={{ textAlign: "right" }}>{formatPercent(liquidationRatio.times(100))}</Text>,
  },
  {
    headerLabel: "system.liquidityPenalty",
    header: ({ label }: any) => (
      // <TableSortHeader sx={{ ml: 'auto' }} filters={filters as any} sortBy="ilkDebtAvailable">
      <p>{label}</p>
      // </TableSortHeader>
    ),
    cell: ({ liquidationPenalty }: any) => <Text sx={{ textAlign: "right" }}>{formatPercent(liquidationPenalty.times(100))}</Text>,
  },
  {
    headerLabel: "system.pUSDAvailable",
    header: ({ label }: any) => (
      // <TableSortHeader sx={{ ml: 'auto' }} filters={filters as any} sortBy="ilkDebtAvailable">
      <p>{label}</p>
      // </TableSortHeader>
    ),
    cell: ({ ilkDebtAvailable }: any) => <Text sx={{ textAlign: "right" }}>{formatCryptoBalance(ilkDebtAvailable)}</Text>,
  },
  {
    headerLabel: "kkk",
    header: () => null,
    cell: ({ ilk }: any) => (
      <Box sx={{ flexGrow: 1, textAlign: "right" }}>
        <Link
          // sx={{ width: ['100%', 'inherit'], textAlign: 'center', maxWidth: ['100%', '150px'] }}
          // variant="secondary"
          href={`/loans/new/${ilk}`}
          // disabled={ilkDebtAvailable.isZero()}
        >
          {/*{!ilkDebtAvailable.isZero() ? (*/}
          {/*    <FormattedMessage id="open-vault.title" />*/}
          {/*) : (*/}
          <Button
            variant="secondary"
            sx={{ width: "100%", maxWidth: ["100%", "150px"] }}
          >
            <Text>
              <Trans i18nKey="createLoan" />
            </Text>
          </Button>
          {/*)}*/}
        </Link>
      </Box>
    ),
  },
]

const LoanList = () => {
  const { t } = useTranslation()
  const [searchText, setSearchtext] = useState<string>("")
  const [tagFilter, setTagFilter] = useState<TagFilter>("popular")
  const [ilks, setIlks] = useState<any>([])
  const AppContext = useRecoilValue(appContext)

  useEffect(() => {
    const fetchListToken = async () => {
      if (!AppContext) return;
      const ilksData = await Promise.all(Object.keys(AppContext.token).filter(ilk => ilk === "ETH-A").map(ilk => createIlkData$(ilk)))
      setIlks(ilksData)
    }

    void fetchListToken()
  }, [AppContext])

  const onSearch = (value: string) => {
    setSearchtext(value)
  }

  const onTagChain = (tagFilter: TagFilter) => {
    setTagFilter(tagFilter)
  }

  const options: { value: TagFilter; label: string }[] = [
    {
      value: "popular",
      label: t("filters.popular"),
    },
    // {
    //   value: undefined,
    //   label: t("all-assets"),
    // },
    // ...COIN_TAGS.map((tag) => ({
    //   value: tag,
    //   label: t(`filters.${tag}`),
    // })),
  ]

  const FILTER_TOKEN = ilks.filter((token) => token.ilk.indexOf(searchText) !== -1)
  return (
    <TemplateListing
      title="loanList.create"
      lead="loanList.lead"
      searchText={searchText}
      onSearch={onSearch}
      onTagChain={onTagChain}
      tagFilter={tagFilter}
      data={FILTER_TOKEN}
      state={{ search: "", tagFilter: "popular" }}
      primaryKey={"ilk"}
      columns={ilksColumns}
      options={options}
      defaultTag={"all-assets"}
      page={"Create-loan"}
    />
  )
}

export default LoanList

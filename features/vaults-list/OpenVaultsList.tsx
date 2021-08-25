import React, { useState } from "react"
import { TagFilter } from "../../helpers/model"
import { COIN_TAGS, test } from "../../constants/variables"
import TemplateListing from "../../components/TemplateListing"
import { Box, Button, Text } from "theme-ui"
import { Trans, useTranslation } from "next-i18next"
import Link from "next/link"
import { useRecoilValue } from "recoil"
import { appContext } from "../../recoil/atoms"

const ilksColumns: any = [
  {
    headerLabel: "system.asset",
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
    headerLabel: "kkk",
    header: () => null,
    cell: ({ ilk }: any) => (
      <Box sx={{ flexGrow: 1, textAlign: "right" }}>
        <Link
          // sx={{ width: ['100%', 'inherit'], textAlign: 'center', maxWidth: ['100%', '150px'] }}
          // variant="secondary"
          href={`/vaults/open/${ilk}`}
          // disabled={ilkDebtAvailable.isZero()}
        >
          {/*{!ilkDebtAvailable.isZero() ? (*/}
          {/*    <FormattedMessage id="open-vault.title" />*/}
          {/*) : (*/}
          <Button
            variant="secondary"
            // disabled={true}
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

const OpenVaultsList = () => {
  const [searchText, setSearchtext] = useState<string>("")
  const [tagFilter, setTagFilter] = useState<TagFilter>("popular")
  const { t } = useTranslation()
  const AppContext = useRecoilValue(appContext)

  console.log(AppContext)

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
    {
      value: undefined,
      label: t("all-assets"),
    },
    ...COIN_TAGS.map((tag) => ({
      value: tag,
      label: t(`filters.${tag}`),
    })),
  ]

  const FILTER_TOKEN = test.filter((token) => token.name.indexOf(searchText) !== -1)
  return (
    <TemplateListing
      title="loanList.title"
      searchText={searchText}
      onSearch={onSearch}
      onTagChain={onTagChain}
      tagFilter={tagFilter}
      data={FILTER_TOKEN}
      state={{ search: "", tagFilter: "popular" }}
      primaryKey={"ilk"}
      columns={ilksColumns}
      options={options}
      page={`List-loan`}
      defaultTag={"all-assets"}
    />
  )
}

export default OpenVaultsList

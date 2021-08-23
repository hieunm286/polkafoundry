import React, { ComponentProps, ReactNode } from "react"
import styled from "styled-components"
// @ts-ignore
import { Icon } from "@makerdao/dai-ui-icons"
import { Flex, Text } from "theme-ui"
import { getToken } from "../blockchain/tokensMetadata"
import { TagFilter } from "../helpers/model"
import { FiltersWithPopular } from "../features/vaults-list/FiltersWithPopular"
import { rem } from "../helpers/common-function"
import { ColumnDef, RowProps, Table } from "./Table"
import { useTranslation } from "next-i18next"
import { isString } from "lodash"

export function TokenSymbol({
  token,
  displaySymbol,
  ...props
}: { token: string; displaySymbol?: boolean } & Omit<ComponentProps<typeof Icon>, "name">) {
  const tokenInfo = getToken(token)

  return (
    <Flex>
      <Icon
        name={tokenInfo.iconCircle}
        size="26px"
        sx={{ verticalAlign: "sub", mr: 2 }}
        {...props}
      />
      <Text variant="paragraph2" sx={{ fontWeight: "semiBold", whiteSpace: "nowrap" }}>
        {tokenInfo[displaySymbol ? "symbol" : "name"]}
      </Text>
    </Flex>
  )
}

interface ListingProp<T extends Record<K, string>, K extends keyof T, S> {
  title?: string | ReactNode
  lead?: string | ReactNode
  searchText?: string
  onSearch?: (text: string) => void
  onTagChain: (tagFilter: TagFilter) => void
  tagFilter: TagFilter
  data: T[]
  state: S
  primaryKey: K
  columns: ColumnDef<T, S>[]
  noResults?: React.ReactNode
  deriveRowProps?: (row: T) => RowProps
  defaultTag: string
  page: string
  options: { value: TagFilter; label: string }[]
}

function TemplateListing<T extends Record<K, string>, K extends keyof T, S>({
  //deriveRowProps,
  columns,
  state,
  primaryKey,
  data,
  title,
  searchText,
  onSearch,
  onTagChain,
  tagFilter,
  lead,
  defaultTag,
  page,
  options,
}: ListingProp<T, K, S>) {
  const { t } = useTranslation()

  return (
    <Container>
      {title && isString(title) ? <Title>{t(title)}</Title> : <>{title}</>}
      {lead && isString(lead) ? <Lead>{t(lead)}</Lead> : <>{lead}</>}
      <Space />
      <FiltersWithPopular
        onSearch={onSearch}
        search={searchText}
        onTagChange={onTagChain}
        tagFilter={tagFilter}
        defaultTag={defaultTag}
        page={page}
        searchPlaceholder={t("search-token")}
        options={options}
      />
      <Table
        data={data}
        primaryKey={primaryKey}
        state={state}
        columns={columns}
        noResults={<></>}
        deriveRowProps={() => ({
          // href: row.ilkDebtAvailable.isZero() ? undefined : `/vaults/open/${row.ilk}`,
          // onClick: () => trackingEvents.openVault(Pages.LandingPage, row.ilk),
        })}
      />
    </Container>
  )
}

export default TemplateListing

//--------------------------------
const Container = styled.div`
  width: 95%;
  border-radius: ${rem(20)};
  background-color: rgba(44, 32, 79, 0.69);
  margin: 0 auto;
  padding: ${rem(20)} ${rem(150)};
  min-height: 90vh;
`

const Title = styled.p`
  font-style: normal;
  font-weight: bold;
  font-size: ${rem(32)};
  line-height: 150%;
  margin-bottom: 1rem;

  text-align: center;
  background: linear-gradient(
    to right,
    rgba(255, 160, 46, 1) 42%,
    rgba(189, 14, 193, 1) 50%,
    rgba(38, 242, 255, 1) 54%
  );

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const Lead = styled.p`
  font-style: normal;
  font-weight: 500;
  font-size: ${rem(14)};
  line-height: 150%;
  text-align: center;
  color: #a9a4e4;
`

const Space = styled.div`
  margin-top: 3rem;
`

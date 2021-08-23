// @ts-ignore
import { Icon } from "@makerdao/dai-ui-icons"
import React, { memo, useCallback } from "react"
import ReactSelect from "react-select"
// @ts-ignore
import { Box, Button, Flex, Input, SxStyleProp } from "theme-ui"
import { TagFilter } from "../../helpers/model"

interface FiltersProps {
  onSearch?: (search: string) => void
  onTagChange: (tag: TagFilter) => void
  search?: string
  defaultTag?: string
  page: string
  tagFilter: TagFilter
  searchPlaceholder?: string
  sx?: SxStyleProp
  options: { value: TagFilter; label: string }[]
}

function Filters_({
  onSearch,
  search,
  onTagChange,
  tagFilter,
  defaultTag,
  page,
  searchPlaceholder,
  sx,
  options,
}: FiltersProps) {
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onSearch) {
        onSearch(e.currentTarget.value)
      }
    },
    [onSearch],
  )

  const selected = options.find((option) => option.value === tagFilter)

  return (
    <Flex sx={{ ...sx, flexDirection: ["column", "column", "row"], mb: 4 }}>
      <Box
        sx={{
          display: ["none", "flex", "flex"],
        }}
      >
        {options.map((option) => (
          <Button
            key={option.label}
            onClick={() => onTagChange(option.value)}
            sx={{ mr: 0, backgroundColor: option.value === tagFilter ? "#F9B55E" : "initial" }}
            data-selected={option.value === tagFilter}
            variant="filter"
          >
            {option.label}
          </Button>
        ))}
      </Box>
      <Box
        sx={{
          my: 2,
          display: ["block", "none", "none"],
        }}
      >
        <ReactSelect
          value={selected}
          defaultValue={options[0]}
          options={options}
          isSearchable={false}
          onChange={(option) => option && "value" in option && onTagChange(option.value)}
          components={{
            // eslint-disable-next-line react/display-name
            IndicatorsContainer: ({ selectProps: { menuIsOpen } }) => (
              <Flex
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  mr: 3,
                  transform: `rotate(${menuIsOpen ? "180deg" : 0})`,
                  transition: "transform 0.2s ease-in-out",
                }}
              >
                <Icon name="chevron" />
              </Flex>
            ),
            // eslint-disable-next-line react/display-name
            Control: ({ children, innerProps }) => (
              <Flex
                sx={{
                  border: "light",
                  px: 2,
                  py: 3,
                  borderRadius: "medium",
                  cursor: "pointer",
                }}
                {...innerProps}
              >
                {children}
              </Flex>
            ),
          }}
        />
      </Box>
      {onSearch && (
        <Flex
          sx={{
            variant: "forms.search",
            borderColor: "universe",
            width: ["100%", "100%", "313px"],
            p: [2, 1, 1],
            ml: "auto",
            alignItems: "center",
            mt: [3, 3, 0],
            color: "text.shape",
            "& input::placeholder": {
              color: "text.shape",
              fontWeight: "heading",
            },
            "&:focus-within": {
              color: "text.shape",
            },
          }}
        >
          <Icon
            sx={{
              position: "relative",
              top: "6px",
              ml: 3,
            }}
            name="search"
            size="4"
          />
          <Input
            sx={{ fontWeight: "heading" }}
            variant="plain"
            onChange={onChange}
            // onBlur={() => trackingEvents.searchToken(page, search)}
            value={search}
            placeholder={searchPlaceholder}
          />
        </Flex>
      )}
    </Flex>
  )
}

export const FiltersWithPopular = memo(Filters_)

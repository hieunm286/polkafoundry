import React, { useMemo } from "react"
import { Grid } from "theme-ui"
import { CommonPTag } from "../../constants/styles"

const MoreInformation = () => {
  const PUSDInfo = useMemo(
    (): { label: string; value: string }[] => [
      {
        label: "available",
        value: "1.08M pUSD",
      },
      {
        label: "liquidationRatio",
        value: "150%",
      },
      {
        label: "stabilityFee",
        value: "4.05%",
      },
      {
        label: "liquidationFee",
        value: "13.06%",
      },
      {
        label: "debtFloor",
        value: "100 pUSD",
      },
    ],
    [],
  )

  return (
    <Grid columns={[1]} sx={{ marginTop: "3" }}>
      {PUSDInfo.map(({ label, value }, idx) => (
        <Grid columns={["1fr 1fr"]} key={idx}>
          <CommonPTag fSize={12} weight={400}>
            {label}
          </CommonPTag>
          <CommonPTag fSize={12} weight={900} tAlign={`right`}>
            {value}
          </CommonPTag>
        </Grid>
      ))}
    </Grid>
  )
}

export default MoreInformation

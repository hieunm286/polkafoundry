import React from "react"
import { Grid } from "theme-ui"
import { CommonPTag } from "../constants/styles"
import { useTranslation } from "next-i18next"

interface Props {
  loanInfo: { label: string; value: string }[]
}

const LoanInformation: React.FC<Props> = ({ loanInfo }) => {
  const { t } = useTranslation()
  return (
    <Grid columns={[1]} sx={{ marginTop: "3" }}>
      {loanInfo.map(({ label, value }, idx) => (
        <Grid columns={["1fr 1fr"]} key={idx}>
          <CommonPTag fSize={12} weight={400}>
            {t(label)}
          </CommonPTag>
          <CommonPTag fSize={12} weight={900} tAlign={`right`}>
            {value}
          </CommonPTag>
        </Grid>
      ))}
    </Grid>
  )
}

export default LoanInformation

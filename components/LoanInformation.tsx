import React from 'react';
import {BigNumber} from "bignumber.js";
import {Grid} from "theme-ui";
import { CommonPTag } from "../constants/styles"
import {useTranslation} from "next-i18next";

interface LoanProps {
  ilkDebtAvailable: BigNumber;
  liquidationRatio: BigNumber;
  stabilityFee: BigNumber;
  liquidationPenalty: BigNumber;
  debtFloor: BigNumber;
}

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
  );
};

export default LoanInformation;
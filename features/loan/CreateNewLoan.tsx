import React from "react"
import TemplateCreate from "../../components/TemplateCreate"
import styled from "styled-components"
import { rem } from "../../helpers/common-function"
import { CommonPTag, Space } from "../../constants/styles"
import { useIntl } from "react-intl"
import {Grid} from "theme-ui";
import LoanEditing from "./LoanEditing";

const CreateLoanTitle = () => {
  const { formatMessage } = useIntl()

  return (
    <>
      <CommonPTag fSize={20} fColor={"white"} weight={700}>
        {formatMessage({ id: "setUpLoan" })}
      </CommonPTag>
      <CommonPTag fSize={14} fColor={"white"} weight={400}>
        {formatMessage({ id: "setUpLoanDescription" })}
      </CommonPTag>
    </>
  )
}

const CreateNewLoan = () => {
  const { formatMessage } = useIntl()
  return (
    <CreateContainer>
        <TemplateCreate />
        <CreateCard>
          <CreateLoanTitle />
          <Space top={25} />
          <LoanEditing />
        </CreateCard>
    </CreateContainer>
  )
}

export default CreateNewLoan

//------------------------
const CreateContainer = styled.div`
  position: relative;
`

const CreateCard = styled.div`
  position: absolute;
  background-color: #3c2b6c;
  min-height: 100%;
  width: ${rem(350)};
  border-radius: ${rem(15)};

  top: ${rem(-15)};
  right: 10%;

  padding: ${rem(30)} ${rem(35)};
`

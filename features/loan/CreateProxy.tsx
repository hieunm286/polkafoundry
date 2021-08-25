import React from "react"
import { rem } from "../../helpers/common-function"
import { DEFAULT_DEVICE } from "../../constants/styles"
import styled from "styled-components"
import { orange } from "../../constants/color"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import {
  connectionAccountState,
  CREATE_LOAN_STAGE,
  createLoanStage,
  proxyAccountAddress,
} from "../../recoil/atoms"
import { ethers } from "ethers"
import { PROXY_REGISTRY } from "../../blockchain/addresses/kovan.json"
import dsProxyRegistryAbi from "../../blockchain/abi/ds-proxy-registry.json"
import Web3 from "web3"
import { getProxyAddress } from "../../helpers/web3"

const CreateProxy = ({ onClickBack }: { onClickBack?: () => void }) => {
  const setCreateLoanStage = useSetRecoilState(createLoanStage)
  const address = useRecoilValue(connectionAccountState)
  const [userProxy, setUserProxy] = useRecoilState(proxyAccountAddress)

  const handleCreateProxy = async () => {
    try {
      const web3 = new Web3(Web3.givenProvider)
      const contract = new web3.eth.Contract(dsProxyRegistryAbi as any, PROXY_REGISTRY)

      if (userProxy === ethers.constants.AddressZero) {
        await contract.methods.build(address).send(
          {
            from: address,
          },
          // eslint-disable-next-line handle-callback-err
          function (err, receipt) {
            console.log(receipt)
          },
        )

        const proxy = await getProxyAddress(address)
        setUserProxy(proxy)
      }
    } catch (err) {}
  }
  return (
    <CreateProxyContainer>
      <Button onClick={handleCreateProxy}>Create proxy</Button>
      <Back
        onClick={() =>
          onClickBack ? onClickBack() : setCreateLoanStage(CREATE_LOAN_STAGE.editForm)
        }
      >
        Back to edit Loan
      </Back>
    </CreateProxyContainer>
  )
}

export default CreateProxy

const CreateProxyContainer = styled.div`
  text-align: center;
`

const Button = styled.button`
  background: linear-gradient(to bottom, #903afd -13.58%, #492cff 102.52%);
  border-radius: 32px;
  margin: ${rem(20)} auto 0;
  border: none;
  cursor: pointer;
  color: white;
  @media ${DEFAULT_DEVICE.tablet} {
    width: ${rem(218)};
    height: ${rem(40)};
  }
`

const Back = styled.p`
  color: ${orange};
  font-weight: bold;
  font-size: ${rem(16)};

  cursor: pointer;
`

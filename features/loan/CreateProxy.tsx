import React, { useState } from "react"
import { notifySuccess, rem } from "../../helpers/common-function"
import { CommonSpanTag, DEFAULT_DEVICE } from "../../constants/styles"
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
import { PROXY_REGISTRY } from "../../blockchain/addresses/moonbeam.json"
import dsProxyRegistryAbi from "../../blockchain/abi/ds-proxy-registry.json"
import Web3 from "web3"
import { getProxyAddress } from "../../helpers/web3"
import { Spinner } from "theme-ui"

const CreateProxy = ({ onClickBack }: { onClickBack?: () => void }) => {
  const setCreateLoanStage = useSetRecoilState(createLoanStage)
  const address = useRecoilValue(connectionAccountState)
  const [userProxy, setUserProxy] = useRecoilState(proxyAccountAddress)
  const [loading, setLoading] = useState<boolean>(false)
  const [tx, setTx] = useState<string | undefined>()

  const handleCreateProxy = async () => {
    try {
      const web3 = new Web3(Web3.givenProvider)
      const contract = new web3.eth.Contract(dsProxyRegistryAbi as any, PROXY_REGISTRY)

      if (userProxy === ethers.constants.AddressZero) {
        await contract.methods
          .build(address)
          .send(
            {
              from: address,
            },
            // eslint-disable-next-line handle-callback-err
            function (err, receipt) {
              console.log(receipt)
              setLoading(true)
            },
          )
          // eslint-disable-next-line handle-callback-err
          .on("error", function (error, receipt) {
            console.log(receipt)
            setLoading(false)
          })
          .on("receipt", function (receipt) {
            console.log(receipt)
            setTx(receipt.transactionHash)
            setLoading(false)
            notifySuccess("✅ Transaction submitted successfully")
          })

        const proxy = await getProxyAddress(address)
        setUserProxy(proxy)
      }
    } catch (err) {}
  }
  return (
    <CreateProxyContainer>
      {tx ? (
        // Uncomment for moonbeam or kovan
        // <a
        //   href={`https://moonbase-blockscout.testnet.moonbeam.network/tx/${tx}`}
        //   target="_blank"
        //   rel={`noreferrer noopener`}
        // >
        <a href={`https://kovan.etherscan.io/tx/${tx}`} target="_blank" rel={`noreferrer noopener`}>
          <Button>
            <CommonSpanTag>View transaction</CommonSpanTag>
          </Button>
        </a>
      ) : (
        <Button onClick={handleCreateProxy} disabled={loading}>
          {loading && <Spinner sx={{ color: "#500EC1", marginRight: 2 }} size={24} />}
          <CommonSpanTag>Create proxy</CommonSpanTag>
        </Button>
      )}
      {!loading && (
        <Back
          onClick={() =>
            onClickBack ? onClickBack() : setCreateLoanStage(CREATE_LOAN_STAGE.editForm)
          }
        >
          Back to edit Loan
        </Back>
      )}
    </CreateProxyContainer>
  )
}

export default CreateProxy

const CreateProxyContainer = styled.div`
  text-align: center;
`

const Button = styled.button`
  background: ${(props) =>
    props.disabled ? "#C8C6E5" : `linear-gradient(to bottom, #903afd -13.58%, #492cff 102.52%)`};
  border-radius: 32px;
  margin: ${rem(20)} auto 0;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;

  span {
    color: ${(props) => (props.disabled ? "#500EC1" : "white")};
  }

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

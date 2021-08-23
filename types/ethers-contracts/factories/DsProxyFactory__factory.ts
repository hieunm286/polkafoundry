/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";

import type { DsProxyFactory } from "../DsProxyFactory";

export class DsProxyFactory__factory {
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DsProxyFactory {
    return new Contract(address, _abi, signerOrProvider) as DsProxyFactory;
  }
}

const _abi = [
  {
    constant: true,
    inputs: [
      {
        name: "",
        type: "address",
      },
    ],
    name: "isProxy",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "cache",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "build",
    outputs: [
      {
        name: "proxy",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "owner",
        type: "address",
      },
    ],
    name: "build",
    outputs: [
      {
        name: "proxy",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        name: "proxy",
        type: "address",
      },
      {
        indexed: false,
        name: "cache",
        type: "address",
      },
    ],
    name: "Created",
    type: "event",
  },
];

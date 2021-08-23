/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { ContractOptions } from "web3-eth-contract";
import { EventLog } from "web3-core";
import { EventEmitter } from "events";
import {
  Callback,
  PayableTransactionObject,
  NonPayableTransactionObject,
  BlockType,
  ContractEventLog,
  BaseContract,
} from "./types";

interface EventOptions {
  filter?: object;
  fromBlock?: BlockType;
  topics?: string[];
}

export type LogNote = ContractEventLog<{
  sig: string;
  usr: string;
  arg1: string;
  arg2: string;
  data: string;
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
}>;
export type NewCdp = ContractEventLog<{
  usr: string;
  own: string;
  cdp: string;
  0: string;
  1: string;
  2: string;
}>;

export interface DssCdpManager extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): DssCdpManager;
  clone(): DssCdpManager;
  methods: {
    cdpAllow(
      cdp: number | string,
      usr: string,
      ok: number | string
    ): NonPayableTransactionObject<void>;

    cdpCan(
      arg0: string,
      arg1: number | string,
      arg2: string
    ): NonPayableTransactionObject<string>;

    cdpi(): NonPayableTransactionObject<string>;

    count(arg0: string): NonPayableTransactionObject<string>;

    enter(src: string, cdp: number | string): NonPayableTransactionObject<void>;

    first(arg0: string): NonPayableTransactionObject<string>;

    "flux(bytes32,uint256,address,uint256)"(
      ilk: string | number[],
      cdp: number | string,
      dst: string,
      wad: number | string
    ): NonPayableTransactionObject<void>;

    "flux(uint256,address,uint256)"(
      cdp: number | string,
      dst: string,
      wad: number | string
    ): NonPayableTransactionObject<void>;

    frob(
      cdp: number | string,
      dink: number | string,
      dart: number | string
    ): NonPayableTransactionObject<void>;

    give(cdp: number | string, dst: string): NonPayableTransactionObject<void>;

    ilks(arg0: number | string): NonPayableTransactionObject<string>;

    last(arg0: string): NonPayableTransactionObject<string>;

    list(
      arg0: number | string
    ): NonPayableTransactionObject<{
      prev: string;
      next: string;
      0: string;
      1: string;
    }>;

    move(
      cdp: number | string,
      dst: string,
      rad: number | string
    ): NonPayableTransactionObject<void>;

    open(
      ilk: string | number[],
      usr: string
    ): NonPayableTransactionObject<string>;

    owns(arg0: number | string): NonPayableTransactionObject<string>;

    quit(cdp: number | string, dst: string): NonPayableTransactionObject<void>;

    shift(
      cdpSrc: number | string,
      cdpDst: number | string
    ): NonPayableTransactionObject<void>;

    urnAllow(
      usr: string,
      ok: number | string
    ): NonPayableTransactionObject<void>;

    urnCan(arg0: string, arg1: string): NonPayableTransactionObject<string>;

    urns(arg0: number | string): NonPayableTransactionObject<string>;

    vat(): NonPayableTransactionObject<string>;
  };
  events: {
    NewCdp(cb?: Callback<NewCdp>): EventEmitter;
    NewCdp(options?: EventOptions, cb?: Callback<NewCdp>): EventEmitter;

    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };

  once(event: "NewCdp", cb: Callback<NewCdp>): void;
  once(event: "NewCdp", options: EventOptions, cb: Callback<NewCdp>): void;
}

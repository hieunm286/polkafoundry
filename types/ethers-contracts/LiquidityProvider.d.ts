/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  Contract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface LiquidityProviderInterface extends ethers.utils.Interface {
  functions: {
    "cancelMyOffers(address,address,address)": FunctionFragment;
    "linearOffers(address,address,address,uint256,uint256,uint256,uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "cancelMyOffers",
    values: [string, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "linearOffers",
    values: [
      string,
      string,
      string,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "cancelMyOffers",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "linearOffers",
    data: BytesLike
  ): Result;

  events: {};
}

export class LiquidityProvider extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: LiquidityProviderInterface;

  functions: {
    cancelMyOffers(
      otc: string,
      baseToken: string,
      quoteToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "cancelMyOffers(address,address,address)"(
      otc: string,
      baseToken: string,
      quoteToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    linearOffers(
      otc: string,
      baseToken: string,
      quoteToken: string,
      midPrice: BigNumberish,
      delta: BigNumberish,
      baseAmount: BigNumberish,
      count: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "linearOffers(address,address,address,uint256,uint256,uint256,uint256)"(
      otc: string,
      baseToken: string,
      quoteToken: string,
      midPrice: BigNumberish,
      delta: BigNumberish,
      baseAmount: BigNumberish,
      count: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  cancelMyOffers(
    otc: string,
    baseToken: string,
    quoteToken: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "cancelMyOffers(address,address,address)"(
    otc: string,
    baseToken: string,
    quoteToken: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  linearOffers(
    otc: string,
    baseToken: string,
    quoteToken: string,
    midPrice: BigNumberish,
    delta: BigNumberish,
    baseAmount: BigNumberish,
    count: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "linearOffers(address,address,address,uint256,uint256,uint256,uint256)"(
    otc: string,
    baseToken: string,
    quoteToken: string,
    midPrice: BigNumberish,
    delta: BigNumberish,
    baseAmount: BigNumberish,
    count: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    cancelMyOffers(
      otc: string,
      baseToken: string,
      quoteToken: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "cancelMyOffers(address,address,address)"(
      otc: string,
      baseToken: string,
      quoteToken: string,
      overrides?: CallOverrides
    ): Promise<void>;

    linearOffers(
      otc: string,
      baseToken: string,
      quoteToken: string,
      midPrice: BigNumberish,
      delta: BigNumberish,
      baseAmount: BigNumberish,
      count: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "linearOffers(address,address,address,uint256,uint256,uint256,uint256)"(
      otc: string,
      baseToken: string,
      quoteToken: string,
      midPrice: BigNumberish,
      delta: BigNumberish,
      baseAmount: BigNumberish,
      count: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    cancelMyOffers(
      otc: string,
      baseToken: string,
      quoteToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "cancelMyOffers(address,address,address)"(
      otc: string,
      baseToken: string,
      quoteToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    linearOffers(
      otc: string,
      baseToken: string,
      quoteToken: string,
      midPrice: BigNumberish,
      delta: BigNumberish,
      baseAmount: BigNumberish,
      count: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "linearOffers(address,address,address,uint256,uint256,uint256,uint256)"(
      otc: string,
      baseToken: string,
      quoteToken: string,
      midPrice: BigNumberish,
      delta: BigNumberish,
      baseAmount: BigNumberish,
      count: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    cancelMyOffers(
      otc: string,
      baseToken: string,
      quoteToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "cancelMyOffers(address,address,address)"(
      otc: string,
      baseToken: string,
      quoteToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    linearOffers(
      otc: string,
      baseToken: string,
      quoteToken: string,
      midPrice: BigNumberish,
      delta: BigNumberish,
      baseAmount: BigNumberish,
      count: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "linearOffers(address,address,address,uint256,uint256,uint256,uint256)"(
      otc: string,
      baseToken: string,
      quoteToken: string,
      midPrice: BigNumberish,
      delta: BigNumberish,
      baseAmount: BigNumberish,
      count: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}

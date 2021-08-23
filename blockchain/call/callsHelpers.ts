import { SendFunction, TxMeta } from '@oasisdex/transactions'
import {
  CallDef as CallDefAbstractContext,
  createSendTransaction as createSendTransactionAbstractContext,
  createSendWithGasConstraints as createSendWithGasConstraintsAbstractContext,
  estimateGas as estimateGasAbstractContext,
  EstimateGasFunction as EstimateGasFunctionAbstractContext,
  SendTransactionFunction as SendTransactionFunctionAbstractContext,
  TransactionDef as TransactionDefAbstractContext,
} from '@oasisdex/transactions'

export type CallDef<A, R> = CallDefAbstractContext<A, R, any>

export type TransactionDef<A extends TxMeta> = TransactionDefAbstractContext<A, any>

export type EstimateGasFunction<A extends TxMeta> = EstimateGasFunctionAbstractContext<
  A,
  any
  >
export type SendTransactionFunction<A extends TxMeta> = SendTransactionFunctionAbstractContext<
  A,
  any
  >

export function estimateGas<A extends TxMeta>(
  context: any,
  txDef: TransactionDef<A>,
  args: A,
) {
  return estimateGasAbstractContext<A, any>(context, txDef, args)
}

export function createSendTransaction<A extends TxMeta>(
  send: SendFunction<A>,
  context: any,
): SendTransactionFunction<A> {
  return createSendTransactionAbstractContext<A, any>(send, context)
}

export function createSendWithGasConstraints<A extends TxMeta>(
  send: SendFunction<A>,
  context: any,
  gasPrice$: any,
) {
  return createSendWithGasConstraintsAbstractContext<A, any>(send, context, gasPrice$)
}

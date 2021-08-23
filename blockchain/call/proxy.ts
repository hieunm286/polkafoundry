import { DsProxyRegistry } from "../../types/web3-v1-contracts/ds-proxy-registry"
import { TxMeta } from "@oasisdex/transactions"
import { TransactionDef as TransactionDefAbstractContext } from "@oasisdex/transactions"

export type TransactionDef<A extends TxMeta> = TransactionDefAbstractContext<A, any>

export type CreateDsProxyData = {
  kind: "createDsProxy"
}

export const createDsProxy: TransactionDef<CreateDsProxyData> = {
  call: (_, { dsProxyRegistry, contract }) =>
    // @ts-ignore
    contract<DsProxyRegistry>(dsProxyRegistry).methods["build()"],
  prepareArgs: () => [],
}

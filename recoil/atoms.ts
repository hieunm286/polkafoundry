import { atom } from "recoil"

export const connectionAccountState = atom<string | undefined>({
  key: "connectionAccountState",
  default: undefined,
})

export const proxyAccountAddress = atom<string | undefined>({
  key: "proxyAccountAddress",
  default: undefined
})

export const inputValueCreateLoanDeposite = atom<string>({
  key: "inputValueCreateLoanDeposite",
  default: "",
})

export const inputValueCreateLoanBorrow = atom<string>({
  key: "inputValueCreateLoanBorrow",
  default: "",
})

export const CREATE_LOAN_STAGE = {
  editForm: 'Edit form',
  createProxy: 'Create proxy',
  confirmation: 'Confirmation'
}

export const createLoanStage = atom<string>({
  key: "createLoanStage",
  default:CREATE_LOAN_STAGE.editForm
})

export const MANAGE_LOAN_STAGE = {
  editForm: 'Edit form',
  confirmation: "Confirmation",
  editFormCollateral: "Edit form collateral",
  confirmationCollateral: "Confirmation collateral",
  createProxy: 'Create proxy',
  createProxyCollateral: "Create proxy collateral"
}

export const manageLoanStage = atom<string>({
  key: "manageLoanStage",
  default:CREATE_LOAN_STAGE.editForm
})

export const triggerUpdate = atom<boolean>({
  key: "triggerUpdate",
  default: false
})

export const pageLoading = atom<boolean>({
  key: "pageLoading",
  default: false
})

export const appContext = atom<any>({
  key: 'appContext',
  default: undefined
})
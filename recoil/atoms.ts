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

}

export const createLoanStage = atom<string>({
  key: "createLoanStage",
  default:CREATE_LOAN_STAGE.editForm
})

export const MANAGE_LOAN_STAGE = {
  editForm: 'Edit form',
  confirmation: "Confirmation",
  editFormCollateral: "Edit form collateral",
  confirmationCollateral: "Confirmation collateral"
}

export const manageLoanStage = atom<string>({
  key: "manageLoanStage",
  default:CREATE_LOAN_STAGE.editForm
})
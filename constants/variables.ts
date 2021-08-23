import type { ElementOf } from 'ts-essentials'
import {LoanHistory} from "../helpers/model";

export const test = [
    {
        name: "ETH",
        price: "1$",
        ilk: "ETH"
    },
    {
        name: "BSC",
        price: "2$",
        ilk: "BSC"
    },
    {
        name: "SOTA",
        price: "3$",
        ilk: "SOTA"
    },
    {
        name: "USDT",
        price: "4$",
        ilk: "USDT"
    },
    {
        name: "NFTA",
        price: "5$",
        ilk: "NFTA"
    },
]

export const loadDetailTest: LoanHistory[] = [
    {
        action: 'Deposit',
        amount: '500',
        token: 'pUSD',
        time: new Date(),
        txtHash: 'txsasafsdfsdfsdfsdfsdfsdf123sdf'
    },
    {
        action: 'Borrow',
        amount: '0.5',
        token: 'ETH',
        time: new Date(),
        txtHash: 'txsasafsdfsdfsdfsdf321sdfsdfsdf'
    },
    {
        action: 'Create new Loan #122',
        amount: undefined,
        token: undefined,
        time: new Date(),
        txtHash: 'txsasafsdfsd3211fsdfsdfsdfsdfsdf'
    },
]

export const COIN_TAGS = ['stablecoin', 'lp-token'] as const
export type CoinTag = ElementOf<typeof COIN_TAGS>
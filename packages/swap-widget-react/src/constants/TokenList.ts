// @ts-nocheck
import goBTC from "../assets/avatars/goBTC.png";
import gAlgo from "../assets/avatars/gAlgo.png";
import algo from "../assets/avatars/icon.png";
import goETH from "../assets/avatars/goETH.png";
import USDt from "../assets/avatars/USDt.png";
import USDC from "../assets/avatars/USDC.png";


export type I_TokenList = {
    label: string;
    title: string;
    assetId: number;
    assetDecimal: number;
    src: string;
}

export const TokenObject = {
    0: {
        label: 'Algo',
        title: 'Algo',
        assetId: 0,
        assetDecimal: 6,
        amount: 0,
        src: algo
        // src: gAlgo,

    },
    167184545: {
        label: 'gALGO',
        title: 'gALGO',
        assetId: 167184545,
        assetDecimal: 6,
        amount: 0,
        src: gAlgo

    },
    67395862: {
        label: 'USDC',
        title: 'USD Coin',
        assetId: 67395862,
        assetDecimal: 6,
        amount: 0,
        src: USDC

    },
    67396430: {
        label: 'USDt',
        title: 'Tether',
        assetId: 67396430,
        assetDecimal: 6,
        amount: 0,
        src: USDt

    },
    67396528: {
        label: 'goBTC',
        title: 'Bitcoin',
        assetId: 67396528,
        assetDecimal: 8,
        amount: 0,
        src: goBTC
    },
    76598897: {
        label: 'goETH',
        title: 'Ethereum',
        assetId: 76598897,
        assetDecimal: 8,
        amount: 0,
        src: goETH

    }
}

const TokenList: I_TokenList[] = [
    {
        label: 'Algo',
        title: 'Algo',
        assetId: 0,
        assetDecimal: 6,
        src: algo
        // src: gAlgo,
    },
    {
        label: 'gALGO',
        title: 'gALGO',
        assetId: 167184545,
        assetDecimal: 6,
        src: gAlgo
    },
    {
        label: 'USDC',
        title: 'USD Coin',
        assetId: 67395862,
        assetDecimal: 6,
        src: USDC

    },
    {
        label: 'USDt',
        title: 'Tether',
        assetId: 67396430,
        assetDecimal: 6,
        src: USDt

    },
    {
        label: 'goBTC',
        title: 'Bitcoin',
        assetId: 67396528,
        assetDecimal: 8,
        src: goBTC
    },
    {
        label: 'goETH',
        title: 'Ethereum',
        assetId: 76598897,
        assetDecimal: 8,
        src: goETH
    },

]


export default TokenList;
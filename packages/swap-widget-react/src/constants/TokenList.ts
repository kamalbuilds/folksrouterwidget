// import { gAlgo } from "../assets/avatars";

export type I_TokenList = {
    label: string;
    title: string;
    assetId: number;
    assetDecimal: number;
    src: string;
}

const TokenList: I_TokenList[] = [
    {
        label: 'Algo',
        title: 'Algo',
        assetId: 0,
        assetDecimal: 6,
        src: 'https://user-images.githubusercontent.com/67144388/252993005-c5d02152-8ff6-400f-97f7-f867878ccb5f.png'
        // src: gAlgo,
    },
    {
        label: 'gALGO',
        title: 'gALGO',
        assetId: 167184545,
        assetDecimal: 6,
        src: 'https://user-images.githubusercontent.com/67144388/252993005-c5d02152-8ff6-400f-97f7-f867878ccb5f.png'

    },
    {
        label: 'USDC',
        title: 'USD Coin',
        assetId: 67395862,
        assetDecimal: 6,
        src: 'https://user-images.githubusercontent.com/67144388/252993005-c5d02152-8ff6-400f-97f7-f867878ccb5f.png'

    },
    {
        label: 'USDt',
        title: 'Tether',
        assetId: 67396430,
        assetDecimal: 6,
        src: 'https://user-images.githubusercontent.com/67144388/252993005-c5d02152-8ff6-400f-97f7-f867878ccb5f.png'

    },
    {
        label: 'goBTC',
        title: 'Bitcoin',
        assetId: 67396528,
        assetDecimal: 8,
        src: 'https://user-images.githubusercontent.com/67144388/252993005-c5d02152-8ff6-400f-97f7-f867878ccb5f.png'

    },
    {
        label: 'goETH',
        title: 'Ethereum',
        assetId: 76598897,
        assetDecimal: 8,
        src: 'https://user-images.githubusercontent.com/67144388/252993005-c5d02152-8ff6-400f-97f7-f867878ccb5f.png'

    },

]


export default TokenList;
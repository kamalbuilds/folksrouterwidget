export type I_TokenList = {
    label: string;
    title: string;
    assetId: number;
    assetDecimal: number;
}

const TokenList: I_TokenList[] = [
    {
        label: 'Algo',
        title: 'Algo',
        assetId: 0,
        assetDecimal: 6,
    },
    {
        label: 'gALGO',
        title: 'gALGO',
        assetId: 167184545,
        assetDecimal: 6,
    },
    {
        label: 'USDC',
        title: 'USD Coin',
        assetId: 67395862,
        assetDecimal: 6,
    },
    {
        label: 'USDt',
        title: 'Tether',
        assetId: 67396430,
        assetDecimal: 6,
    },
    {
        label: 'goBTC',
        title: 'Bitcoin',
        assetId: 67396528,
        assetDecimal: 8,
    },
    {
        label: 'goETH',
        title: 'Ethereum',
        assetId: 76598897,
        assetDecimal: 8,
    },

]


export default TokenList;
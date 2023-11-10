import React, { createContext } from "react";
import { I_TokenList } from "../constants/TokenList";

type I_SwapContext = {
    tokenOne: I_TokenList | undefined,
    tokenTwo: I_TokenList | undefined,
    tokenOneAmount: number,
    tokenTwoAmount: number,
    txnPayload: string | undefined,
    selectedToken: I_TokenList | undefined,
    slippageValue: number,
    setTokenOne: (tokenOne: I_TokenList | undefined) => void,
    setTokenOneAmount: (tokenOneAmount: number) => void,
    setTokenTwo: (tokenTwo: I_TokenList | undefined) => void,
    setTokenTwoAmount: (tokenTwoAmount: number,) => void,
    setTxnPayload: (txnPayload: string) => void,
    setSelectedToken: (selectedToken: I_TokenList | undefined) => void,
    setSlippageValue: (slippageValue: number) => void;
    getTokenAmount: any,
}

const initialValue = {
    tokenOne: undefined,
    tokenTwo: undefined,
    tokenOneAmount: 0,
    tokenTwoAmount: 0,
    txnPayload: '',
    selectedToken: undefined,
    slippageValue: 0,
    setTokenOne: () => { },
    setTokenOneAmount: () => { },
    setTokenTwo: () => { },
    setTokenTwoAmount: () => { },
    setTxnPayload: () => { },
    setSelectedToken: () => { },
    setSlippageValue: () => { },
    getTokenAmount: null

}

export const SwapContext = createContext<I_SwapContext>(initialValue);

const SwapContextProvider = ({ children }: any) => {

    const [tokenOne, setTokenOne] = React.useState<I_TokenList>();
    const [tokenTwo, setTokenTwo] = React.useState<I_TokenList>();

    const [tokenOneAmount, setTokenOneAmount] = React.useState<number>(0);
    const [tokenTwoAmount, setTokenTwoAmount] = React.useState<number>(0);

    const [selectedToken, setSelectedToken] = React.useState<I_TokenList>();

    const [txnPayload, setTxnPayload] = React.useState<string>();
    const [slippageValue, setSlippageValue] = React.useState(50);


    const fetchQuote = async (tokenAmount: number, InputToken: any, OutputToken: any, type: string) => {
        try {
            if (InputToken && OutputToken) {
                console.log("Inputs in fetch quote", InputToken, OutputToken, tokenAmount, type);

                const url = `https://api.folksrouter.io/testnet/v1/fetch/quote?network=testnet&fromAsset=${InputToken.assetId}&toAsset=${OutputToken.assetId}&amount=${tokenAmount}&type=${type}`;

                const response = await fetch(url);
                const res = await response.json();
                console.log("response", res);
                const { txnPayload } = res.result;
                setTxnPayload(txnPayload);
                console.log("Txn Payload", txnPayload);
                return res;
            }
        } catch (error) {
            console.log("Error", error);
        }
    }

    const getTokenAmount = async (tokenAmount: any, InputToken: any, OutputToken: any, type: string) => {

        if (tokenOne && tokenTwo && tokenAmount) {

            console.log("Input data in getTokenAmount fn", InputToken, OutputToken, type)

            const res = await fetchQuote(tokenAmount, InputToken, OutputToken, type);
            const { quoteAmount } = res.result;
            console.log("quoteAmount", quoteAmount);
            return quoteAmount;
        }
    }

    const getDataWhenTokensChanged = async (value: any, InputToken: any, OutputToken: any, type: string) => {
        const tokenAmount = value;

        let decimalTokenAmount;
        let outputTokenDecimal;

        if (type === 'FIXED_INPUT') {
            const inputTokenDecimal = InputToken?.assetDecimal;
            decimalTokenAmount = tokenAmount * (10 ** inputTokenDecimal);

            outputTokenDecimal = OutputToken?.assetDecimal;
        } else if (type === 'FIXED_OUTPUT') {
            const inputTokenDecimal = OutputToken?.assetDecimal;
            decimalTokenAmount = tokenAmount * (10 ** inputTokenDecimal);

            outputTokenDecimal = InputToken?.assetDecimal;
        }

        if (decimalTokenAmount) {
            const response = await fetchQuote(decimalTokenAmount, InputToken, OutputToken, type);

            if (response) {
                const { quoteAmount } = response.result;
                // const outputTokenDecimal = OutputToken?.assetDecimal;
                const fetchedAmount = quoteAmount / (10 ** outputTokenDecimal);
                console.log("Fetched Amount", fetchedAmount);
                return fetchedAmount;
            }
        }




        // if (type === 'FIXED_INPUT') {

        //     // Fixed Input h means tokenOne changed and tokenTwoAmount and tokenTwo Remains fixed

        //     console.log("Tokens", tokenOne, tokenTwo, type, tokenSelected)

        //     const inputTokenDecimal = tokenOne?.assetDecimal;
        //     let decimalTokenAmount = tokenAmount * (10 ** inputTokenDecimal);

        //     const response = await fetchQuote(decimalTokenAmount, tokenOne, tokenSelected, type);

        //     const { quoteAmount } = response.result;

        //     const outputTokenDecimal = tokenSelected?.assetDecimal;
        //     const fetchedAmount = quoteAmount / (10 ** outputTokenDecimal);
        //     console.log("Fetched Amount", fetchedAmount);
        //     return fetchedAmount;

        // } else if (type === 'FIXED_OUTPUT') {
        //     console.log("Tokens for fixed output", tokenOne, tokenTwo, type, tokenSelected)

        //     const inputTokenDecimal = tokenTwo?.assetDecimal;
        //     let decimalTokenAmount = tokenAmount * (10 ** inputTokenDecimal);

        //     const response = await fetchQuote(decimalTokenAmount, tokenTwo, tokenSelected, type);

        //     const { quoteAmount } = response.result;

        //     const outputTokenDecimal = tokenSelected?.assetDecimal;
        //     const fetchedAmount = quoteAmount / (10 ** outputTokenDecimal);
        //     console.log("Fetched Amount", fetchedAmount);
        //     return fetchedAmount;

        // }


    }




    return (
        <SwapContext.Provider value={{
            tokenOne,
            tokenOneAmount,
            tokenTwo,
            tokenTwoAmount,
            txnPayload,
            selectedToken,
            slippageValue,
            setTokenOne,
            setTokenOneAmount,
            setTokenTwo,
            setTokenTwoAmount,
            setTxnPayload,
            setSelectedToken,
            getTokenAmount,
            setSlippageValue,
            getDataWhenTokensChanged
        }}>
            {children}
        </SwapContext.Provider>
    )
}


export default SwapContextProvider;
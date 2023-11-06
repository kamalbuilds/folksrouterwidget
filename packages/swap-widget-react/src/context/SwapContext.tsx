import React, { createContext } from "react";
import { I_TokenList } from "../constants/TokenList";

type I_SwapContext = {
    tokenOne: I_TokenList | undefined,
    tokenTwo: I_TokenList | undefined,
    tokenOneAmount: number,
    tokenTwoAmount: number,
    txnPayload: string | undefined,
    selectedToken: I_TokenList | undefined,
    setTokenOne: (tokenOne: I_TokenList | undefined) => void,
    setTokenOneAmount: (tokenOneAmount: number) => void,
    setTokenTwo: (tokenTwo: I_TokenList | undefined) => void,
    setTokenTwoAmount: (tokenTwoAmount: number,) => void,
    setTxnPayload: (txnPayload: string) => void,
    setSelectedToken: (selectedToken: I_TokenList | undefined) => void,
    getTokenAmount: any,
}

const initialValue = {
    tokenOne: undefined,
    tokenTwo: undefined,
    tokenOneAmount: 0,
    tokenTwoAmount: 0,
    txnPayload: '',
    selectedToken: undefined,
    setTokenOne: () => { },
    setTokenOneAmount: () => { },
    setTokenTwo: () => { },
    setTokenTwoAmount: () => { },
    setTxnPayload: () => { },
    setSelectedToken: () => { },
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


    const fetchQuote = async (tokenAmount: number, InputToken: any, OutputToken: any) => {
        try {
            if (InputToken && OutputToken) {
                console.log("Inputs", InputToken, OutputToken, tokenAmount);

                const url = `https://api.folksrouter.io/testnet/v1/fetch/quote?network=testnet&fromAsset=${InputToken.assetId}&toAsset=${OutputToken.assetId}&amount=${tokenAmount}&type=FIXED_INPUT`;

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

    const getTokenAmount = async (tokenAmount: any, InputToken: any, OutputToken: any) => {
        if (tokenAmount && tokenOne && tokenTwo) {
            const inputTokenDecimal = InputToken?.assetDecimal;

            let decimalTokenAmount = tokenAmount * (10 ** inputTokenDecimal);
            console.log("Final Amount", decimalTokenAmount, inputTokenDecimal, tokenAmount);

            console.log("Token Selected", selectedToken);

            const res = await fetchQuote(decimalTokenAmount, InputToken, OutputToken);
            console.log("Res in the change function", res);

            const outputTokenDecimal = OutputToken?.assetDecimal;
            const { quoteAmount } = res.result;
            const fetchedAmount = quoteAmount / (10 ** outputTokenDecimal);
            console.log("Fetched Amount", fetchedAmount);
            return fetchedAmount;
        }
    }




    return (
        <SwapContext.Provider value={{
            tokenOne,
            tokenOneAmount,
            tokenTwo,
            tokenTwoAmount,
            txnPayload,
            selectedToken,
            setTokenOne,
            setTokenOneAmount,
            setTokenTwo,
            setTokenTwoAmount,
            setTxnPayload,
            setSelectedToken,
            getTokenAmount
        }}>
            {children}
        </SwapContext.Provider>
    )
}


export default SwapContextProvider;
"use client"
import * as React from "react";
import { IoSettingsSharp } from "react-icons/io5";
import { MdSwapVerticalCircle } from "react-icons/md";
import { ChakraProvider, Flex, useColorMode } from '@chakra-ui/react'
import { Button, Input, InputGroup, InputLeftAddon, InputLeftElement, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
// import TokenModal from "./Components/TokenModal";
import TokenList, { I_TokenList, TokenObject } from "../constants/TokenList";
import { IoIosCloseCircleOutline } from "react-icons/io";
import algosdk, { decodeUnsignedTransaction } from "algosdk";
import { TestnetAlgodClient } from "../utils/config";
import TransactionSettings from "../Components/TransactionSettings";
import AlgoConnect from "../Components/AlgoConnect/AlgoConnect";
import WidgetBottom from "../Components/Bottom/WidgetBottom";
import WidgetHeader from "../Components/Header/WidgetHeader";
import InputContainer from "../Components/InputContainer/InputContainer";
import OutputContainer from "../Components/OutputContainer/OutputContainer";
import { SwapContext } from "../context/SwapContext";
import TokenModal from "../Components/TokenModal";
import { useWallet } from "@txnlab/use-wallet";
import { GlobalContext } from "../context/GlobalContext";

const SwapWidget = () => {

    const [filteredTokenList, setFilteredTokenList] = React.useState(TokenList);
    const algod = TestnetAlgodClient;
    const {
        providers,
        activeAddress,
        signTransactions,
        sendTransactions,
        connectedAccounts,
        connectedActiveAccounts,
        activeAccount,
        clients,
        isActive
    } = useWallet()

    const { fetchPrices } = React.useContext(GlobalContext);

    const {
        tokenOne,
        tokenOneAmount,
        tokenTwo,
        tokenTwoAmount,
        selectedToken,
        txnPayload,
        setTokenOne,
        setTokenOneAmount,
        setTokenTwo,
        setTokenTwoAmount,
        setSelectedToken,
        getTokenAmount,
        slippageValue
    } = React.useContext(SwapContext);


    const handleInvertAssetButton = async () => {

        setTokenTwo(tokenOne);
        setTokenOne(tokenTwo);

        const tokenAmount = tokenOneAmount;

        let inputToken = tokenTwo;
        let outputToken = tokenOne;

        const inputTokenDecimal = inputToken?.assetDecimal;
        const outputTokenDecimal = outputToken?.assetDecimal;

        // @ts-ignore
        const decimalTokenAmount = tokenAmount * (10 ** inputTokenDecimal);

        const quoteAmount = await getTokenAmount(decimalTokenAmount, inputToken, outputToken, 'FIXED_INPUT');
// @ts-ignore
        const fetchedAmount = quoteAmount / (10 ** outputTokenDecimal);

        if (fetchedAmount) {
            setTokenTwoAmount(fetchedAmount);
        }

    }


    const handleSwapButton = async () => {
    // @ts-ignore
        const { address } = activeAccount;

        const url = `https://api.folksrouter.io/testnet/v1/prepare/swap?userAddress=${address}&slippageBps=${slippageValue}&txnPayload=${txnPayload}`

        const response = await fetch(url);
        const res = await response.json();
        const { result } = res;
        // @ts-ignore
        // const unsignedTxns = result.map(txn => decodeUnsignedTransaction(Buffer.from(txn, "base64")));
        const unsignedTxns = result.map(txn => Buffer.from(txn, "base64"));
        const signedTransactions = await signTransactions(unsignedTxns);
        console.log(signedTransactions,"signed");

        const sendraw = await algod.sendRawTransaction(signedTransactions).do();
        console.log(sendraw, "signed txn");
    }

    // const TestnetAlgodClient = new Algodv2("", "https://testnet-api.algonode.cloud/", 443);



    const filterTokenList = () => {
        const tokenlistFiltered = TokenList.filter((token: any) => (
            token !== selectedToken
        ))
        setFilteredTokenList(tokenlistFiltered);
    }

    React.useEffect(() => {
        filterTokenList();
    }, [selectedToken])

    const fetchPricesOfAssets = async () => {
        for (const asset of TokenList) {
            const assetId = asset?.mainnetAssetId;
            if (assetId) {
                const prices = await fetchPrices(assetId);
                if (prices) {
                    asset.price = prices; // Add the fetched price to the object
                } else {
                    console.log(`Failed to fetch prices for assetId ${assetId}.`);
                }
            }
        }
    }

    React.useEffect(() => {
        fetchPricesOfAssets();
    }, []);

    return (
        <>
            <div className="ui-flex  ui-items-center ui-justify-center ">

                <div className=" ui-bg-[#0f172a] ui-text-white ui-flex ui-flex-col ui-items-center ui-justify-center ui-border-2 ui-border-gray-600 ui-px-8 ui-py-4 ui-rounded-lg">

                    <WidgetHeader />

                    <div className="ui-flex ui-flex-col ui-gap-8 ui-w-[inherit] ui-m-[10px]">

                        <InputContainer />

                        <div className="ui-flex ui-justify-center ui-items-center">
                            <MdSwapVerticalCircle onClick={handleInvertAssetButton} className="ui-w-[40px] ui-h-[40px]" />
                        </div>

                        <OutputContainer />

                    </div>


                    <TransactionSettings />


                    <WidgetBottom handleSwapButton={handleSwapButton} />

                </div>

            </div>
            {/* <AlgoConnect /> */}
        </>
    );
};

export default SwapWidget;
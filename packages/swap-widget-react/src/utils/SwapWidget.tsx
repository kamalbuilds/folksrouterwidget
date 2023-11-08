"use client"
import * as React from "react";
import { IoSettingsSharp } from "react-icons/io5";
import { MdSwapVerticalCircle } from "react-icons/md";
import { ChakraProvider, Flex, useColorMode } from '@chakra-ui/react'
import { Button, Input, InputGroup, InputLeftAddon, InputLeftElement, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
// import TokenModal from "./Components/TokenModal";
import TokenList, { I_TokenList } from "../constants/TokenList";
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

const SwapWidget = () => {

    const { colorMode, toggleColorMode } = useColorMode();

    const [tokenPicked, setTokenPicked] = React.useState<number>(1);

    const [filteredTokenList, setFilteredTokenList] = React.useState(TokenList);

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


    const { isOpen, onOpen, onClose } = useDisclosure();
    const [accountAddress, setAccountAddress] = React.useState("");

    const openTokenModal = (tokenPicked: number) => {
        setTokenPicked(tokenPicked);
        onOpen();
    }

    const handleInvertAssetButton = async () => {

        setTokenTwo(tokenOne);
        setTokenOne(tokenTwo);

        const tokenAmount = tokenOneAmount;

        let inputToken = tokenTwo;
        let outputToken = tokenOne;

        const inputTokenDecimal = inputToken?.assetDecimal;
        const outputTokenDecimal = outputToken?.assetDecimal;

        const decimalTokenAmount = tokenAmount * (10 ** inputTokenDecimal);

        const quoteAmount = await getTokenAmount(decimalTokenAmount, inputToken, outputToken, 'FIXED_INPUT');

        const fetchedAmount = quoteAmount / (10 ** outputTokenDecimal);

        if (fetchedAmount) {
            setTokenTwoAmount(fetchedAmount);
        }

    }


    const handleSwapButton = async () => {

        const { address } = activeAccount;

        console.log("activeAccount", activeAccount, address, activeAddress, slippageValue);

        const url = `https://api.folksrouter.io/testnet/v1/prepare/swap?userAddress=${address}&slippageBps=${slippageValue}&txnPayload=${txnPayload}`

        const response = await fetch(url);
        const res = await response.json();
        console.log("response", res);

        const { result } = res;

        SignusingPerraWallet(result)

    }

    // const TestnetAlgodClient = new Algodv2("", "https://testnet-api.algonode.cloud/", 443);
    const algod = TestnetAlgodClient;

    const SignusingPerraWallet = async (result: any) => {
        try {
            const { address } = activeAccount;

            console.log("activeAccount", activeAccount, address);

            // const signedTransactions = await signTransactions([result]);
            // const waitRoundsToConfirm = 4
            // const { id } = await sendTransactions(signedTransactions, waitRoundsToConfirm)

            // console.log('Successfully sent transaction. Transaction ID: ', id)



            // // @ts-ignore
            const unsignedTxns = result.map(txn => decodeUnsignedTransaction(Buffer.from(txn, "base64")));
            console.log(unsignedTxns, "unsigned");
            const multipleTxnGroups = [
                { txn: unsignedTxns[0], signers: [address] },
                { txn: unsignedTxns[1], signers: [address] },
                { txn: unsignedTxns[2], signers: [address] }
            ];


            console.log("multipleTxnGroups", multipleTxnGroups)

            const encodedTransaction = algosdk.encodeUnsignedTransaction(unsignedTxns[0]);
            console.log("encodedTransaction", encodedTransaction);
            const signedTransactions = await signTransactions([encodedTransaction])
            console.log("signedTransactions", signedTransactions);

            // const signedTxns = await peraWallet.signTransaction([multipleTxnGroups], address);
            // // const signedTxns = unsignedTxns.map(txn => txn.signTxn(user.sk));
            // console.log("signed txn", signedTxns);
            // // submit
            // const sendraw = await algod.sendRawTransaction(signedTxns).do();
            // console.log(sendraw, "signed txn");
        } catch (error) {
            console.log("Couldn't sign Opt-in txns", error);
        }
    };

    const filterTokenList = () => {
        const tokenlistFiltered = TokenList.filter((token: any) => (
            token !== selectedToken
        ))
        setFilteredTokenList(tokenlistFiltered);
    }

    React.useEffect(() => {
        filterTokenList();
    }, [selectedToken])

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
            <AlgoConnect />
        </>
    );
};

export default SwapWidget;
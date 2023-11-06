"use client"
import * as React from "react";
import { IoSettingsSharp } from "react-icons/io5";
import { MdSwapVerticalCircle } from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaWallet } from "react-icons/fa";
import { ChakraProvider, Flex, useColorMode } from '@chakra-ui/react'
import { Button, Input, InputGroup, InputLeftAddon, InputLeftElement, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
// import TokenModal from "./Components/TokenModal";
import TokenList, { I_TokenList } from "../constants/TokenList";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoMdRemove } from "react-icons/io";
import { IoIosAdd } from "react-icons/io";
import InputTokenAmount from "../Components/InputToken";
// import SelectToken from ".,/Components/SelectToken";
import { PeraWalletConnect } from "@perawallet/connect";
// import { MainnetAlgodClient , sender , TestnetAlgodClient} from '../utils/config';

import { decodeUnsignedTransaction } from "algosdk";
import { TestnetAlgodClient } from "../utils/config";
import TransactionSettings from "../Components/TransactionSettings";
import { WalletProvider, useInitializeProviders, PROVIDER_ID } from '@txnlab/use-wallet'
import AlgoConnect from "../Components/AlgoConnect/AlgoConnect";
import WidgetBottom from "../Components/Bottom/WidgetBottom";
import WidgetHeader from "../Components/Header/WidgetHeader";

import { DeflyWalletConnect } from '@blockshake/defly-connect'
import InputContainer from "../Components/InputContainer/InputContainer";
import OutputContainer from "../Components/OutputContainer/OutputContainer";
import GlobalContextProvider from "../context/GlobalContext";
import SwapContextProvider, { SwapContext } from "../context/SwapContext";
import TokenModal from "../Components/TokenModal";

const SwapWidget = () => {

    const { colorMode, toggleColorMode } = useColorMode();

    const [tokenPicked, setTokenPicked] = React.useState<number>(1);

    const [filteredTokenList, setFilteredTokenList] = React.useState(TokenList);

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
        getTokenAmount
    } = React.useContext(SwapContext);


    const { isOpen, onOpen, onClose } = useDisclosure();
    const [accountAddress, setAccountAddress] = React.useState("");

    const [slippageValue, setSlippageValue] = React.useState(50);


    const openTokenModal = (tokenPicked: number) => {
        setTokenPicked(tokenPicked);
        onOpen();
    }


    const getDataWhenTokensChanged = async (value: any, tokenSelected: any, tokenPicked: any) => {
        const tokenAmount = value;

        const inputToken = tokenSelected;
        const outputToken = tokenPicked == 1 ? tokenTwo : tokenOne;

        console.log("Tokens which ", inputToken, outputToken);

        const outputTokenAmount = await getTokenAmount(tokenAmount, inputToken, outputToken);
        console.log("outputTokenAmount", outputTokenAmount)

        if (outputTokenAmount) {
            if (tokenPicked == 1) {
                setTokenTwoAmount(outputTokenAmount);
            } else {
                setTokenOneAmount(outputTokenAmount);
            }
        }
    }

    const handleTokenSelect = (token: any) => {
        console.log("Token selected", token, tokenPicked);

        if (tokenPicked == 1) {
            setTokenOne(token);
            if (tokenOneAmount) {
                getDataWhenTokensChanged(tokenOneAmount, token, tokenPicked);
            }
        } else if (tokenPicked == 2) {
            setTokenTwo(token);
            if (tokenTwoAmount) {
                getDataWhenTokensChanged(tokenTwoAmount, token, tokenPicked);
            }
        }
        setSelectedToken(token);
    }




    const handleInvertAssetButton = async () => {
        console.log("Tokens", tokenOne, tokenTwo, tokenOneAmount);

        const tokenAmount = tokenOneAmount;

        setTokenTwo(tokenOne);
        setTokenOne(tokenTwo);

        let inputToken = tokenTwo;
        let outputToken = tokenOne;


        const outputTokenAmount = await getTokenAmount(tokenAmount, inputToken, outputToken);
        console.log("outputTokenAmount", outputTokenAmount)
        if (outputTokenAmount) {
            setTokenTwoAmount(outputTokenAmount);
        }

    }


    const handleSwapButton = async () => {
        console.log("Token Data", tokenOne, tokenTwo, tokenOneAmount, tokenTwoAmount, txnPayload, slippageValue);

        // const url = 'https://api.folksrouter.io/testnet/v1/prepare/swap/';

        const url = `https://api.folksrouter.io/testnet/v1/prepare/swap?userAddress=${accountAddress}&slippageBps=${slippageValue}&txnPayload=${txnPayload}`

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
            // @ts-ignore
            const unsignedTxns = result.map(txn => decodeUnsignedTransaction(Buffer.from(txn, "base64")));
            console.log(unsignedTxns, "unsigned");
            const multipleTxnGroups = [
                { txn: unsignedTxns[0], signers: [accountAddress] },
                { txn: unsignedTxns[1], signers: [accountAddress] },
                { txn: unsignedTxns[2], signers: [accountAddress] }
            ];
            const signedTxns = await peraWallet.signTransaction([multipleTxnGroups], accountAddress);
            // const signedTxns = unsignedTxns.map(txn => txn.signTxn(user.sk));
            console.log("signed txn", signedTxns);
            // submit
            const sendraw = await algod.sendRawTransaction(signedTxns).do();
            console.log(sendraw, "signed txn");
        } catch (error) {
            console.log("Couldn't sign Opt-in txns", error);
        }
    };

    const filterTokenList = () => {
        console.log("Selected Token", selectedToken);
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


                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent bg='#304256' w='425px' m='auto' borderRadius='15px' style={{ height: '500px' }}>
                        <ModalHeader color='#FFF' >
                            <Flex justify={'space-between'}>
                                Select Token
                                <IoIosCloseCircleOutline onClick={onClose} className="ui-w-[30px] ui-h-[30px] ui-cursor-pointer" />
                            </Flex>
                        </ModalHeader>

                        <ModalBody p={0}>
                            <TokenModal
                                tokenList={filteredTokenList}
                                handleTokenSelect={handleTokenSelect}
                                onClose={onClose}
                            />
                        </ModalBody>
                    </ModalContent>
                </Modal>

                <div className=" ui-bg-[#0f172a] ui-text-white ui-flex ui-flex-col ui-items-center ui-justify-center ui-border-2 ui-border-gray-600 ui-px-8 ui-py-4 ui-rounded-lg">

                    <WidgetHeader />

                    <div className="ui-flex ui-flex-col ui-gap-8 ui-w-[inherit] ui-m-[10px]">

                        <InputContainer
                            openTokenModal={openTokenModal}
                            filteredTokenList={filteredTokenList}
                            handleTokenSelect={handleTokenSelect}
                        />

                        <div className="ui-flex ui-justify-center ui-items-center">
                            <MdSwapVerticalCircle onClick={handleInvertAssetButton} className="ui-w-[40px] ui-h-[40px]" />
                        </div>

                        <OutputContainer
                            openTokenModal={openTokenModal}
                            filteredTokenList={filteredTokenList}
                            handleTokenSelect={handleTokenSelect}
                        />

                    </div>


                    <TransactionSettings slippageValue={slippageValue} setSlippageValue={setSlippageValue} />


                    <WidgetBottom handleSwapButton={handleSwapButton} />

                </div>

            </div>
            <AlgoConnect />
        </>
    );
};

export default SwapWidget;
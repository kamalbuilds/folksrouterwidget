"use client"
import * as React from "react";
import { IoSettingsSharp } from "react-icons/io5";
import { MdSwapVerticalCircle } from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaWallet } from "react-icons/fa";
import { ChakraProvider, Flex } from '@chakra-ui/react'
import { Button, Input, InputGroup, InputLeftAddon, InputLeftElement, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import TokenModal from "./Components/TokenModal";
import TokenList, { I_TokenList } from "./constants/TokenList";
import { IoIosCloseCircleOutline } from "react-icons/io";
import InputTokenAmount from "./Components/InputToken";
import SelectToken from "./Components/SelectToken";



export function Widget({ }) {

    const [tokenOneAmount, setTokenOneAmount] = React.useState<number>(0);
    const [tokenTwoAmount, setTokenTwoAmount] = React.useState<number>(0);

    const [tokenPicked, setTokenPicked] = React.useState<number>(1);
    const [selectedToken, setSelectedToken] = React.useState<I_TokenList>();

    const [filteredTokenList, setFilteredTokenList] = React.useState(TokenList);

    const [isLoading, setIsLoading] = React.useState(false);

    // For getting details of Token One and Token Two
    const [tokenOne, setTokenOne] = React.useState<I_TokenList>();
    const [tokenTwo, setTokenTwo] = React.useState<I_TokenList>();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const openTokenModal = (tokenPicked: number) => {
        setTokenPicked(tokenPicked);
        onOpen();
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

    const changeTokenOneAmount = async (value: any) => {

        const tokenAmount = value;
        setTokenOneAmount(tokenAmount);

        console.log("Token Amount", tokenAmount, tokenOne, tokenTwo);

        const outputTokenAmount = await getTokenAmount(tokenAmount, tokenOne, tokenTwo);
        console.log("outputTokenAmount", outputTokenAmount)

        if (outputTokenAmount) {
            setTokenTwoAmount(outputTokenAmount);
        }

    }

    const changeTokenTwoAmount = async (value: any) => {
        setIsLoading(true);

        const tokenAmount = value;
        setTokenTwoAmount(tokenAmount);

        console.log("Token Amount", tokenAmount, tokenOne, tokenTwo);

        const outputTokenAmount = await getTokenAmount(tokenAmount, tokenTwo, tokenOne);
        console.log("outputTokenAmount", outputTokenAmount)

        if (outputTokenAmount) {
            setTokenOneAmount(outputTokenAmount);
        }

        setIsLoading(false);

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


    const fetchQuote = async (tokenAmount: number, InputToken: any, OutputToken: any) => {
        try {
            if (InputToken && OutputToken) {
                console.log("Inputs", InputToken, OutputToken, tokenAmount);

                const url = `https://api.folksrouter.io/testnet/v1/fetch/quote?network=testnet&fromAsset=${InputToken.assetId}&toAsset=${OutputToken.assetId}&amount=${tokenAmount}&type=FIXED_INPUT`;

                const response = await fetch(url);
                const res = await response.json();
                console.log("response", res);
                return res;
            }
        } catch (error) {
            console.log("Error", error);
        }
    }

    const handleSwapButton = async () => {
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
        <ChakraProvider>
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

                    <div className="ui-flex ui-flex-row ui-justify-between ui-flex-1 ui-w-[100%]">
                        <div className="ui-text-[20px]">Swap</div>
                        <div className="ui-border ui-border-gray-600 hover:ui-border-gray-300 ui-p-[10px] ui-cursor-pointer ui-rounded-xl">
                            <IoSettingsSharp />
                        </div>
                    </div>

                    <div className="ui-flex ui-flex-col ui-gap-8 ui-w-[inherit] ui-m-[10px]">
                        <div>
                            <p className="ui-text-[16px] ui-text-gray-500">You Pay</p>
                            <div className="ui-flex ui-bg-[#1E293B]  ui-border-gray-400 ui-border ui-px-4 ui-py-2 ui-rounded-xl ui-flex-col ui-gap-4">
                                <div className="ui-flex ui-justify-between">

                                    <InputTokenAmount
                                        tokenAmount={tokenOneAmount}
                                        changeTokenAmount={changeTokenOneAmount}
                                        setTokenAmount={setTokenOneAmount}
                                    />

                                    <SelectToken
                                        id={'1'}
                                        openTokenModal={openTokenModal}
                                        token={tokenOne}
                                    />
                                </div>

                                <div className="ui-flex ui-flex-row ui-justify-between ui-text-gray-400">
                                    <div className="">
                                        <span className="ui-text-[20px]">$0</span>
                                        <span className="ui-text-[14px]">.0</span>
                                    </div>
                                    <div className="ui-flex ui-flex-row ui-gap-[4px] ui-items-center">
                                        <FaWallet />
                                        <div>0.00</div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="ui-flex ui-justify-center ui-items-center">
                            <MdSwapVerticalCircle onClick={handleSwapButton} className="ui-w-[40px] ui-h-[40px]" />
                        </div>

                        <div>
                            <p className="ui-text-[16px]  ui-text-gray-500">You Receive</p>

                            <div className="ui-flex ui-bg-[#1E293B]  ui-border-gray-400 ui-border ui-px-4 ui-py-2 ui-rounded-xl ui-flex-col ui-gap-4">
                                <div className="ui-flex ui-justify-between">
                                    <InputTokenAmount
                                        tokenAmount={tokenTwoAmount}
                                        changeTokenAmount={changeTokenTwoAmount}
                                        setTokenAmount={setTokenTwoAmount}
                                    />

                                    <SelectToken
                                        id={'2'}
                                        openTokenModal={openTokenModal}
                                        token={tokenTwo}
                                    />
                                </div>

                                <div className="ui-flex ui-flex-row ui-justify-between ui-text-gray-400">
                                    <div className="">
                                        <span className="ui-text-[20px]">$0</span>
                                        <span className="ui-text-[14px]">.0</span>
                                    </div>
                                    <div className="ui-flex ui-flex-row ui-gap-[4px] ui-items-center">
                                        <FaWallet />
                                        <div>0.00</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button
                            className="ui-rounded-lg ui-bg-blue-500 hover:ui-bg-violet-800 ui-px-4 ui-py-2 ui-cursor-pointer">
                            Connect Wallet
                        </button>
                    </div>
                </div>
            </div>
        </ChakraProvider>
    )
}
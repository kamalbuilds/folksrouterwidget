"use client"
import * as React from "react";
import { IoSettingsSharp } from "react-icons/io5";
import { MdSwapVerticalCircle } from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaWallet } from "react-icons/fa";
import { ChakraProvider } from '@chakra-ui/react'


import { Button, Input, InputGroup, InputLeftAddon, InputLeftElement, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import TokenModal from "./Components/TokenModal";
import TokenList, { I_TokenList } from "./constants/TokenList";


export function Widget({ }) {

    const [tokenOneAmount, setTokenOneAmount] = React.useState<number>(0);
    const [tokenTwoAmount, setTokenTwoAmount] = React.useState<number>(0);

    const [tokenPicked, setTokenPicked] = React.useState<number>(1);

    const [selectedToken, setSelectedToken] = React.useState<I_TokenList>();

    const [tokenOne, setTokenOne] = React.useState<I_TokenList>();
    const [tokenTwo, setTokenTwo] = React.useState<I_TokenList>();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const openTokenModal = (tokenPicked: number) => {
        setTokenPicked(tokenPicked);
        onOpen();
    }



    const changeTokenOneAmount = (e: any) => {
        e.preventDefault();
        const tokenAmount = parseInt(e.target.value.replace(/\D/, '')) || 0
        setTokenOneAmount(tokenAmount);

        if (tokenAmount && tokenOne) {
            const tokenOneDecimal = tokenOne?.assetDecimal;

            let finalAmount = tokenAmount * (10 ** tokenOneDecimal);
            console.log("Final Amount", finalAmount, tokenOneDecimal, tokenAmount);

            // setTokenOneAmount(finalAmount);
            console.log("Token Selected", selectedToken);
            fetchQuote(finalAmount);

        }



    }

    const changeTokenTwoAmount = (e: any) => {
        e.preventDefault();
        setTokenTwoAmount(parseInt(e.target.value.replace(/\D/, '')) || 0);

        console.log("Token Selected", selectedToken);
    }

    const handleTokenSelect = (token: any) => {
        console.log("Token selected", token, TokenList[0]);

        if (tokenPicked == 1) {
            setTokenOne(token);
        } else if (tokenPicked === 2) {
            setTokenTwo(token);
        }

        setSelectedToken(token);
    }


    const fetchQuote = async (tokenAmount: number) => {
        try {

            if (tokenOne && tokenTwo) {
                console.log("Inputs", tokenOne, tokenTwo, tokenAmount);

                const url = `https://api.folksrouter.io/testnet/v1/fetch/quote?network=testnet&fromAsset=${tokenOne.assetId}&toAsset=${tokenTwo.assetId}&amount=${tokenAmount}&type=FIXED_INPUT`;

                const response = await fetch(url);
                const res = await response.json();
                console.log("response", res);
            }



        } catch (error) {
            console.log("Error", error);
        }
    }



    return (
        <ChakraProvider>
            <div className="ui-flex  ui-items-center ui-justify-center ">


                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent bg='#304256' w='300px' m='auto' borderRadius='20px' style={{ height: '500px' }}>
                        <ModalHeader color='#FFF'>Select Token</ModalHeader>

                        <ModalCloseButton color='#FFF' fontSize='md' />
                        <ModalBody p={0}>
                            <TokenModal
                                tokenList={TokenList}
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
                        <div className="ui-flex ui-bg-[#1E293B]  ui-border-gray-400 ui-border ui-px-4 ui-py-2 ui-rounded-xl ui-flex-col ui-gap-4">
                            <div className="ui-flex">
                                <div>
                                    <p className="ui-text-[16px] ui-text-gray-500">You Pay</p>
                                    <span className='ui-flex-1 ui-flex ui-flex-col ui-justify-center ui-items-end'>
                                        <div className='ui-w-full'>
                                            <input
                                                className='ui-text-[34px] ui-w-[300px]  ui-text-slate-300 focus-visible:ui-shadow-none focus-visible:ui-outline-0 ui-text-start ui-bg-transparent '
                                                height='100%'
                                                placeholder='0'
                                                value={tokenOneAmount}
                                                onChange={(e) => changeTokenOneAmount(e)}
                                                autoFocus={true}
                                            />
                                        </div>
                                    </span>
                                </div>

                                <div className="ui-flex ui-flex-col ui-justify-center">
                                    <div onClick={() => openTokenModal(1)} className="ui-flex ui-cursor-pointer ui-rounded-full ui-items-center ui-flex-row ui-gap-2 ui-bg-gray-700 ui-border ui-border-gray-400 ui-p-[10px]">
                                        <div className="ui-flex ui-items-center ui-gap-2">
                                            {tokenOne ? (
                                                <>
                                                    <img className='rounded-3xl'
                                                        src='https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
                                                        alt='USDC'
                                                        width={30}
                                                        height={30}
                                                    />
                                                    <p>{tokenOne?.label}</p>
                                                </>
                                            ) : (
                                                <>
                                                    Select Asset
                                                </>
                                            )}
                                        </div>
                                        <div>
                                            <RiArrowDropDownLine className="ui-w-[30px] ui-h-[30px]" />
                                        </div>
                                    </div>
                                </div>
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


                        <div className="ui-flex ui-justify-center ui-items-center">
                            <MdSwapVerticalCircle className="ui-w-[40px] ui-h-[40px]" />
                        </div>


                        <div className="ui-flex ui-bg-[#1E293B]  ui-border-gray-400 ui-border ui-px-4 ui-py-2 ui-rounded-xl ui-flex-col ui-gap-4">
                            <div className="ui-flex">
                                <div>
                                    <p className="ui-text-[16px]  ui-text-gray-500">You Receive</p>
                                    <span className='ui-flex-1 ui-flex ui-flex-col ui-justify-center ui-items-end'>
                                        <div className='ui-w-full'>
                                            <input
                                                className='ui-text-[34px] ui-w-[300px] ui-text-slate-300 focus-visible:ui-shadow-none focus-visible:ui-outline-0 ui-text-start ui-bg-transparent'
                                                height='100%'
                                                placeholder='0'
                                                value={tokenTwoAmount}
                                                onChange={(e) => changeTokenTwoAmount(e)}
                                                autoFocus={true}
                                            />
                                        </div>
                                    </span>
                                </div>

                                <div className="ui-flex ui-flex-col ui-justify-center">
                                    <div onClick={() => openTokenModal(2)} className="ui-flex ui-cursor-pointer ui-rounded-full ui-items-center ui-flex-row ui-gap-2 ui-bg-gray-700 ui-border ui-border-gray-400 ui-p-[10px]">
                                        {tokenTwo ? (
                                            <div className="ui-flex ui-items-center ui-gap-2">
                                                <img className='rounded-3xl'
                                                    src='https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
                                                    alt='USDC'
                                                    width={30}
                                                    height={30}
                                                />
                                                <p>{tokenTwo?.label}</p>
                                            </div>
                                        ) : (
                                            <>
                                                Select Asset
                                            </>
                                        )}
                                        <div>
                                            <RiArrowDropDownLine className="ui-w-[30px] ui-h-[30px]" />
                                        </div>
                                    </div>
                                </div>
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
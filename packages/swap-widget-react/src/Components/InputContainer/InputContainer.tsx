import React, { useContext, useEffect } from 'react';
import InputTokenAmount from '../InputToken';
import SelectToken from '../SelectToken';
import { FaWallet } from "react-icons/fa";
import { Button, Flex, Input, InputGroup, InputLeftAddon, InputLeftElement, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import TokenModal from '../TokenModal';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { GlobalContext } from '../../context/GlobalContext';
import { useWallet } from '@txnlab/use-wallet';
import { SwapContext } from '../../context/SwapContext';



const InputContainer = ({
    openTokenModal,
    filteredTokenList,
    handleTokenSelect

}: any) => {
    const { isOpen, onOpen, onClose } = useDisclosure();


    const {
        clients,
        activeAccount
    } = useWallet()

    const { getAssets } = useContext(GlobalContext);

    const getUsersAssets = async () => {
        const usersAssets = await getAssets();

        console.log("User Assets", usersAssets);

    }


    useEffect(() => {
        console.log("<<<<<Active Account>>>>", activeAccount)
        if (activeAccount) {
            getUsersAssets();
        }
    }, [activeAccount])

    const {
        tokenOne,
        tokenTwo,
        tokenOneAmount,
        tokenTwoAmount,
        setTokenOneAmount,
        setTokenTwoAmount,
        getTokenAmount
    } = React.useContext(SwapContext);


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


    return (

        <div>

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
    );
};

export default InputContainer;
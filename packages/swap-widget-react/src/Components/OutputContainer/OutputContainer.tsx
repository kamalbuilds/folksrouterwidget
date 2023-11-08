import React from 'react';
import SelectToken from '../SelectToken';
import { FaWallet } from "react-icons/fa";
import InputTokenAmount from '../InputToken';
import { Button, Flex, Input, InputGroup, InputLeftAddon, InputLeftElement, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { IoIosCloseCircleOutline } from "react-icons/io";
import TokenModal from '../TokenModal';
import { SwapContext } from '../../context/SwapContext';
import TokenList, { I_TokenList } from '../../constants/TokenList';

const OutputContainer = ({
    // filteredTokenList,
}: any) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [filteredTokenList, setFilteredTokenList] = React.useState(TokenList);

    const {
        tokenOne,
        tokenTwo,
        tokenOneAmount,
        tokenTwoAmount,
        selectedToken,
        setTokenTwo,
        setTokenOneAmount,
        setTokenTwoAmount,
        getDataWhenTokensChanged,
        setSelectedToken,
        getTokenAmount
    } = React.useContext(SwapContext);


    const changeTokenTwoAmount = async (value: any) => {
        const tokenAmount = value;
        setTokenTwoAmount(tokenAmount);

        const tokenTwoDecimal = tokenTwo?.assetDecimal;
        const tokenOneDecimal = tokenOne?.assetDecimal;
        const decimalTokenAmount = tokenAmount * (10 ** tokenTwoDecimal);

        const quoteAmount = await getTokenAmount(decimalTokenAmount, tokenOne, tokenTwo, 'FIXED_OUTPUT');

        const fetchedAmount = quoteAmount / (10 ** tokenOneDecimal);

        console.log("fetchedAmount in output", fetchedAmount);

        if (fetchedAmount) {
            setTokenOneAmount(fetchedAmount);
        }

    }

    const handleTokenSelection = async (token: I_TokenList) => {
        setTokenTwo(token);
        setSelectedToken(token);

        if (tokenTwoAmount) {
            const outputTokenAmount = await getDataWhenTokensChanged(tokenTwoAmount, token, 'FIXED_OUTPUT');

            if (outputTokenAmount) {
                setTokenOneAmount(outputTokenAmount);
            }
        } else if (tokenOneAmount) {
            const outputTokenAmount = await getDataWhenTokensChanged(tokenOneAmount, token, 'FIXED_INPUT');
            if (outputTokenAmount) {
                setTokenTwoAmount(outputTokenAmount);
            }
        }
    }

    const filterTokenList = () => {
        console.log("Selected token", selectedToken);
        const tokenlistFiltered = TokenList.filter((token: any) => (
            token.assetId !== selectedToken?.assetId))
        setFilteredTokenList(tokenlistFiltered);
    }

    React.useEffect(() => {
        console.log(" In Input Selected token in useEffect", selectedToken);
        filterTokenList();
    }, [selectedToken])

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
                            handleTokenSelect={handleTokenSelection}
                            onClose={onClose}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>



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
                        openTokenModal={onOpen}
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
    );
};

export default OutputContainer;
import React, { useState } from 'react';
import { Input } from '@chakra-ui/react';
import { I_TokenList } from '../constants/TokenList';
import { Image } from '@chakra-ui/react';


const TokenModal = ({
    tokenList,
    handleTokenSelect,
    onClose
}: any) => {

    const [listOfTokens, setListOfTokens] = useState(tokenList);

    const selectToken = (token: I_TokenList) => {
        handleTokenSelect(token)
        onClose();
    }

    const handleSearch = (e: any) => {
        const value = e.target.value;
        const sortedTokenList = tokenList.filter((token: any) =>
            token.label.toLowerCase().includes(value?.toLowerCase())
        );
        setListOfTokens(sortedTokenList);
    }

    return (
        <div className='ui-text-white'>
            <div className='ui-p-4'>
                <Input placeholder='Search for a token' size='md' onChange={handleSearch} />
            </div>
            <div className='ui-overflow-scroll ui-h-[350px]'>
                {listOfTokens.map((token: any) => {
                    console.log(token ,"token")
                    return (
                        <div
                            onClick={() => {
                                console.log("Clicked")
                                selectToken(token);
                            }}
                            key={token.assetId}
                            className='ui-text-white ui-flex ui-items-center ui-py-4 ui-px-4 ui-cursor-pointer ui-my-2 hover:ui-bg-[#486586] hover:ui-text-white'>
                            <div className='leftTokenContainer ui-mr-4'>
                                <img src={token.src}  className='ui-w-[30px] ui-h-[30px]' alt="img not fetched" />
                            </div>
                            <div className='ui-flex ui-flex-col ui-items-baseline'>
                                <div className=''>{token.title}</div>
                                <div>{token.label}</div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default TokenModal;
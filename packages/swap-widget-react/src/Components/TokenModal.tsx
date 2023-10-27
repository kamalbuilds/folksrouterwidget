import React from 'react';
import { Input } from '@chakra-ui/react';
import { I_TokenList } from '../constants/TokenList';



const TokenModal = ({
    tokenList,
    handleTokenSelect,
    onClose
}: any) => {

    const selectToken = (token: I_TokenList) => {
        handleTokenSelect(token)
        onClose();
    }

    return (
        <div className='ui-text-white'>
            <div className='ui-p-4'>
                <Input placeholder='Search for a token' size='md' />

            </div>
            <div className='ui-overflow-scroll ui-h-[350px]'>
                {tokenList.map((token: any) => {
                    return (
                        <div
                            onClick={() => {
                                console.log("Clicked")
                                selectToken(token);
                            }}
                            key={token.assetId}
                            className='ui-text-white ui-flex ui-items-center ui-py-4 ui-px-4 ui-cursor-pointer ui-my-2 hover:ui-bg-[#486586] hover:ui-text-white'>
                            <div className='leftTokenContainer ui-mr-4'>
                                {/* <img src={token.logoURI} className='w-[50px]' /> */}
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
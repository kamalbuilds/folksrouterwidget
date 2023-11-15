import { PROVIDER_ID, WalletClient, useWallet } from '@txnlab/use-wallet';
import React, { useEffect, useState } from 'react';
import { TokenObject } from '../../constants/TokenList';

const ProfileSettings = () => {
    const { providers, connectedAccounts, connectedActiveAccounts, activeAccount, clients, isActive } = useWallet()

    const [provider, setProvider] = useState<any>();

    const getClient = (id?: PROVIDER_ID): WalletClient => {
        if (!id) throw new Error('Provider ID is missing.')

        const walletClient = clients?.[id]
        setProvider(walletClient);

        if (!walletClient) throw new Error(`Client not found for ID: ${id}`)

        return walletClient
    }

    useEffect(() => {
        if (activeAccount) {
            getClient(activeAccount.providerId)
            // getAssets();
        }

    }, [activeAccount])

    const disconnect = async (id: PROVIDER_ID) => {
        try {
            const walletClient = getClient(id)

            const activeProvider = providers?.filter((provider) => {
                if (provider.metadata.id === walletClient.metadata.id) {
                    return provider
                }
            })

            if (activeProvider?.length > 0) {
                await activeProvider[0].disconnect();
            }


        } catch (e) {
            console.error(e)
        }
    }


    const getAssets = async () => {
        if (!activeAccount) throw new Error('No selected account.')

        const walletClient = getClient(activeAccount.providerId)

        const asset = await walletClient?.getAssets(activeAccount.address);

        const TokensObject = Object.keys(TokenObject);

        const AssetsOfUser = asset.map((asset) => {
            const assetId = asset['asset-id'];

            TokenObject[assetId]['amount'] = asset.amount;

            if (TokensObject.includes(assetId.toString())) {
                return TokenObject[assetId];
            }


        })
        return await walletClient?.getAssets(activeAccount.address)
    }


    return (
        <div className='ui-m-[20px]'>
            {provider && activeAccount && (
                <>

                    <div onClick={getAssets}>Get Assets</div>

                    <div className='ui-flex ui-gap-12 ui-items-center'>
                        <img className='ui-rounded-lg' src={provider.metadata.icon} alt='Image' width={80} height={80} />

                        <div className='ui-flex ui-items-center ui-gap-4'>
                            <div className='ui-text-[24px]'>{provider.metadata.name}</div>
                            <div className='ui-flex ui-m-[10px] ui-ml-[0px]'>
                                <div className='ui-px-[14px] ui-py-[7px] ui-text-[14px] ui-bg-red-400 ui-rounded-md'>{provider.network}</div>
                            </div>
                        </div>


                    </div>

                    <div className='ui-my-[20px] '>
                        <div className='ui-flex ui-items-center ui-justify-between'>
                            <div className='ui-text-[18px] '>Wallet Address</div>
                            <div className='ui-text-[16px]ui-text-gray-400'>
                                {activeAccount.address.substring(0, 8)}{"..."}{activeAccount.address.substring(activeAccount.address.length - 8)}
                            </div>
                        </div>
                    </div>


                    {activeAccount && <div className=' ui-flex ui-items-center ui-justify-center'>
                        <button className='ui-border-[#03a39f] ui-border ui-bg-[#005654] ui-rounded-md hover:ui-bg-[#03a39f] ui-px-[18px] ui-py-[7px]' onClick={() => {
                            disconnect(activeAccount.providerId);
                        }}>Disconnect</button>
                    </div>}
                </>
            )}



        </div>
    );
};

export default ProfileSettings;
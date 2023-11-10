import { PROVIDER_ID, WalletClient, useWallet } from "@txnlab/use-wallet";
import { createContext, useState } from "react";
import { TokenObject } from "../constants/TokenList";

export const GlobalContext = createContext({});

const GlobalContextProvider = ({ children }: any) => {

    const [userAssets, setUserAssets] = useState();
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


    const getClient = (id?: PROVIDER_ID): WalletClient => {
        if (!id) throw new Error('Provider ID is missing.')

        const walletClient = clients?.[id]
        console.log("Wallet Client", walletClient, connectedAccounts, activeAccount, connectedActiveAccounts);

        if (!walletClient) throw new Error(`Client not found for ID: ${id}`)

        return walletClient
    }
    const getAccountInfo = async () => {
        if (!activeAccount) throw new Error('No selected account.')

        const walletClient = getClient(activeAccount.providerId)

        const accountInfo = await walletClient?.getAccountInfo(activeAccount.address)

        console.log("Account info", accountInfo, walletClient);

        return accountInfo
    }

    const fetchPricesOfAssets = async () => {
        let asset: any;
        for (asset in TokenObject) {
            console.log("Asset", asset);
            // const assetId = asset?.mainnetAssetId;
            const assetId = TokenObject[asset].mainnetAssetId;
            if (assetId) {
                const prices = await fetchPrices(assetId);
                console.log("Prices", prices) // Call the API and get the prices for the corresponding assetId
                if (prices) {
                    TokenObject[asset].price = prices; // Add the fetched price to the object
                } else {
                    console.log(`Failed to fetch prices for assetId ${assetId}.`);
                }
            }
        }

        return TokenObject;
    }

    const getAssets = async () => {
        if (!activeAccount) throw new Error('No selected account.')

        const walletClient = getClient(activeAccount.providerId)

        const accountInfo = await getAccountInfo();

        const asset = await walletClient?.getAssets(activeAccount.address);
        console.log("walletClient info", asset, accountInfo);

        let algoAsset;
        if (accountInfo) {
            algoAsset = {
                amount: accountInfo?.amount,
                'asset-id': 0,
                'is-frozen': false
            };
        }

        const totalAssets = [algoAsset, ...asset];

        const FinalTokenObject = await fetchPricesOfAssets();
        console.log("FinalTokenObject", FinalTokenObject);

        const TokensObject = Object.keys(FinalTokenObject);

        let AssetsOfUser;
        if (totalAssets) {
            AssetsOfUser = totalAssets.map((asset) => {
                if (asset) {
                    const assetId = asset['asset-id'];
                    console.log("Assetid", assetId);

                    FinalTokenObject[assetId]['amount'] = asset.amount;

                    if (TokensObject.includes(assetId.toString())) {
                        return FinalTokenObject[assetId];
                    }
                } else {
                    console.log("Failed to add amount");
                }

            })
        }
        console.log("AssetsOfUser in context", AssetsOfUser, TokenObject)
        return AssetsOfUser
    }

    async function fetchPrices(assetId: number) {
        try {
            const response = await fetch(`https://free-api.vestige.fi/asset/${assetId}/price`); // Replace this with your actual API endpoint
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching prices:', error);
            return null;
        }
    }



    return (
        <GlobalContext.Provider value={{
            userAssets,
            setUserAssets,
            getClient,
            getAssets,
            fetchPrices
        }}>
            {children}
        </GlobalContext.Provider>
    )


}

export default GlobalContextProvider
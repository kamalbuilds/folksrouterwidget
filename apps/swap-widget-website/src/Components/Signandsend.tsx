"use client";
import { PeraWalletConnect } from "@perawallet/connect";
import { useEffect, useState } from "react";

const peraWallet = new PeraWalletConnect();

export default function Signandsend() {
  const [accountAddress, setAccountAddress] = useState("");
  const isConnectedToPeraWallet = !!accountAddress;
  const optInTxn = [
    "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"
  ]
  const singleTxnGroups = [{txn: optInTxn, signers: ["IIPJP56EY3AR2Z46V3GOFDQLAY42UQVSPKYVD46N75DVRSFB7FT6244NZU"]}];

  async function lfg(){
    try {
        // @ts-ignore
        const signedTxn = await peraWallet.signTransaction([singleTxnGroups]);
        console.log(signedTxn,"signed txn");
      } catch (error) {
        console.log("Couldn't sign Opt-in txns", error);
      }
  }
  useEffect(() => {
    // Reconnect to the session when the component is mounted
    if (typeof window !== 'undefined') {
        // Client-side logic here
        peraWallet
        .reconnectSession()
        .then((accounts) => {
          peraWallet.connector.on("disconnect", handleDisconnectWalletClick);
  
          if (accounts.length) {
            setAccountAddress(accounts[0]);
          }
        })
        .catch((e) => console.log(e));
      }
  }, []);

  return (
    <>
    <button
      onClick={
        isConnectedToPeraWallet
          ? handleDisconnectWalletClick
          : handleConnectWalletClick
      }
      className="text-blue-400"
    >
      {isConnectedToPeraWallet ? "Disconnect" : "Connect to Pera Wallet"}
    </button>
    <button
    onClick={lfg}> Swap</button>
    </>
  );

  function handleConnectWalletClick() {
    peraWallet
      .connect()
      .then((newAccounts) => {
        peraWallet.connector.on("disconnect", handleDisconnectWalletClick);

        setAccountAddress(newAccounts[0]);
      })
      .catch((error) => {
        if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
          console.log(error);
        }
      });
  }

  function handleDisconnectWalletClick() {
    peraWallet.disconnect();

    setAccountAddress("");
  }
}

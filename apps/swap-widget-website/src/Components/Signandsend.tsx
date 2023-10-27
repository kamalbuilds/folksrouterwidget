"use client";
import { PeraWalletConnect } from "@perawallet/connect";
import { useEffect, useState } from "react";
import { decodeUnsignedTransaction } from "algosdk";
import { MainnetAlgodClient , sender , TestnetAlgodClient} from '../utils/config';

const peraWallet = new PeraWalletConnect();

export default function Signandsend() {
  const [accountAddress, setAccountAddress] = useState("");
  console.log(accountAddress)
  const isConnectedToPeraWallet = !!accountAddress;
  // encoded txn returned from api
  const optInTxn = [
    "iqNhbXTOAHX1b6NmZWXNA+iiZnbOAgggoaNnZW6sdGVzdG5ldC12MS4womdoxCBIY7UYpLPITsgQ8i1PEIHLD3HwWaesIN7GL39w5Qk6IqNncnDEIGK+0ImoJETwvq9PHCZZA7X7NTP5eDyuiIK23RjPmBUtomx2zgIIJImjcmN2xCAqwST03PAq66gItM+bhmBgqIKWeldEAmbcMmVybADfRqNzbmTEIEIel/fExsEdZ56uzOKOCwY5qkKyerFR883/R1jIoflnpHR5cGWjcGF5",
    "jaRhcGFhlsQE8GcUyMQIAAAAAAAAAAHECAAAAAAAAAAAxAgAAAAAAAAnEMQIAAAAAAAAAADEowABAAAAAAAAAAEAAAAAAAAAAAAAAAAABARhFgAAAAAT7yP5kNF8XoAuS7VYiSV8/xIP3L+InyY1+ft6gsNmvBKadlsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACkYXBhc5IAzgQEYRakYXBmYZHOE+8j+aRhcGlkzhmqO2WjZmVlzSr4omZ2zgIIIKGjZ2VurHRlc3RuZXQtdjEuMKJnaMQgSGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiKjZ3JwxCBivtCJqCRE8L6vTxwmWQO1+zUz+Xg8roiCtt0Yz5gVLaJsds4CCCSJpG5vdGXFAXF7Im5vdGUiOnsiMCI6MC4xMDAwNSwiNjczOTU4NjIiOjAuNzYzOTUyMTMzODY1MTA0MiwibW9kZSI6IkZJWEVEX09VVFBVVCIsImlucHV0QXNzZXRJZCI6MCwib3V0cHV0QXNzZXRJZCI6NjczOTU4NjIsImFtb3VudCI6IjEwMDAwMDAiLCJxdW90ZUFtb3VudCI6Ijc3Mjk3NzEiLCJwcmljZUltcGFjdCI6MC4wMTIzMTk0Mjk4MDE1NTA0NDcsInBhdGhzIjpbeyJwZXJjZW50QnBzIjoiMTAwMDAiLCJzd2FwcyI6WzMzNDQzOTQxN119XSwiZmVlQnBzIjoiMTAiLCJvdXRwdXRBbW91bnRGZWUiOiIxMDAxIiwic2xpcHBhZ2VCcHMiOiIxIn0sIm5vbmNlIjoiNDY5ZmMwYjdlNTdkZGI0NTE3YjYwYzViN2FjMGU1NzQiLCJjaGVja3N1bSI6ImNiYjU0NmJmIn2jc25kxCBCHpf3xMbBHWeerszijgsGOapCsnqxUfPN/0dYyKH5Z6R0eXBlpGFwcGw=",
    "i6RhcGFhlsQE6cgNPcQIAAAAAAQEYRbECAAAAAAAD0JAxAgAAAAAAAAACsQgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADEowABAAAAAAAAAAEAAAAAAAQEYRYAAAAAAAAAAAAAAAAT7yP5kNF8XoAuS7VYiSV8/xIP3L+InyY1+ft6gsNmvBKadlsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACkYXBhc5HOBARhFqRhcGF0kcQgj97vIQa0eptlq/DIxzezkbVbs27vLAOh1MI0oLPgZcWkYXBpZM4ZqjtlomZ2zgIIIKGjZ2VurHRlc3RuZXQtdjEuMKJnaMQgSGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiKjZ3JwxCBivtCJqCRE8L6vTxwmWQO1+zUz+Xg8roiCtt0Yz5gVLaJsds4CCCSJo3NuZMQgQh6X98TGwR1nnq7M4o4LBjmqQrJ6sVHzzf9HWMih+WekdHlwZaRhcHBs"
  ]
  // const singleTxnGroups = [{txn: optInTxn, signers: ["IIPJP56EY3AR2Z46V3GOFDQLAY42UQVSPKYVD46N75DVRSFB7FT6244NZU"]}];
  
  const algod = TestnetAlgodClient;
  async function SignusingPerraWallet(){
    try {
        // @ts-ignore
        const unsignedTxns = optInTxn.map(txn => decodeUnsignedTransaction(Buffer.from(txn, "base64")));
        console.log(unsignedTxns,"unsigned");
        const multipleTxnGroups = [
          {txn: unsignedTxns[0], signers: [accountAddress]},
          {txn: unsignedTxns[1], signers: [accountAddress]},
          {txn: unsignedTxns[2], signers: [accountAddress]}
        ];
        const signedTxns = await peraWallet.signTransaction([multipleTxnGroups], accountAddress);
        // const signedTxns = unsignedTxns.map(txn => txn.signTxn(user.sk));
        console.log("signed txn",signedTxns);
        // submit
        const sendraw = await algod.sendRawTransaction(signedTxns).do();
        console.log(sendraw,"signed txn");
      } catch (error) {
        console.log("Couldn't sign Opt-in txns", error);
      }
  };

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
    <button onClick={SignusingPerraWallet} className="text-green-400 mx-4">
      Swap
    </button>
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

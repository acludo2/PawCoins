import React, { useEffect, useState } from "react"
import { useBalance, useWallet } from "@connect2ic/react"
import { useCanister } from "@connect2ic/react"
import { Upload } from "./Upload"
import DragList  from "./DragList"


const Profile = () => {

  const [wallet] = useWallet()
  const [assets] = useBalance()
  const [delivery] = useCanister("delivery")
  const [session, setSession] = useState()
  const createSession = async () => {
    console.log("wallet",wallet)
  let session =!!wallet && await delivery.createSession(wallet.principal)
  console.log("session",session)
  }

  useEffect(()=>{
    if(!session){
      createSession()
    }
  },[wallet])

  return (
    <div className="example">
      {wallet ? (
        <>
          <p>Wallet address: <span style={{ fontSize: "0.7em" }}>{wallet ? wallet.principal : "-"}</span></p>
          <table>
            <tbody>
            {assets && assets.map(asset => (
              <tr key={asset.canisterId}>
                <td>
                  {asset.name}
                </td>
                <td>
                  {asset.amount}
                </td>
              </tr>
            ))}
            </tbody>
          </table>
          <Upload/>
        </>
      ) : (
        <p className="example-disabled">Connect with a wallet to access this example</p>
      )}
    </div>
  )
}

export { Profile }

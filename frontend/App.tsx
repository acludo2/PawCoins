import React from "react"
import logo from "./assets/dfinity.svg"
/*
 * Connect2ic provides essential utilities for IC app development
 */
import { createClient } from "@connect2ic/core"
import { defaultProviders } from "@connect2ic/core/providers"
import { ConnectButton, ConnectDialog, Connect2ICProvider } from "@connect2ic/react"
import "@connect2ic/core/style.css"
/*
 * Import canister definitions like this:
 */
import * as delivery from "../.dfx/local/canisters/delivery"
/*
 * Some examples to get you started
 */
import { Profiles } from "./components/Profiles"
import { Profile } from "./components/Profile"
import { useEffect } from "react"
function App() {
    useEffect(()=>{
      console.log("delivery",delivery)
    },[delivery])
  return (
    <div className="App">
      <div className="auth-section">
        <ConnectButton />
      </div>
      <ConnectDialog />
      {
        delivery &&  <div className="examples">
        <Profile/>
      </div>
      }

    </div>
  )
}
console.log("delivery to client",delivery)
const client = createClient({
  canisters: {
    delivery,
  },
  providers: defaultProviders,
  globalProviderConfig: {
    dev: import.meta.env.DEV,
  },
})

export default () => (
  <Connect2ICProvider client={client}>
    <App />
  </Connect2ICProvider>
)

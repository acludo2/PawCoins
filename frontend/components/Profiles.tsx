import { useCanister } from "@connect2ic/react"
import React, { useEffect, useState } from "react"

const Profiles = () => {
  /*
  * This how you use canisters throughout your app.
  */
  const [delivery] = useCanister("delivery")
  const [profiles, setProfiles] = useState(null)

  const refreshProfiles = async () => {
    const profiles = await delivery.getProfiles();
    console.log("profiles",profiles)
    setProfiles(profiles[0])
  }



  useEffect(() => {
    if (!profiles) {
      refreshProfiles()
    }
  }, [profiles])

  return (
    <div className="example">
      {!!profiles && profiles.map((profile)=>{
        return (<div key={`profiles-${profile.userName}`}>
            <h1>{profile.userName}</h1>
        </div>)
      })}
    </div>
  )
}

export { Profiles }
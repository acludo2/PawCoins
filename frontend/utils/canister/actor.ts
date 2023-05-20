import { Actor, HttpAgent, Identity } from "@dfinity/agent";


const DFX_NETWORK = process.env.DFX_NETWORK || "local";
const isLocalEnv = DFX_NETWORK === "local";


import {
  idlFactory,
  canisterId
} from '../../../src/declarations/pawcoins';
// change the pathing from local to ic when deploying

import dfxConfig from "../../../dfx.json";


function getHost() {
  // Setting host to undefined will default to the window location 👍🏻
  return isLocalEnv ? dfxConfig.networks.local.bind : undefined;
}
  let canisterCheck = isLocalEnv ?  "be2us-64aaa-aaaaa-qaabq-cai" : "sqehz-oaaaa-aaaap-qbgcq-cai"
type T = any;
///to deploy use the canisterid "sqehz-oaaaa-aaaap-qbgcq-cai" and the host down here also change th p
//const host = "https://icp-api.io/"
const host =   isLocalEnv? getHost():"https://icp-api.io/";

function createActor(identity?: Identity) {
  console.log("the host is",host)
  const agent = new HttpAgent({ host, identity });
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId: canisterCheck,
  });
  return { actor, agent };
}

/*
 * Responsible for keeping track of the actor, whether the user has logged
 * in again or not. A logged in user uses a different actor with their
 * Identity, to ensure their Principal is passed to the backend.
 */
class ActorController {
  _actor: Promise<T>;
  _isAuthenticated: boolean = false;

  constructor() {
    this._actor = this.initBaseActor();
  }

  async initBaseActor(identity?: Identity) {
    const { agent, actor } = createActor(identity);
    // The root key only has to be fetched for local development environments
    await agent.fetchRootKey();

    return actor;
  }

  /*
   * Get the actor instance to run commands on the canister.
   */
  get actor() {
    return this._actor;
  }

  /*
   * Once a user has authenticated and has an identity pass this identity
   * to create a new actor with it, so they pass their Principal to the backend.
   */
  async authenticateActor(identity: Identity) {
    this._actor = this.initBaseActor(identity);
    this._isAuthenticated = true;
  }

  /*
   * If a user unauthenticates, recreate the actor without an identity.
   */
  unauthenticateActor() {
    this._actor = this.initBaseActor();
    this._isAuthenticated = false;
  }
}

export const actorController = new ActorController();

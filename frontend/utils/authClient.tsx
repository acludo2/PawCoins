import { Identity } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';

// Where the IDP should be servied from
//use  'https://identity.ic0.app' when deploying!!
// new URLSearchParams(document.location.search).get('internetIdentityUrl') ||
//process.env.REACT_APP_INTERNET_IDENTITY_URL ||
const IDENTITY_URL = "http://127.0.0.1:8000/?canisterId=bd3sg-teaaa-aaaaa-qaaba-cai";

/*
 * A simple wrapper for the official auth client to initialize it and wrap
 * some of the methods in promises
 */
class AuthClientWrapper {
  public authClient?: AuthClient;
  public ready = false;
  constructor() {
    return this;
  }

  // Create a new auth client and update it's ready state
  async create() {
    this.authClient = await AuthClient.create();
    await this.authClient?.isAuthenticated();
    this.ready = true;
  }

  async login(): Promise<Identity | undefined> {
    return new Promise(async (resolve) => {
      await this.authClient?.login({
        identityProvider: IDENTITY_URL,
        onSuccess: async () => {
          resolve(this.authClient?.getIdentity());
        },
      });
    });
  }

  async logout() {
    return this.authClient?.logout({ returnTo: '/' });
  }

  async getIdentity() {
    return this.authClient?.getIdentity();
  }

  async isAuthenticated() {
    return this.authClient?.isAuthenticated();
  }
}

export const authClient = new AuthClientWrapper();

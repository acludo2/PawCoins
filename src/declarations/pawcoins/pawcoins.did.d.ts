import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Account {
  'owner' : Principal,
  'subaccount' : [] | [Subaccount],
}
export interface CommentResponse {
  'id' : bigint,
  'commenter' : Principal,
  'text' : string,
  'timestamp' : bigint,
  'proposalId' : bigint,
}
export type Content = { 'Text' : string } |
  { 'Image' : Uint8Array | number[] } |
  { 'Video' : bigint };
export type PrincipalArray = Array<Principal>;
export interface Profile {
  'lastProposal' : [] | [Time],
  'proposalsCompleted' : bigint,
  'name' : string,
  'badget' : boolean,
  'profilePic' : [] | [Uint8Array | number[]],
}
export interface Proposal {
  'id' : bigint,
  'icp' : bigint,
  'content' : Content,
  'owner' : Principal,
  'completed' : boolean,
  'description' : string,
  'icpWallet' : Principal,
}
export interface ProposalCall {
  'icp' : bigint,
  'content' : Content,
  'description' : string,
}
export interface ProposalProfile {
  'name' : string,
  'profilePic' : [] | [Uint8Array | number[]],
}
export interface ProposalResponse {
  'id' : bigint,
  'icp' : bigint,
  'completed' : boolean,
  'description' : string,
  'icpWallet' : Principal,
}
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : { 'e8s' : bigint } } |
  { 'err' : string };
export type Result_2 = { 'ok' : Proposal } |
  { 'err' : string };
export type Result_3 = { 'ok' : Array<CommentResponse> } |
  { 'err' : string };
export type Result_4 = { 'ok' : string } |
  { 'err' : string };
export type Result_5 = { 'ok' : bigint } |
  { 'err' : string };
export type Result_6 = { 'ok' : CommentResponse } |
  { 'err' : string };
export type Subaccount = Uint8Array | number[];
export type Time = bigint;
export interface UpdateProfile {
  'name' : string,
  'profilePic' : Uint8Array | number[],
}
export interface _SERVICE {
  'addNewComment' : ActorMethod<[string, bigint], Result_6>,
  'addNewProposal' : ActorMethod<[ProposalCall], Result_5>,
  'addPawCoins' : ActorMethod<[], undefined>,
  'addProposalChunk' : ActorMethod<[bigint, Uint8Array | number[]], Result>,
  'addProposalVideoChunk' : ActorMethod<
    [bigint, Uint8Array | number[], bigint],
    Result_5
  >,
  'airDrop' : ActorMethod<[], Result>,
  'airDrop2' : ActorMethod<[], Result>,
  'balanceOf' : ActorMethod<[Account], bigint>,
  'bannProposal' : ActorMethod<[bigint], Result_4>,
  'caller' : ActorMethod<[], string>,
  'donateToProposal' : ActorMethod<[bigint, bigint], Result>,
  'getAllProposals' : ActorMethod<[], Array<ProposalResponse>>,
  'getAllStudentsPrincipalTest' : ActorMethod<[], Array<Principal>>,
  'getCommentProfile' : ActorMethod<[string], Profile>,
  'getComments' : ActorMethod<[bigint], Result_3>,
  'getContent' : ActorMethod<[bigint], Content>,
  'getPawCoins' : ActorMethod<[], bigint>,
  'getProfile' : ActorMethod<[], Profile>,
  'getProposal' : ActorMethod<[bigint], Result_2>,
  'getProposalProfilePic' : ActorMethod<[bigint], [] | [ProposalProfile]>,
  'getStudents' : ActorMethod<[], PrincipalArray>,
  'getVideoChunk' : ActorMethod<[bigint, bigint], Uint8Array | number[]>,
  'name' : ActorMethod<[], string>,
  'parseControllersFromCanisterStatusErrorIfCallerNotController' : ActorMethod<
    [string],
    Array<Principal>
  >,
  'pawBalance' : ActorMethod<[], Result_1>,
  'session' : ActorMethod<[], Profile>,
  'symbol' : ActorMethod<[], string>,
  'toNat8' : ActorMethod<[Content], Uint8Array | number[]>,
  'totalSupply' : ActorMethod<[], bigint>,
  'transFer' : ActorMethod<[Principal], Result>,
  'transFerDonation' : ActorMethod<[Principal, Principal, bigint], Result>,
  'transfer' : ActorMethod<[Account, Account, bigint], Result>,
  'updateProfile' : ActorMethod<[UpdateProfile], Profile>,
  'verifyOwnership' : ActorMethod<[Principal, Principal], boolean>,
}

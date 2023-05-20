export const idlFactory = ({ IDL }) => {
  const CommentResponse = IDL.Record({
    'id' : IDL.Nat,
    'commenter' : IDL.Principal,
    'text' : IDL.Text,
    'timestamp' : IDL.Int,
    'proposalId' : IDL.Nat,
  });
  const Result_6 = IDL.Variant({ 'ok' : CommentResponse, 'err' : IDL.Text });
  const Content = IDL.Variant({
    'Text' : IDL.Text,
    'Image' : IDL.Vec(IDL.Nat8),
    'Video' : IDL.Nat,
  });
  const ProposalCall = IDL.Record({
    'icp' : IDL.Nat,
    'content' : Content,
    'description' : IDL.Text,
  });
  const Result_5 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Subaccount = IDL.Vec(IDL.Nat8);
  const Account = IDL.Record({
    'owner' : IDL.Principal,
    'subaccount' : IDL.Opt(Subaccount),
  });
  const Result_4 = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const ProposalResponse = IDL.Record({
    'id' : IDL.Nat,
    'icp' : IDL.Nat,
    'completed' : IDL.Bool,
    'description' : IDL.Text,
    'icpWallet' : IDL.Principal,
  });
  const Time = IDL.Int;
  const Profile = IDL.Record({
    'lastProposal' : IDL.Opt(Time),
    'proposalsCompleted' : IDL.Nat,
    'name' : IDL.Text,
    'badget' : IDL.Bool,
    'profilePic' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const Result_3 = IDL.Variant({
    'ok' : IDL.Vec(CommentResponse),
    'err' : IDL.Text,
  });
  const Proposal = IDL.Record({
    'id' : IDL.Nat,
    'icp' : IDL.Nat,
    'content' : Content,
    'owner' : IDL.Principal,
    'completed' : IDL.Bool,
    'description' : IDL.Text,
    'icpWallet' : IDL.Principal,
  });
  const Result_2 = IDL.Variant({ 'ok' : Proposal, 'err' : IDL.Text });
  const ProposalProfile = IDL.Record({
    'name' : IDL.Text,
    'profilePic' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const PrincipalArray = IDL.Vec(IDL.Principal);
  const Result_1 = IDL.Variant({
    'ok' : IDL.Record({ 'e8s' : IDL.Nat64 }),
    'err' : IDL.Text,
  });
  const UpdateProfile = IDL.Record({
    'name' : IDL.Text,
    'profilePic' : IDL.Vec(IDL.Nat8),
  });
  return IDL.Service({
    'addNewComment' : IDL.Func([IDL.Text, IDL.Nat], [Result_6], []),
    'addNewProposal' : IDL.Func([ProposalCall], [Result_5], []),
    'addProposalChunk' : IDL.Func([IDL.Nat, IDL.Vec(IDL.Nat8)], [Result], []),
    'addProposalVideoChunk' : IDL.Func(
        [IDL.Nat, IDL.Vec(IDL.Nat8), IDL.Nat],
        [Result_5],
        [],
      ),
    'airDrop' : IDL.Func([], [Result], []),
    'airDrop2' : IDL.Func([], [Result], []),
    'balanceOf' : IDL.Func([Account], [IDL.Nat], ['query']),
    'bannProposal' : IDL.Func([IDL.Nat], [Result_4], []),
    'caller' : IDL.Func([], [IDL.Text], ['query']),
    'donateToProposal' : IDL.Func([IDL.Nat, IDL.Nat], [Result], []),
    'getAllProposals' : IDL.Func([], [IDL.Vec(ProposalResponse)], ['query']),
    'getAllStudentsPrincipalTest' : IDL.Func([], [IDL.Vec(IDL.Principal)], []),
    'getCommentProfile' : IDL.Func([IDL.Text], [Profile], ['query']),
    'getComments' : IDL.Func([IDL.Nat], [Result_3], ['query']),
    'getContent' : IDL.Func([IDL.Nat], [Content], ['query']),
    'getPawCoins' : IDL.Func([], [IDL.Nat], ['query']),
    'getProfile' : IDL.Func([], [Profile], ['query']),
    'getProposal' : IDL.Func([IDL.Nat], [Result_2], ['query']),
    'getProposalProfilePic' : IDL.Func(
        [IDL.Nat],
        [IDL.Opt(ProposalProfile)],
        ['query'],
      ),
    'getStudents' : IDL.Func([], [PrincipalArray], []),
    'getVideoChunk' : IDL.Func(
        [IDL.Nat, IDL.Nat],
        [IDL.Vec(IDL.Nat8)],
        ['query'],
      ),
    'name' : IDL.Func([], [IDL.Text], ['query']),
    'parseControllersFromCanisterStatusErrorIfCallerNotController' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(IDL.Principal)],
        [],
      ),
    'pawBalance' : IDL.Func([], [Result_1], []),
    'session' : IDL.Func([], [Profile], ['query']),
    'symbol' : IDL.Func([], [IDL.Text], ['query']),
    'toNat8' : IDL.Func([Content], [IDL.Vec(IDL.Nat8)], []),
    'totalSupply' : IDL.Func([], [IDL.Nat], ['query']),
    'transFer' : IDL.Func([IDL.Principal], [Result], []),
    'transFerDonation' : IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Nat],
        [Result],
        [],
      ),
    'transfer' : IDL.Func([Account, Account, IDL.Nat], [Result], []),
    'updateProfile' : IDL.Func([UpdateProfile], [Profile], []),
    'verifyOwnership' : IDL.Func(
        [IDL.Principal, IDL.Principal],
        [IDL.Bool],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };

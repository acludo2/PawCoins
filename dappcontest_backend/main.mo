import AccountTransfer "./ic";
import Account "./account";
import Text "mo:base/Text";
import Hash "mo:base/Hash";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import TrieMap "mo:base/TrieMap";
import Result "mo:base/Result";
import Buffer "mo:base/Buffer";
import Blob "mo:base/Blob";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Prelude "mo:base/Prelude";
import Nat8 "mo:base/Nat8";
import NNS "nns";
import Nat64 "mo:base/Nat64";
import Int "mo:base/Int";
import Error "mo:base/Error";
import ManagementCanister "ica";
import Iter "mo:base/Iter";






actor pawcoins {
    type ManagementCanister = ManagementCanister.ManagementCanister;
    type NNS =  NNS.NNS;
    type Time = Int;
    type Account = Account.Account;


    type Video = TrieMap.TrieMap<Text,[Nat8]>;

    let coinName:Text = "pawcoins";
    let coinSymbol:Text = "MOC";
    var coinSupply:Nat = 0;

    public type Subaccount = Blob;
    private var canisterId = "rww3b-zqaaa-aaaam-abioa-cai";
    public type PrincipalArray = [Principal];

     public type Content = {
        #Text:Text;
        #Image:Blob;
        #Video:Nat;
    };


public type Comment = {
    id: Nat;
    proposalId: Nat;
    text: Text;
    commenter: Principal;
    timestamp: Int;
};

public type CommentCall = {
    proposalId: Nat;
    text: Text;
};

public type CommentResponse = {
    id: Nat;
    proposalId: Nat;
    text: Text;
    commenter: Principal;
    timestamp: Int;
};


  public type ProposalProfile = {
    profilePic:?Blob;
    name:Text;
  };

    public type Proof = {
      description:Text;
      content:Content;
    };

    public type ProofMap = TrieMap.TrieMap<Text,Proof>;

    public type Proposal = {
        id:Nat;
        icp:Nat;
        description:Text;
        content:Content;
        icpWallet:Principal;
        completed:Bool;
        owner:Principal;
    };


    public type ProposalResponse = {
       id:Nat;
        icp:Nat;
        description:Text;
        icpWallet:Principal;
        completed:Bool;
    };

    public type ProposalCall = {
          icp:Nat;
          description:Text;
          content:Content;
    };

    public type UpdateProfile = {
      name:Text;
      profilePic:Blob
    };

  public type Profile = {
    name:Text;
    badget:Bool;
    proposalsCompleted:Nat;
    lastProposal:?Time;
     profilePic:?Blob;
  };


  let guestProfile:Profile={
    name="pawy";
    badget=false;
    proposalsCompleted=0;
    lastProposal=null;
    profilePic=null;
  };

  type Comments = TrieMap.TrieMap<Text,Comment>;

    var comments = TrieMap.TrieMap<Text,Comment>(Text.equal,Text.hash);

    var ledger = TrieMap.TrieMap<Account.Account,Nat>(Account.accountsEqual,Account.accountsHash);

    var profiles = TrieMap.TrieMap<Account.Account,Profile>(Account.accountsEqual,Account.accountsHash);

    var proposals = TrieMap.TrieMap<Text,Proposal>(Text.equal,Text.hash);

    var commentsLedger = TrieMap.TrieMap<Text,Comments>(Text.equal,Text.hash);



     var videos = TrieMap.TrieMap<Text,[Nat8]>(Text.equal,Text.hash);


      public shared(msg) func pawBalance(): async Result.Result<({e8s : Nat64}),Text> {
                  let ledger = actor("ryjl3-tyaaa-aaaaa-aaaba-cai"): NNS;
                let toAccount = Blob.toArray(AccountTransfer.accountIdentifier(msg.caller, AccountTransfer.defaultSubaccount()));
                  let result  = await ledger.account_balance({ account = toAccount });
                  return #ok(result);
      };


  public shared(msg) func transFerDonation(fromAccount:Principal,toAccoun:Principal,ammount:Nat):async Result.Result<(),Text>{
              let ledger = actor("ryjl3-tyaaa-aaaaa-aaaba-cai"): NNS;
                let toAccountP = Blob.toArray(AccountTransfer.accountIdentifier(toAccoun, AccountTransfer.defaultSubaccount()));
                let fromAccountP = Blob.toArray(AccountTransfer.accountIdentifier(fromAccount, AccountTransfer.defaultSubaccount()));

              let ammountNat:Nat64 =  Nat64.fromNat(ammount);
              let now = Time.now();
             let result = await ledger.transfer({
              memo = Nat64.fromNat(1);
              from_subaccount = ?fromAccountP;
              to = toAccountP;
              amount = { e8s = ammountNat };
              fee = { e8s = 10_000 };
              created_at_time = ?{ timestamp_nanos = Nat64.fromNat(Int.abs(now)) };
            });
              return #ok();
     };




     public shared(msg) func transFer(toAccoun:Principal):async Result.Result<(),Text>{

      try{
          let ledger = actor("ryjl3-tyaaa-aaaaa-aaaba-cai"): NNS;
                let toAccount = Blob.toArray(AccountTransfer.accountIdentifier(toAccoun, AccountTransfer.defaultSubaccount()));
              let now = Time.now();
             let result = await ledger.transfer({
              memo = Nat64.fromNat(1);
              from_subaccount = null;
              to = toAccount;
              amount = { e8s = 100_000_000 };
              fee = { e8s = 10_000 };
              created_at_time = ?{ timestamp_nanos = Nat64.fromNat(Int.abs(now)) };
            });

              return #ok();
      } catch(e){
          return#err(Error.message(e));
      }

     };




     public shared query(msg) func getProfile():async Profile{
      let account:Account ={
        owner=msg.caller;
        subaccount=null
      };
          switch(profiles.get(account)){
            case null{return guestProfile};
            case (?found){ return found};
          }
     };


     public shared query func getCommentProfile(principal:Text):async Profile{
      let account:Account ={
        owner=Principal.fromText(principal);
        subaccount=null
      };
          switch(profiles.get(account)){
            case null{return guestProfile};
            case (?found){ return found};
          }
     };


     public shared(msg)  func bannProposal(proposalId:Nat):async Result.Result<(Text),Text>{
                     let owner = await verifyOwnership(Principal.fromText("sqehz-oaaaa-aaaap-qbgcq-cai"),msg.caller);
                     if(owner==true){
                        switch(proposals.remove(Nat.toText(proposalId))){
                          case null { #err"that proposal doesnt exist"};
                          case (?found){
                            return#ok("removed!")
                          }
                        }
                     } else {
                      #err"";
                     }
     };

     public shared(msg) func updateProfile(profile:UpdateProfile):async Profile{
          let account:Account ={
        owner=msg.caller;
        subaccount=null
      };
          switch(profiles.get(account)){
            case null{
               let imgBlob:?Blob= ?profile.profilePic;
              let newProfile:Profile ={
                  name=profile.name;
                  profilePic=imgBlob;
                  badget=false;
                  proposalsCompleted=0;
                  lastProposal=guestProfile.lastProposal;
              };
              profiles.put(account,newProfile);
              _airDrop(account);
              return newProfile};
            case (?found){
              let imgBlob:?Blob= ?profile.profilePic;
              let newProfile:Profile ={
                  name=profile.name;
                  profilePic=imgBlob;
                  badget=found.badget;
                  proposalsCompleted=found.proposalsCompleted;
                  lastProposal=found.lastProposal;
              };
              profiles.put(account,newProfile);
              return newProfile;
            };
          }
     };



      public shared func verifyOwnership(canisterId:Principal,principalId:Principal):async Bool {
        let called = actor("aaaaa-aa"): ManagementCanister;
        try {
                let foo = await called.canister_status({canister_id=canisterId});
                return false;
            } catch (e) {
                    let canisterControllers = await parseControllersFromCanisterStatusErrorIfCallerNotController(Error.message(e));
                    let canisterControllersBuffer = Buffer.fromArray<Principal>(canisterControllers);
                    var returnBool:Bool = false;
                    Buffer.iterate(canisterControllersBuffer, func (x:Principal) {
                        if(x==principalId){
                            returnBool := true;
                        }
            });
                return returnBool;
            };
    };

        public func parseControllersFromCanisterStatusErrorIfCallerNotController(errorMessage : Text) : async [Principal] {
        let lines = Iter.toArray(Text.split(errorMessage, #text("\n")));
        let words = Iter.toArray(Text.split(lines[1], #text(" ")));
        var i = 2;
        let controllers = Buffer.Buffer<Principal>(0);
        while (i < words.size()) {
        controllers.add(Principal.fromText(words[i]));
        i += 1;
        };
        Buffer.toArray<Principal>(controllers);
  };


    public shared(msg) func addProposalVideoChunk(proposalId:Nat,chunk:[Nat8],chunkId:Nat):async Result.Result<Nat,Text>{
            /*switch(videos.get(Nat.toText(proposalId))){
              case null{
                chunkMaps.put(Nat.toText(chunkId),chunk);
                videos.put(Nat.toText(proposalId),chunkMaps);
              ?()
               };
              case (?found){
                  var chunkIndex = 1;
                      found.put(Nat.toText(chunkId),chunk);
                      ?()
                };
            };*/

            switch(proposals.get(Nat.toText(proposalId))){
              case null{return #err("fail")};
              case (?found){
                let newProposal:Proposal = {
                    id=found.id;
                    completed=found.completed;
                    content=#Video(chunkId+1);
                    description=found.description;
                    icpWallet=found.icpWallet;
                    icp=found.icp;
                    owner=msg.caller;
                };
                proposals.put(Nat.toText(proposalId),newProposal);
                let id = Nat.toText(proposalId);
                let chunkIdText = Nat.toText(chunkId);
                let videoId = id#chunkIdText;
                videos.put(videoId,chunk);
                return #ok(proposalId);
              }
            }

    };

    public shared query func getProposalProfilePic(proposalId:Nat):async ?ProposalProfile{
            switch(proposals.get(Nat.toText(proposalId))){
              case null {return null};
              case (?found) {
                let account:Account ={
                            owner=found.owner;
                            subaccount=null
                          };

                switch(profiles.get(account)){
                       case null {return null};
                       case (?foundOwner){
                          let profile:ProposalProfile = {
                            name=foundOwner.name;
                            profilePic=foundOwner.profilePic;
                          };
                            return ?profile;
                       }
                };
              }
            }
    };




    public shared query func getVideoChunk(proposalId:Nat,chunkId:Nat):async [Nat8]{
        let id = Nat.toText(proposalId);
            let chunkIdText = Nat.toText(chunkId);
            let videoId = id#chunkIdText;
            switch(videos.get(videoId)){
              case(null){return []};
              case (?found){return found}
            }
    };




    public shared(msg) func addProposalChunk(proposalId:Nat,chunks:Blob):async Result.Result<(),Text>{
        let result = await getProposal(proposalId);
        if(Result.isOk(result)){
            switch(Result.toOption(result)){
              case null{ return #err "not found" };
              case (?found){
                  let arrayFromProposal:[Nat8]= await toNat8(found.content);
                  let bufferFromProposal:Buffer.Buffer<Nat8> = Buffer.Buffer<Nat8>(0);
                    for(natInArray in arrayFromProposal.vals()){
                      bufferFromProposal.add(natInArray);
                    };
                    for(chunk in chunks.vals()){
                        bufferFromProposal.add(chunk);
                    };
                  let finalConentAsNat:[Nat8] = Buffer.toArray(bufferFromProposal);
                  let finalBlob:Content = #Image(Blob.fromArray(finalConentAsNat));
                    let proposalToUpdateWithChunks:Proposal = {
                        id=found.id;
                        icp=found.icp;
                        description=found.description;
                        content=finalBlob;
                        completed=found.completed;
                        icpWallet=found.icpWallet;
                        owner=msg.caller;
                    };
                    proposals.put(Nat.toText(proposalId),proposalToUpdateWithChunks);
                    return #ok();
                };
            };

        }else{
          return #err" not found";
        }
    };

public func toNat8(x : Content) : async [Nat8] {
  switch(x) {
        case (#Image content) { return Blob.toArray(content)};
        case (#Video content) {return [0]};
        case (#Text content){ return [0]}
    };
};



     private func setDonatorBadged(donator:Principal):async Result.Result<(),Text>{
          let account:Account ={
            owner=donator;
            subaccount=null
           };
          switch(profiles.get(account)){
            case null{
              let newProfile:Profile ={
                  name=guestProfile.name;
                  profilePic=null;
                  badget=true;
                  proposalsCompleted=0;
                  lastProposal=guestProfile.lastProposal;
              };
              profiles.put(account,newProfile);

              return #ok()};
            case (?found){
              let imgBlob:?Blob= found.profilePic;
              let setBadge:Profile ={
                  name=found.name;
                  profilePic=imgBlob;
                  badget=true;
                  proposalsCompleted=found.proposalsCompleted;
                  lastProposal=found.lastProposal;
              };
              profiles.put(account,setBadge);
              return #ok();
            };
          }
     };




    public shared(msg) func donateToProposal(proposalId:Nat,amount:Nat):async Result.Result<(),Text>{
      switch(proposals.get(Nat.toText(proposalId))){
          case null {#err "" };
          case (?found){
                  let result = await transFerDonation(msg.caller,found.icpWallet,amount);
                  if(Result.isOk(result)){
                     let badgeResult = setDonatorBadged(msg.caller);
                    return #ok();
                  };
        return #ok();
          }
      }
    };


    public shared query func getProposal(proposalId:Nat): async Result.Result<Proposal,Text>{
         switch (proposals.get(Nat.toText(proposalId))) {
      case null { return #err "not found"};
      case (?proposalFound) { return #ok(proposalFound)};
    };
    };


    public shared(msg) func addNewProposal(proposal:ProposalCall):async Result.Result<Nat,Text>{
    let defaultSub:Account.Subaccount = _defaultSub();
    let account:Account = {
                            owner=msg.caller;
                            subaccount=?defaultSub;
                        };
    let balance =  getBalance(account);
    if(balance>=100){
      let newid = proposals.size();
    let newProposal:Proposal ={
        id=newid;
        icp=proposal.icp;
        description=proposal.description;
        content=proposal.content;
        icpWallet=msg.caller;
        completed=false;
        owner=msg.caller;
    };
        switch(proposals.put(Nat.toText(newid),newProposal)){
          case (added) {
              ledger.put(account,balance-100);
            return #ok(newid)
            };
        }
    };
    return #err("no enought pawcoins");
    };

    public shared query func getContent(proposalId:Nat):async Content{
    switch (proposals.get(Nat.toText(proposalId))) {
      case null {return #Text("")};
      case (?proposalFound) { return proposalFound.content};
    };    };



    public shared query func getAllProposals():async [ProposalResponse]{
      let proposalBuffer:Buffer.Buffer<ProposalResponse> = Buffer.Buffer<ProposalResponse>(0);
      for(value in proposals.vals()){
        let proposalToResponse:ProposalResponse = {
          id=value.id;
          icp=value.icp;
          description=value.description;
          icpWallet=value.icpWallet;
          completed=value.completed;
        };
        proposalBuffer.add(proposalToResponse);
      };
      return Buffer.toArray(proposalBuffer);
    };


    public shared query func name(): async Text{
        return coinName;
    };

    public shared query(msg) func caller(): async Text{
        return Principal.toText(msg.caller);
    };


    public shared query func symbol(): async Text{
        return coinSymbol;
    };

    public shared query func totalSupply(): async Nat{
      var coinSupply:Nat = 0;
      for(coins in ledger.vals()){
          coinSupply += coins;
      };
        return coinSupply;
    };

    private func getBalance(account:Account.Account):Nat{
     switch (ledger.get(account)) {
      case null { return 0 };
      case (?coins) { return coins};
    };
    };

    public shared query func balanceOf(account:Account.Account): async (Nat) {
      return getBalance(account);
    };

    public shared query(msg) func getPawCoins():async Nat{
        let account:Account = {
                            owner=msg.caller;
                            subaccount=null;
                        };
        switch (ledger.get(account)) {
      case null { return 0 };
      case (?coins) { return coins};
    };
    };

    private func _transfer(from:Account.Account,to:Account.Account,amount:Nat){
        var fromCoins = getBalance(from);
        fromCoins:= fromCoins-amount;
        ledger.put(from,fromCoins);
        var toCoins = getBalance(to);
        toCoins:= toCoins+amount;
        ledger.put(to,toCoins);
    };

    public shared query(msg) func session():async Profile{
    let defaultSub:Account.Subaccount = _defaultSub();
    let account:Account = {
                            owner=msg.caller;
                            subaccount=?defaultSub;
                        };
         switch(profiles.get(account)){
        case null {return guestProfile};
        case (?found){return found};
       }
    };


    private func _airDrop(to:Account.Account){
            var toCoinsAirdrop = 100;
           ledger.put(to, toCoinsAirdrop);
    };

    private func _defaultSub():Subaccount{
        return Blob.fromArrayMut(Array.init(32, 0 : Nat8));
    };


     public func getStudents():async PrincipalArray {
        let canister2 = actor(canisterId): actor { getAllStudentsPrincipal : shared () -> async [Principal];};
        var students = await canister2.getAllStudentsPrincipal();
        return students;
    };

    public shared func airDrop(): async Result.Result<(),Text>{
            var studentsCanister:PrincipalArray =  await getStudents();
              let studentsPrincipals:Buffer.Buffer<Principal> = Buffer.fromArray(studentsCanister);
            var index =0;
                while(index < studentsPrincipals.size()){
                    let defaultSub:Account.Subaccount = _defaultSub();
                        var student= studentsPrincipals.get(index);
                        let newAccount:Account.Account = {
                            owner=student;
                            subaccount=?defaultSub;
                        };
                       _airDrop(newAccount);
                        index += 1;
                };
            return #ok()
    };


    public shared func airDrop2(): async Result.Result<(),Text>{
            var students = await getStudents();
            let studentsPrincipals:Buffer.Buffer<Principal> = Buffer.fromArray(students);
              Buffer.iterate<Principal>(studentsPrincipals, func (x) {
                    let defaultSub:Account.Subaccount = _defaultSub();
                        let newAccount:Account.Account = {
                            owner=x;
                            subaccount=?defaultSub;
                        };
                        _airDrop(newAccount);
            });

            return #ok()
    };





    public shared(msg) func transfer(from:Account.Account,to:Account.Account,amount:Nat): async Result.Result<(),Text>{
        switch (ledger.get(from)) {
        case null { return #err "insufficient balance or non existing account" };
        case (?coins) {
            if(coins>=amount){
                    _transfer(from,to,amount)
            };
            return #err "insuficient balance to perform operation"
        };
        };
    };




      let textPrincipals: [Text] = [
        "un4fu-tqaaa-aaaab-qadjq-cai",
        "un4fu-tqaaa-aaaac-qadjr-cai",
        "un4fu-tqaaa-aaaad-qadjs-cai",
        "un4fu-tqaaa-aaaae-qadjt-cai",
        "un4fu-tqaaa-aaaaf-qadjv-cai",
        "un4fu-tqaaa-aaaag-qadjw-cai",
        "un4fu-tqaaa-aaaah-qadjx-cai",
        "un4fu-tqaaa-aaaai-qadjy-cai",
        "un4fu-tqaaa-aaaaj-qadjz-cai",
        "un4fu-tqaaa-aaaak-qadk1-cai",
    ];


     public shared func getAllStudentsPrincipalTest():async[Principal]{
             let principalsText:Buffer.Buffer<Text> = Buffer.fromArray(textPrincipals);
             var index:Nat = 0;
             var principalsReady = Buffer.Buffer<Principal>(10);

                  Buffer.iterate<Text>(principalsText, func (x) {
                      let newPrincipal = Principal.fromText(principalsText.get(index));
                    principalsReady.add(newPrincipal);
            });
            /* while(index<= principalsText.size()-1){
                let newPrincipal = Principal.fromText(principalsText.get(index));
                principalsReady.put(index,newPrincipal);
                index += 1;
             };*/
            return Buffer.toArray(principalsReady);
    };


public shared(msg) func addNewComment(newComment: Text,proposalId:Nat): async Result.Result<CommentResponse,Text> {
    switch (commentsLedger.get(Nat.toText(proposalId))) {
        case (null){
         let newId = Principal.toText(msg.caller)#Int.toText(Time.now());
        let newIdNat = 0;
        let newCommentData: Comment = {
            id = newIdNat;
            proposalId = proposalId;
            text = newComment;
            commenter = msg.caller;
            timestamp = Time.now();
        };
         let newCommentResponse:CommentResponse = {
                      id=newIdNat;
                      proposalId=proposalId;
                      text=newComment;
                      commenter=msg.caller;
                      timestamp=Time.now();
                  };
            let newCommentLedger:Comments =TrieMap.TrieMap<Text,Comment>(Text.equal,Text.hash);

              newCommentLedger.put(newId,newCommentData);
           commentsLedger.put(Nat.toText(proposalId),newCommentLedger);

          return #ok(newCommentResponse);
          };
        case (?found) {
        let newId = Principal.toText(msg.caller)#Int.toText(Time.now());
        let newIdNat = found.size();
        let newCommentData: Comment = {
            id = newIdNat;
            proposalId = proposalId;
            text = newComment;
            commenter = msg.caller;
            timestamp = Time.now();
        };
         let newCommentResponse:CommentResponse = {
                      id=newIdNat;
                      proposalId=proposalId;
                      text=newComment;
                      commenter=msg.caller;
                      timestamp=Time.now();
                  };
        found.put(newId,newCommentData);
        #ok(newCommentResponse);
        };
    };
};





public shared query func getComments(proposalId: Nat): async Result.Result<[CommentResponse], Text> {
    switch (commentsLedger.get(Nat.toText(proposalId))) {
        case null { return #err "No comments found for this proposal" };
        case (?commentsFound) {
            let commentsBuffers:Buffer.Buffer<CommentResponse> = Buffer.Buffer<CommentResponse>(0);

              for(comment in commentsFound.vals()){
                  let newCommentResponse:CommentResponse = {
                      id=comment.id;
                      proposalId=comment.proposalId;
                      text=comment.text;
                      commenter=comment.commenter;
                      timestamp=comment.timestamp;
                  };
                    commentsBuffers.add(newCommentResponse);
              };
            return #ok(Buffer.toArray(commentsBuffers));
        };
    };
};




};
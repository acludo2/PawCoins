
import Debug "mo:base/Debug";
import State "./backend/State";
import Array "mo:base/Array";
import Hash "mo:base/Hash";
import Buffer "mo:base/Buffer";
import HashMap "mo:base/HashMap";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Prelude "mo:base/Prelude";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import TrieMap "mo:base/TrieMap";
import Types "./backend/Types";



shared ({caller = initPrincipal}) actor class Delivery () {
  var state = State.empty({ admin = initPrincipal });

    // responsible for adding metadata from the user to the state.
  // a null principal means that the username has no valid callers (yet), and the admin
  // must relate one or more principals to it.
  func createProfile_(userName_ : Text, p: ?Principal) : ?() {
    switch (state.profiles.get(userName_)) {
      case (?_) { /* error -- ID already taken. */ null };
      case null { /* ok, not taken yet. */
        let now = Time.now();
        state.profiles.put(userName_, {
            pastOrders = null;
            currentOrder = null;
            location = null;
            userName = userName_ ;
            createdAt = now ;
        });
        ?()
      };
    }
  };

 public shared(msg) func createProfile(userName : Text) : async ?Types.ProfileInfo {
    do ? {
      createProfile_(userName, ?msg.caller)!;
      // return the full profile info
      getProfileInfo_(null, userName)! // self-view
    }
  };

    ///session functions
  func createSession_(wallet:Principal): ?() {
      let lastLogIn = Time.now();
      switch (state.sessions.get(wallet)) {
          case (?_) { ?updateSession_(wallet) };
          case null {
              state.sessions.put(wallet, {
                  wallet = wallet;
                  lastLogIn = lastLogIn;
                  lastLogOut = null;
                  active = true;
                  });
                ?()
      };
    }
  };

   public shared(msg) func createSession(wallet : Text) : async ?Types.Session {
    do ? {
        let principalWallet = Principal.fromText(wallet);
      createSession_(principalWallet)!;
      // return the full profile info
      getSession_(principalWallet)! // self-view
    }
  };




    func getProfileInfo_(caller: ?Types.UserId, userId: Types.UserId): ?Types.ProfileInfo {
    do ? {
      let profile = state.profiles.get(userId)!;
      {
        userName = profile.userName;
        currentOrder = state.orders.get(userId);
        pastOrders = null;
        location = null;
        createdAt = profile.createdAt;
      }
    }
  };

  func getSession_(wallet:Types.Wallet): ?Types.Session {
    do ? {
      let userSession = state.sessions.get(wallet)!;
      {
       wallet = userSession.wallet;
       lastLogIn = userSession.lastLogIn;
       lastLogOut = userSession.lastLogOut;
       active = userSession.active;
      }
    }
  };



   public query(msg) func getProfiles() : async ?[Types.ProfileInfo] {
    do ? {
      let b = Buffer.Buffer<Types.ProfileInfo>(0);
      for ((p, _) in state.profiles.entries()) {
       b.add(getProfileInfo_(null,p)!)
      };
      b.toArray()
    }
  };


   public query(msg) func getSessions() : async ?[Types.Session] {
    do ? {
      let b = Buffer.Buffer<Types.Session>(0);
      for ((p, _) in state.sessions.entries()) {
       b.add(getSession_(p)!)
      };
      b.toArray()
    }
  };

  func updateSession_(wallet:Principal){

  };



   public shared(msg) func createVideo(i : Types.VideoInit) : async ?Types.VideoId {
    do ? {
      createVideo_(i)!
    }
  };

  func createVideo_(i : Types.VideoInit) : ?Types.VideoId {
    let now =  Time.now();
    let videoId = i.userId # "-" # i.name # "-" # (Int.toText(now));
    switch (state.videos.get(videoId)) {
    case (?_) { /* error -- ID already taken. */ null };
    case null { /* ok, not taken yet. */
           state.videos.put(videoId,
                            {
                              videoId = videoId;
                              userId = i.userId ;
                              name = i.name ;
                              createdAt = i.createdAt ;
                              uploadedAt = now ;
                              viralAt = null ;
                              caption =  i.caption ;
                              chunkCount = i.chunkCount ;
                              tags = i.tags ;
                              viewCount = 0 ;
                            });
           ?videoId
         };
    }
  };

};


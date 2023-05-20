
import Hash "mo:base/Hash";
import Prelude "mo:base/Prelude";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Trie "mo:base/Trie";
import TrieMap "mo:base/TrieMap";
import Principal "mo:base/Principal";


import Types "./Types"

module {

// Our representation of finite mappings.
  public type MapShared<X, Y> = TrieMap.TrieMap<X, Y>;

public type StateShared = {
    /// all profiles.
    profiles : MapShared<Types.UserId, Types.ProfileInfo>;

    /// all users. see andrew for disambiguation
    orders : MapShared<Types.OrderId, Types.UserOrder>;

    sessions : MapShared<Types.Wallet, Types.Session>;

    videos: MapShared<Types.VideoId, Video>;

  };

    public type Video = {
    userId : Types.UserId;
    createdAt : Types.Timestamp;
    uploadedAt : Types.Timestamp;
    viralAt: ?Types.Timestamp;
    caption: Text;
    tags: [Text];
    viewCount: Nat;
    name: Text;
    chunkCount: Nat;
  };

public func empty (init : { admin : Principal }) : StateShared {
    let equal = (Text.equal, Text.equal);
    let hash = (Text.hash, Text.hash);
    let st : StateShared = {
      //access = Access.Access({ admin = init.admin ; uploaded = uploaded_ });
      profiles = TrieMap.TrieMap<Types.UserId, Types.ProfileInfo>(Text.equal, Text.hash);
      orders = TrieMap.TrieMap<Types.UserId, Types.UserOrder>(Text.equal, Text.hash);
      sessions = TrieMap.TrieMap<Types.Wallet, Types.Session>(Principal.equal, Principal.hash);
      //messages = RelObj.RelObj((Text.hash, messageHash), (Text.equal, messageEqual));
      //chunks = TrieMap.TrieMap<ChunkId, ChunkData>(Text.equal, Text.hash);
     // profilePics = TrieMap.TrieMap<Types.UserId, Types.ProfilePic>(Text.equal, Text.hash);
      videos = TrieMap.TrieMap<Types.VideoId, Video>(Text.equal, Text.hash);
    //  videoPics = TrieMap.TrieMap<Types.VideoId, Types.VideoPic>(Text.equal, Text.hash);
     // follows = RelObj.RelObj(hash, equal);
     // likes = RelObj.RelObj(hash, equal);
     //superLikes = RelObj.RelObj(hash, equal);
     // uploaded = uploaded_;
     // eventLog = SeqObj.Seq<Event.Event>(Event.equal, null);
    //var eventCount = 0;
    //abuseFlagVideos = RelObj.RelObj(hash, equal);
    //abuseFlagUsers = RelObj.RelObj(hash, equal);
    };
    st
  };



}
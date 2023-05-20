


module{
    public type VideoId = Text; // chosen by createVideo
    public type Coordinate = Float;
    public type UserId = Text;
    public type OrderId = Text;
    public type ProductId = Text;
    public type Wallet = Principal;
    public type Timestamp = Int; // See mo:base/Time and Time.now()

public type VideoInit = {
 userId : UserId;
 name: Text;
 createdAt : Timestamp;
 caption: Text;
 tags: [Text];
 chunkCount: Nat;
};


    public type UserLocation = {
        lat:Coordinate;
        long:Coordinate;
        };

    public type Role = {
        #user;
        #admin;
        #guest
    };

    public type Product = {
        id:ProductId;
        description:Text;
    };

    public type OrderProducts = {
        products:[Product]
    };


    public type UserOrder ={
        userId:UserId;
        id:OrderId;
        products:OrderProducts;
    };



    public type ProfileInfo = {
        userName: Text;
        currentOrder: ?UserOrder;
        pastOrders: ?[UserId];
        location: ?UserLocation;
        createdAt:Timestamp;
        };

    public type Session = {
        wallet:Wallet;
        active:Bool;
        lastLogIn:Timestamp;
        lastLogOut:?Timestamp;
    };




};
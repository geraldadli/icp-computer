import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";

actor Wallet {

    type Wallet = {
        id : Nat;
        amount : Nat;
        owner : Principal;
        user : Text;
    };

    var wallets : [Wallet] = [];

    public shared (msg) func addWallet(amount : Nat, user : Text) : async Nat {
        // Check if the user already has a wallet
        for (i in Iter.range(0, Array.size(wallets) - 1)) {
            if (wallets[i].user == user) {
                return -1;
            };
        };
        let id = wallets.size();
        let newWallet : Wallet = {
            id = id;
            amount = amount;
            owner = msg.caller;
            user = user;
        };
        wallets := Array.append<Wallet>(wallets, [newWallet]);
        return id;
    };

    public query func viewWallets() : async [Wallet] {
        return wallets;
    };
    public query func findWalletIndex(productId : Nat) : async ?Nat {
        for (i in Iter.range(0, Array.size(wallets) - 1)) {
            if (wallets[i].id == productId) {
                return ?i;
            };
        };
        return null;
    };

    // Buy a Wallet(ownership transfer)
    public shared (msg) func deposit(walletId : Nat, amounts : Nat) : async Text {
        let index = await findWalletIndex(walletId);
        switch (index) {
            case (?i) {
                let Wallet = wallets[i];
                wallets := Array.mapEntries<Wallet, Wallet>(
                    wallets,
                    func(x, k) {
                        if (k == i) {
                            return {
                                id = x.id;
                                owner = x.owner;
                                user  = x.user;
                                amount = x.amount + amounts
                            };
                        } else {
                            return x;
                        };
                    },
                );
                return "Deposit successful!";
            };
            case null {
                return "Deposit failed";
            };
        };
    };
};

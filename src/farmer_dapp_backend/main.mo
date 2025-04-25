import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";

actor AgricultureShop {

     type Product = {
        id : Nat;
        name : Text;
        category : Text;
        price : Nat;
        owner : Principal;
    };

    var products : [Product] = [];


    // Add a new agriculture product
    public shared func addProduct(name : Text, category : Text, price : Nat, caller : Principal) : async Nat {
        let id = products.size();
        let newProduct : Product = {
            id = id;
            name = name;
            category = category;
            price = price;
            owner = caller;
        };
        products := Array.append<Product>(products, [newProduct]);
        return id;
    };

    // View all available products
    public query func viewProducts() : async [Product] {
        return products;
    };
    public query func findProductIndex(productId : Nat) : async ?Nat {
        // Manually search for the product by its ID
        for (i in Iter.range(0, Array.size(products) - 1) ){
            if (products[i].id == productId) {
                return ?i; // Return the index if found
            };
        };
        return null; // Return null if not found
    };

    // Buy a product (ownership transfer)
    public shared func buyProduct(productId : Nat, caller: Principal) : async Text {
        let index = await findProductIndex(productId);
        switch (index) {
            case (?i) {
                let product = products[i];

                if (product.owner == caller) {
                    return "You already own this product.";
                };

                // products[i] := {
                //     id = product.id;
                //     name = product.name;
                //     category = product.category;
                //     price = product.price;
                //     owner = caller;
                // };
                return "Purchase successful!";
            };
            case null {
                return "Product not found.";
            };
        };
    };
};

import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";

actor AgricultureShop {


type Product = {
    id : Nat;
    name : Text;
    description : Text;
    category : Text;
    price : Nat;
    owner : Principal;
    image : [Nat8];
    stock : Nat;
    seller : Text;
};

var products : [Product] = [];

// Add a new agriculture product
public shared (msg) func addProduct(name : Text, category : Text, description : Text, price : Nat, image : [Nat8], stock : Nat, seller : Text) : async Nat {
    let id = products.size();
    let newProduct : Product = {
        id = id;
        name = name;
        description = description;
        category = category;
        price = price;
        owner = msg.caller;
        image = image;
        stock = stock;
        seller = seller;
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
    for (i in Iter.range(0, Array.size(products) - 1)) {
        if (products[i].id == productId) {
            return ?i; // Return the index if found
        };
    };
    return null; // Return null if not found
};

// Buy a product (ownership transfer)
public shared (msg) func buyProduct(productId : Nat) : async Text {
    let index = await findProductIndex(productId);
    switch (index) {
        case (?i) {
            let product = products[i];

            if (product.owner == msg.caller) {
                return "You already own this product.";
            };

            // products[i] := {
            //     id = product.id;
            //     name = product.name;
            //     category = product.category;
            //     price = product.price;
            //     owner = caller;
            // };

            products := Array.mapEntries<Product, Product>(
                products,
                func(x, k) {
                    if (k == i) {
                        return {
                            id = x.id;
                            name = x.name;
                            category = x.category;
                            description = x.description;
                            price = x.price;
                            owner = msg.caller;
                            image = x.image;
                            stock = x.stock - 1;
                            seller = x.seller;
                        };
                    } else {
                        return x;
                    };
                },
            );

            return "Purchase successful!";
        };
        case null {
            return "Product not found.";
        };
    };
};
};

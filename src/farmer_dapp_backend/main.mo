import Debug "mo:base/Debug"

actor{
let z = do{
    let x = 1;
    let y = x + 1;
    x * y + x;
};

Debug.print(debug_show(z));

}

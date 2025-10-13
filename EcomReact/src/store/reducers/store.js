import { configureStore } from "@reduxjs/toolkit";
import { productReducer } from "./ProductReducer";
import { errorReducer } from "./errorReducer";
import { CartReducer } from "./CartReducer";
import { AuthReducer } from "./AuthReducer";
import { LocationReducer } from "./LocationReducer";

const user = localStorage.getItem("auth") ? JSON.parse(localStorage.getItem("auth")) : [];
const cartItems = localStorage.getItem("cartItemList") ? JSON.parse(localStorage.getItem("cartItemList")) : [];

const initialState = {
    auth: {user: user},
    carts: {
        cart: cartItems, 
        quantityCartItems: cartItems.length,
    },
}

const store = configureStore({
    reducer: {
        products: productReducer,
        errors: errorReducer,
        carts: CartReducer,
        auth: AuthReducer,
        location: LocationReducer
    },
    preloadedState: initialState,
});

export default store;
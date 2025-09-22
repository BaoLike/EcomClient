const initialState = {
    cart: [],
    totalPrice: 0, 
    cartId: null,
}

export const CartReducer = (state = initialState, action) => {
    if(action.type === "ADD_CART"){
        const productToAdd = action.payload;
            const existingProduct = state.cart.find(
                (item) => item.productId === productToAdd.productId
            )
            if(existingProduct){
                const updatedCart = state.cart.map((item) => {
                    if(item.productId === productToAdd.productId){
                        return productToAdd;
                    }
                    else{
                        return item;
                    }
                })

                return {
                    ...state,
                    cart: updatedCart
                }
            }
            else{
                const newCart = [...state.cart, productToAdd];
                return {
                    ...state, 
                    cart: newCart,
                }
            }
    }
    else{
        return state;
    }
}
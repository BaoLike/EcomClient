const initialState = {
    user: null,
    address: []
}

export const AuthReducer = (state = initialState, action) => {
    if(state.tpye === "LOGIN_USER"){
        return {...state, user: action.payload}
    }
    return state;
}
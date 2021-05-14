export const initialState = {
    user: null,
    dbname: "idi",
}

export const actionTypes = {
    SET_USER: "SET_USER",
    SET_DATABASE: "SET_DATABASE",
}

const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                ...state,
                user: action.user,
            }

        case actionTypes.SET_DATABASE:
            return {
                ...state,
                dbname: action.dbname,
            }

        default:
            return state
    }
}

export default reducer

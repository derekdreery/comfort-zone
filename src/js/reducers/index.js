import Immutable from 'immutable';

const initialState = Immutable.Map();

/**
 *
 */
export default function rootReducer(previousState, action) {
    if (typeof previousState === 'undefined') {
        return initialState;
    }
    switch (action.type) {
    default:
        return previousState;
    }
};

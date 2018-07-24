type StoreAction = "add" | "remove";

export class SimpleStoreActionType {
    static add: StoreAction = "add";
    static remove: StoreAction = "remove";
}

export interface SimpleStoreAction<T> {

    action: StoreAction
    payload: T

}

export const simpleReducerFactory = <T>(comparer: (a, b) => boolean) => (action: SimpleStoreAction<T>, state: T[]) => {

    const methods = {
        add: (payload: T) => {
            const newState = state.slice();
            newState.push(payload);
            return newState;
        },
        remove: (payload: T) => {

            const newState = state.slice();
            const index = newState.findIndex(p => comparer(p, payload));

            newState.splice(index, 1);
            return newState
        }

    };

    if (methods[action.action]) {

        state = methods[action.action](action.payload);
    }

    return state
};
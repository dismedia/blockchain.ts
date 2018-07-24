import {scan, shareReplay} from "rxjs/operators";
import {Observable} from "rxjs/Rx";
import {startWith} from "rxjs/internal/operators";

export const storeFactory = <Action, State>(reducer: (action: Action, state: State) => State, initState: State) => {

    return (actions: Observable<Action>): Observable<State> => {

        const output = actions.pipe(startWith(initState),scan<Action, State>((acc: State, val: Action) => {

                return reducer(val, acc)

            }),
            shareReplay(1),

        );

        output.subscribe();
        return output as Observable<State>;

    }

};




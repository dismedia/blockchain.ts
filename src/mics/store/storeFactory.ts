import {scan, shareReplay} from "rxjs/operators";
import {Observable} from "rxjs/Rx";

export const storeFacotory = <Action, State>(reducer: (action: Action, state: State) => State, initState: State) => {

    return (actions: Observable<Action>) => {

        const output = actions.pipe(scan<Action, State>((acc: State, val: Action) => {

                return reducer(val, acc)

            }, initState),
            shareReplay(1)
        )

        output.subscribe()
        return output;

    }

}




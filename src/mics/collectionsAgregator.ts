import {map} from "rxjs/operators";
import {from} from "rxjs/index";
import {Observable} from "rxjs/Rx";
import {mergeMap, withLatestFrom} from "rxjs/internal/operators";

export const observableCollectionsDifferenceFactory =
    <T>(compare: (a: T, b: T) => boolean) =>
        (externalCollection: Observable<T[]>,
         currentCollection: Observable<T[]>,) =>

            externalCollection.pipe(
                withLatestFrom(currentCollection),

                map(([external, current]) => {

                    return external.filter(p => !current.some(c => compare(p, c)))
                }),
                mergeMap((unconnectedArray) => from(unconnectedArray))
            ) as Observable<T>
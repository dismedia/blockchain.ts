import {map} from "rxjs/operators";
import {from} from "rxjs/index";
import {Observable} from "rxjs";
import {mergeMap, withLatestFrom} from "rxjs/internal/operators";

export const collectionDifference =
    <T, O>(compare: (a: T, b: O) => boolean) =>
        (externalCollection: Observable<T[]>,
         currentCollection: Observable<O[]>,) =>

            externalCollection.pipe(
                withLatestFrom(currentCollection),

                map(([external, current]) => {

                    return external.filter(p => !current.some(c => compare(p, c)))
                }),
                mergeMap((unconnectedArray) => from(unconnectedArray))
            ) as Observable<T>;
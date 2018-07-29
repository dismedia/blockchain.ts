import * as chai from "chai";
import {from, Observable, Subject} from "rxjs";
import {map, scan, shareReplay, withLatestFrom} from "rxjs/operators";

const assert = chai.assert;

describe('Array', function () {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal([1, 2, 3].indexOf(4), -1);
        });
    });

    describe('rx', function () {
        it('sholud teach me some', function (done) {

            const factory = (peerActions: Observable<PeerAction>) => {

                const output = peerActions.pipe(scan<PeerAction[]>((acum: PeerAction[], action) => {

                        acum.push(action)
                        return acum

                    }, []),
                    shareReplay(1)
                )

                output.subscribe()
                return output;

            }

            const pa = new Subject<PeerAction>();

            let peerState = factory(pa)

            pa.next({id: 1});
            pa.next({id: 2});

            const consumer = from([1, 2, 3]).pipe(
                withLatestFrom(peerState),
                map((combined: any[]) => {
                    return combined
                })
            )

            consumer.subscribe((c) => console.dir(c))

            setTimeout(() => {

                done()

            }, 1000)

        });
    });
});

interface PeerAction {

}

// interface stateFactory<Action, State> {
//
//     ():(actions: Observable<Action>)=>Observable<Action>
//
// }




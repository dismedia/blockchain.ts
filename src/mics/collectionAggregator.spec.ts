import * as chai from "chai";
import {observableCollectionsDifferenceFactory} from "./collectionsAgregator";
import {BehaviorSubject, Observable} from "rxjs/Rx";

const assert = chai.assert;

describe('collection aggregator', () => {

    it('should emit elements which comes from external collection but are not stored with current collection', (done) => {

        const externalSource = new BehaviorSubject<number[]>([]);
        const current = new BehaviorSubject<number[]>([9, 8]);

        const numberCollectionsAggregator: Observable<number> = observableCollectionsDifferenceFactory<number>((a, b) => a == b)(externalSource, current)

        const assertions = [

            (r) => {
                assert.equal(r, 1)

            },
            (r) => {
                assert.equal(r, 2)

            },
            (r) => {
                assert.equal(r, 9)
                done();
            }

        ];

        numberCollectionsAggregator.subscribe((r) => assertions.shift()(r))

        externalSource.next([1]);
        externalSource.next([9, 2]);
        current.next([2])
        externalSource.next([9, 2]);

    })
});
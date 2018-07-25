import {storeFactory} from "./storeFactory";
import {Subject} from "rxjs/Rx";
import * as chai from "chai";


const assert = chai.assert;

describe('store facory', () => {

    it('should give last state on subscribe', (done) => {

        const actions = new Subject<number>();

        let sut = storeFactory<number, number[]>((action, state) => {
            state.push(action);
            return state
        }, [10])(actions);

        actions.next(0);
        actions.next(1);
        actions.next(2);

        sut.subscribe((s) => {

            assert.equal(s.length, 4);
            assert.equal(s[0], 10);
            done();

        })
    });

    it('should give current state', (done) => {

        const actions = new Subject<number>();

        let sut = storeFactory<number, number[]>((action, state) => {
            state.push(action);
            return state
        }, [10])(actions);

        actions.next(0);
        actions.next(1);
        actions.next(2);

        sut.subscribe((s) => {

            if (s.length == 5) {
                assert.equal(s[4], 100);
                done();
            }
        });

        actions.next(100)

    })
});



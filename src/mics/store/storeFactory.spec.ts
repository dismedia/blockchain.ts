import {storeFactory} from "./storeFactory";
import {Subject} from "rxjs/Rx";
import * as chai from "chai";

class TestActions {
}

const assert = chai.assert;

describe('store facory', () => {

    it('should give last state on subscribe', (done) => {

        const actions = new Subject<TestActions>();

        let sut = storeFactory<TestActions, TestActions[]>((action, state) => {
            state.push(action);
            return state
        }, [])(actions);

        actions.next({action: 0});
        actions.next({action: 1});
        actions.next({action: 2});

        sut.subscribe((s) => {

            assert.equal(s.length, 3);
            done();

        })

    })

});
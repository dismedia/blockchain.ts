import * as chai from "chai";
import {PeerAction, peerStoreFactory} from "./peerStore";
import {PeerInfo} from "../connector";
import {interval} from "rxjs/index";
import {map, take} from "rxjs/internal/operators";

class TestActions {
}

const assert = chai.assert;

describe('store facory', () => {

    it('should give current state on subscribe', (done) => {

        const actions = interval(100).pipe(
            take(4),
            map(n => {
                return {
                    action: "addPeer",
                    payload: {id: n.toString()} as PeerInfo
                } as PeerAction
            }));

        let sut = peerStoreFactory(actions);

        interval(500).pipe(take(1)).subscribe(() => {
            sut.subscribe(state => {

                assert.equal(state.length, 4);
                assert.equal(state[1].id, "1");
                assert.equal(state[3].id, "3");

                done()
            })
        })

    })
});
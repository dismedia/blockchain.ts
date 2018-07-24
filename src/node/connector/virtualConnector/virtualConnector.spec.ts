import {Connector} from "./virtualConnector";
import {BehaviorSubject} from "rxjs/Rx";
import {PeerConnectionCreator, PeerInfo} from "../connector";
import * as chai from "chai";
import {from} from "rxjs/index";
import {mergeMap, tap} from "rxjs/internal/operators";

const assert = chai.assert;

describe('virtual connector', () => {

    describe('factory', () => {

        it('should be created from settings with specific type', (done) => {

        });

        describe('connector', () => {

            it('should use connection factory on every new peer discovered', (done) => {

                let testNetworkConnections = [];

                const knownPeers: PeerInfo[] = [
                    {id: "0", type: "virtual", connectionParms: {}},
                    {id: "1", type: "virtual", connectionParms: {}}
                ]

                const peers = new BehaviorSubject<PeerInfo[]>(knownPeers)

                const connectionCreator: PeerConnectionCreator = (peer) => peer.pipe(
                    tap((p: PeerInfo) => console.log("connecting " + p.id)),

                    mergeMap((p) => from(Promise.resolve(p))),

                    tap((p: PeerInfo) => console.log("connected " + p.id)),

                    tap(p => testNetworkConnections.push(p))
                );

                new Connector(connectionCreator, peers, from([]))

                peers.next([{id: "3", type: "virtual", connectionParms: {}}])
                peers.next([{id: "3", type: "virtual", connectionParms: {}}])
                peers.next([{id: "3", type: "virtual", connectionParms: {}}])

                setTimeout(() => {

                    console.log(testNetworkConnections)

                    done();

                }, 1000)
            })

        })

    })
});

const makeConnectionSim = (peer) => {
    return new Promise((res, rej) => {
        setTimeout(() => res(peer), Math.random() * 100)
    })
}

makeConnectionSim({})
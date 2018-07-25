import {Connector} from "./virtualConnector";
import {BehaviorSubject, Observable, Subject} from "rxjs/Rx";
import {ConnectedPeer, PeerConnectionCreator, PeerInfo} from "../connector";
import * as chai from "chai";
import {zip} from "rxjs/index";
import {filter, mergeMap, tap} from "rxjs/internal/operators";
import {NodeMessage} from "../../message/nodeMessage";
import {fromPromise} from "rxjs/internal/observable/fromPromise";

const assert = chai.assert;

describe('connector', () => {

    it('should send and receive messages', (done) => {

        const bus = new Subject<NodeMessage>();
        //bus.subscribe((m: any) => console.log("bus: " + m.data))

        const createEnvForPeer = (id, otherPeerId) => {

            const knownPeers: PeerInfo[] = [
                {id: otherPeerId, type: "virtual", connectionParms: {bus: bus, id: id}},

            ];

            const testConnectionCreator: PeerConnectionCreator = (peer) => peer.pipe(
                mergeMap((p) => fromPromise(connection({id})(p))),
            )

            const peers = new BehaviorSubject<PeerInfo[]>(knownPeers)

            const mtb = new Subject<NodeMessage>();

            return {
                messagesToBroadcast: mtb,
                connector: new Connector(testConnectionCreator, peers, mtb)
            }

        };

        const env1 = createEnvForPeer("1", "2");
        const env2 = createEnvForPeer("2", "1");

        setTimeout(() => {
            zip(env1.connector.messages, env2.connector.messages).subscribe((ms: any) => {

                assert.equal(ms[0].data, "some data from 2");
                assert.equal(ms[1].data, "some data from 1");

                done();
            })

            env2.messagesToBroadcast.next({data: "some data from 2"} as any);
            env1.messagesToBroadcast.next({data: "some data from 1"} as any);

        }, 500)

    })

});

const connection = (context) => (p: PeerInfo) => new Promise<ConnectedPeer>((res, rej) =>

    setTimeout(() => {

        console.log("...connectiong " + context.id + " to " + p.id)

        res({
                peer: p, connection: {
                    //receive:from([{} as NodeMessage]),
                    receive: (p.connectionParms.bus as Observable<NodeMessage>).pipe(
                        filter(m => m.from == p.id),
                        tap((message) => console.log(context.id + " received message from " + message.from))
                    ),
                    send: (message) => {

                        console.log(context.id + " sending data")

                        message.from = context.id;
                        return Promise.resolve(p.connectionParms.bus.next(message))
                    }
                }
            }
        )

    }, 100)
)







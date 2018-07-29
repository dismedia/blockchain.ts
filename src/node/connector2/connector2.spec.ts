import * as chai from "chai";
import {mergeMap} from "rxjs/operators";
import {from, Observable, Subject} from "rxjs";
import * as sinon from "sinon";
import {distinct} from "rxjs/internal/operators";
import {PeerInfo} from "../connector/connector";
import {NodeMessage} from "../message/nodeMessage";

import {ConnectionFactory} from "./connection.spec";
import {emptyStream} from "../../mics/store/stream";

const assert = chai.assert;

interface Connector {
    (peer: Observable<PeerInfo>, connectionFactory: ConnectionFactory, toBroatcast: Observable<NodeMessage>): Observable<NodeMessage>
}

const createConnector: Connector = (peer: Observable<PeerInfo>, connectionFactory: ConnectionFactory, toBroatcast: Observable<NodeMessage>) =>

    peer.pipe(
        distinct(p => p.id),
        mergeMap((p) => connectionFactory(p, toBroatcast))
    );

// peer.pipe(
//     scan((acum,peer:PeerInfo)=>{
//         if(acum.some(p=>peer.id==p.id))
//         acum.push(peer)
//         return acum
//     },[])
// )

describe('abstract connector', function () {

    it('should create connection for peer', function (done) {

        const mtb = emptyStream;

        const peer1: PeerInfo = {id: "1", connectionParms: {}, type: "test"};

        const connectionCreatorStub = sinon.stub();

        connectionCreatorStub.withArgs(peer1, mtb).returns(from([{peer: peer1}]));

        const peers = new Subject<PeerInfo>();

        let sut = createConnector(peers, connectionCreatorStub, emptyStream);

        sut.subscribe(() => {

            assert(connectionCreatorStub.called);
            done();
        });

        peers.next(peer1);

    });

    it('should not create connection for the connecting peer', function (done) {

        const mtb = emptyStream;

        const peer1: PeerInfo = {id: "1", connectionParms: {}, type: "test"};

        const connectionCreatorStub = sinon.stub();
        connectionCreatorStub.withArgs(peer1, mtb).returns(from([
            {peer: peer1}
        ]));

        const peers = new Subject<PeerInfo>()

        let sut = createConnector(peers, connectionCreatorStub, emptyStream);

        sut.subscribe((p) => {

        }, () => {
        }, () => {
            assert.equal(connectionCreatorStub.calledOnce, true);
            done();
        })

        peers.next(peer1);
        peers.next(peer1);
        peers.complete();

    });

});




import {VirtualConnector, virtualConnectorFactory} from "./virtualConnector";
import {Subject} from "rxjs/Rx";
import {ConnectorSettings} from "../../configData";
import {PeerInfo} from "../connector";
import * as chai from "chai";
import {NodeMessage} from "../../message/nodeMessage";
import {from} from "rxjs/index";


const assert = chai.assert;

describe('virtual connector', () => {

    describe('factory', () => {

        it('should be created from settings with specific type', (done) => {


            const settings = new Subject<ConnectorSettings>();
            const peers = new Subject<PeerInfo>();

            const connectors = [];

            const check = () => {
                assert.equal(connectors.length, 2);
                done();
            };

            const messagesToBroadcat = from([]);
            const bus = new Subject<NodeMessage>();

            virtualConnectorFactory(settings, messagesToBroadcat, peers).subscribe(c => connectors.push(c), () => {
            }, () => check());

            settings.next({params: {bus}, type: "virtual"});
            settings.next({params: {bus}, type: "other"});
            settings.next({params: {bus}, type: "virtual"});
            settings.complete();


        })

    });

    describe('connector', () => {

        it('should send and receive messages via param bus', (done) => {

            const peers = new Subject<PeerInfo>();

            let bus = new Subject<NodeMessage>();

            const messagesToBroadcat1 = from([]);
            const messagesToBroadcat2 = new Subject<NodeMessage>();
            const messagesToBroadcat3 = from([]);

            let one = new VirtualConnector({params: {bus}, type: "virtual"}, messagesToBroadcat1, peers);
            let two = new VirtualConnector({params: {bus}, type: "virtual"}, messagesToBroadcat2, peers);
            let three = new VirtualConnector({params: {bus}, type: "virtual"}, messagesToBroadcat3, peers);

            const idOne = one.me;
            const idTwo = two.me;


            peers.next({id: idOne, type: "virtual", connectionParms: {}});
            peers.next({id: idTwo, type: "virtual", connectionParms: {}});


            one.messages.subscribe(m => {

                console.log(m);

                assert.equal((<any>m).data, "data");
                assert.equal(m.from, two.me);

                done()
            });

            three.messages.subscribe(m => {
                throw("should not get it, three is not a registered peer")
            });

            messagesToBroadcat2.next({data: "data"}as NodeMessage)


        })

    })

});
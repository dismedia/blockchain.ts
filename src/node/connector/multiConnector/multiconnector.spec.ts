import * as chai from "chai";
import {MultiConnector} from "./multiConnector";
import {ConnectorFactory, KnownNode} from "../connector";
import {from} from "rxjs/index";
import * as sinon from "sinon";

const assert = chai.assert;

describe("multiconnector", () => {

    it('should connect for every known node type', () => {


        const knownNodes = from<KnownNode>([
            {
                type: "telepatic",
                params: {host: "brainOne"}

            },
            {
                type: "email",
                params: {host: "erica@lambert.hell"}

            }])


        const factoryResults = {
            "telepatic": {
                connect: sinon.spy(), broadcast: () => {
                }, messages: from([])
            },
            "email": {
                connect: sinon.spy(), broadcast: () => {
                }, messages: from([])
            }

        }

        let connectorFactory: ConnectorFactory = {
            createConnector: (type) => {
                return factoryResults[type]
            }
        }

        const sut = new MultiConnector(knownNodes, connectorFactory)

        //console.log(factoryResults.email.connect)

        assert.equal("brainOne", factoryResults.telepatic.connect.getCall(0).lastArg.host);
        assert.equal("erica@lambert.hell", factoryResults.email.connect.getCall(0).lastArg.host);

    });

    it('should use factory once for hosts with same type', () => {


        const knownNodes = from<KnownNode>([
            {
                type: "telepatic",
                params: {host: "brainOne"}

            },
            {
                type: "telepatic",
                params: {host: "brainTwo"}
            }])


        let connector =
            {
                connect: sinon.spy(),
                broadcast: () => {
                },
                messages: from([])
            }


        let connectorFactory: any = {
            createConnector: sinon.fake.returns(connector)
        }

        const sut = new MultiConnector(knownNodes, connectorFactory)



        assert.equal(1,connectorFactory.createConnector.callCount)
        assert.equal(2,connector.connect.callCount)


    });

});
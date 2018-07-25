import {ConnectorType} from "./connector/connector";

export interface ConnectorSettings {
    type: ConnectorType
    params: any;
    id: string
}

export interface ConfigData {

    connectors: ConnectorSettings[]

}
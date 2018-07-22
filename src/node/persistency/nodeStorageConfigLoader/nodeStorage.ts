import {ConfigData, ConfigSource} from "../storageConfigLoader";
import * as NodeStorage from "node-storage"
import {PromiseFromObject} from "../../../mics/abstract";


export const nodeStorage:PromiseFromObject<ConfigSource,ConfigData> = (source: ConfigSource): Promise<ConfigData> => {

    const defaultConfig: ConfigData = {
        connectors: {
            websocet: {
                port: 8870
            }
        }
    };

    return new Promise((res, rej) => {

        const store = new NodeStorage(source.path);

        let config = store.get('config');
        if (!config) {
            config = defaultConfig;
            store.put("config", defaultConfig);
        }
        res(config)

    })
};



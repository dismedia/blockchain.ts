import {from, Observable} from "rxjs/index";
import {mergeMap} from "rxjs/operators";
import {PromiseFromObject} from "../../mics/abstract";
import {ConfigData} from "../configData";

export interface ConfigSource {
    path: string
}

export interface ConfigLoader {
    (source: Observable<ConfigSource>): Observable<ConfigData>;
}


export const storageConfigLoader: (loader: PromiseFromObject<ConfigSource, ConfigData>) => ConfigLoader = (loader: PromiseFromObject<ConfigSource, ConfigData>) => {
    return (source: Observable<ConfigSource>) => source.pipe(mergeMap(config => from(loader(config))));

};





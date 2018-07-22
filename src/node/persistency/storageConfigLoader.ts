import {from, Observable} from "rxjs/index";
import {mergeMap} from "rxjs/operators";
import {nodeStorage} from "./nodeStorageConfigLoader/nodeStorage";
import {PromiseFromObject} from "../../mics/abstract";


export interface ConfigData {
}

export interface ConfigSource{
    path:string
}

export interface ConfigLoader{
    (source:Observable<ConfigSource>):Observable<ConfigData>;
}


export const storageConfigLoader:(loader:PromiseFromObject<ConfigSource,ConfigData>)=> ConfigLoader = (loader:PromiseFromObject<ConfigSource,ConfigData>) => {

    return (source: Observable<ConfigSource>) => source.pipe(mergeMap(config=>from(loader(config))));


}





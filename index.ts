
import {from} from "rxjs";
import {storageConfigLoader} from "./src/node/persistency/storageConfigLoader";
import {nodeStorage} from "./src/node/persistency/nodeStorageConfigLoader/nodeStorage";



const path=from([{path:"config/first.config"},{path:"config/second.config"}])

storageConfigLoader(nodeStorage)(path).subscribe(a=>console.log(a));




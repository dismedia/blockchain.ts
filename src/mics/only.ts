import {pipe} from "rxjs/index";
import {bufferCount, filter, take} from "rxjs/internal/operators";

export const only = (...k) => pipe(
    filter((e, i) => k.some((a) => a == i)),
    bufferCount(k.length),
    take(1)
)
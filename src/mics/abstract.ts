export interface PromiseFromObject<Obj,Result>{
    (source:Obj):Promise<Result>
}
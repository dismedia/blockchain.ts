export interface BlockData {

}

export interface Block {
    hash: string;
    previousHash: string;
    data: BlockData;
    nonce: number;
    timestapm: number;
}
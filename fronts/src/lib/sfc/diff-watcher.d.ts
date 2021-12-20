import { SFCBlock, SFCDescriptor } from './index';
export declare class SFCDiffWatcher {
    private prevMap;
    add(filename: string, content: string): SFCDescriptor;
    remove(filename: string): void;
    diff(filename: string, content: string): SFCDiff;
}
export declare class SFCDiff {
    private prev;
    private curr;
    constructor(prev: SFCDescriptor, curr: SFCDescriptor);
    template(cb: (block: SFCBlock | null) => void): this;
    script(cb: (block: SFCBlock | null) => void): this;
    styles(cb: (blocks: SFCBlock[]) => void): this;
    customBlocks(name: string, cb: (blocks: SFCBlock[]) => void): this;
    private hasDiff(prev, curr);
    private hasListDiff(prev, curr);
}

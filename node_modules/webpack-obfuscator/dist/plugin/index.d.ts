import { Compiler } from 'webpack';
import { ObfuscatorOptions } from 'javascript-obfuscator';
export declare type WebpackObfuscatorOptions = Omit<ObfuscatorOptions, 'inputFileName' | 'sourceMapBaseUrl' | 'sourceMapFileName' | 'sourceMapMode' | 'sourceMapSourcesMode'>;
export declare class WebpackObfuscatorPlugin {
    options: WebpackObfuscatorOptions;
    static readonly loader: string;
    private static allowedExtensions;
    private static readonly baseIdentifiersPrefix;
    excludes: string[];
    constructor(options?: WebpackObfuscatorOptions, excludes?: string | string[]);
    apply(compiler: Compiler): void;
    private shouldExclude;
    private extractSourceAndSourceMap;
    private obfuscate;
}

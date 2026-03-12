"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const javascript_obfuscator_1 = __importDefault(require("javascript-obfuscator"));
const loader_utils_1 = __importDefault(require("loader-utils"));
const path = __importStar(require("path"));
function Loader(sourceCode) {
    const context = this;
    const relativePathOfModule = path.relative(context.rootContext, context.resourcePath);
    const options = loader_utils_1.default.getOptions(context) || {};
    const obfuscationResult = javascript_obfuscator_1.default.obfuscate(sourceCode, Object.assign(Object.assign({}, options), { ignoreRequireImports: true, inputFileName: relativePathOfModule, sourceMapMode: 'separate' }));
    return obfuscationResult.getObfuscatedCode();
}
module.exports = Loader;

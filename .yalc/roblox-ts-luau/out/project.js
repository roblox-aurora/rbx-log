"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWallyToml = void 0;
var fs_extra_1 = __importDefault(require("fs-extra"));
var toml_1 = __importDefault(require("@iarna/toml"));
function generateWallyToml(wallyConfig, version, file) {
    var wallyToml = {
        package: {
            name: wallyConfig.username + "/" + wallyConfig.packageName,
            description: wallyConfig.description,
            realm: wallyConfig.realm,
            license: wallyConfig.license,
            registry: wallyConfig.registry,
            authors: wallyConfig.authors,
            version: version,
        }
    };
    fs_extra_1.default.writeFileSync(file, toml_1.default.stringify(wallyToml));
}
exports.generateWallyToml = generateWallyToml;

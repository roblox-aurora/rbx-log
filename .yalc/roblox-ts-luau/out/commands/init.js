"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var yargs_1 = __importDefault(require("yargs"));
var prompts_1 = __importDefault(require("prompts"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var identity_1 = require("../identity");
var path_1 = __importDefault(require("path"));
var hjson_1 = __importDefault(require("hjson"));
var project_1 = require("../project");
function cleanName(name) {
    return name.replace("@", "").replace("/", "-");
}
function init(argv) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var cwd, workingPath, distPath, tsconfig, packageJson, packageInfo, tsconfigInfo, wallyConfigs, fullName, configuration, rojoConfig, jsonConfig;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    cwd = path_1.default.join(process.cwd(), argv.rootPath);
                    workingPath = path_1.default.join(cwd, argv.luauDir);
                    distPath = path_1.default.join(workingPath, "dist");
                    tsconfig = path_1.default.join(cwd, "tsconfig.json");
                    packageJson = path_1.default.join(cwd, "package.json");
                    if (!fs_extra_1.default.existsSync(packageJson)) {
                        return [2 /*return*/];
                    }
                    if (!fs_extra_1.default.existsSync(tsconfig)) {
                        return [2 /*return*/];
                    }
                    packageInfo = require(packageJson);
                    tsconfigInfo = hjson_1.default.parse(fs_extra_1.default.readFileSync(tsconfig).toString());
                    fs_extra_1.default.ensureDirSync(distPath);
                    if (!fs_extra_1.default.pathExistsSync(workingPath)) {
                        fs_extra_1.default.mkdirSync(workingPath);
                    }
                    return [4 /*yield*/, prompts_1.default([
                            {
                                name: "publishName",
                                type: "text",
                                message: "What github username do you want to publish the package under?",
                            },
                            {
                                name: "packageName",
                                type: "text",
                                message: "What do you want to name the package?",
                                initial: (_a = argv.packageName) !== null && _a !== void 0 ? _a : cleanName(packageInfo.name),
                            },
                        ])];
                case 1:
                    wallyConfigs = _b.sent();
                    fullName = wallyConfigs.publishName + "/" + wallyConfigs.packageName;
                    configuration = identity_1.identity({
                        wally: {
                            username: wallyConfigs.publishName,
                            packageName: wallyConfigs.packageName,
                            license: packageInfo.license,
                            registry: "https://github.com/upliftgames/wally-index",
                            authors: [wallyConfigs.publishName],
                            realm: "shared",
                            description: packageInfo.description,
                        },
                        build: {
                            outDir: tsconfigInfo.compilerOptions.outDir,
                        },
                    });
                    rojoConfig = identity_1.identity({
                        name: wallyConfigs.packageName,
                        tree: {
                            $path: ".",
                        },
                    });
                    jsonConfig = { quotes: "all", separator: true, space: "\t", bracesSameLine: true };
                    fs_extra_1.default.writeFileSync(path_1.default.join(cwd, "luau-config.json"), hjson_1.default.stringify(configuration, jsonConfig));
                    fs_extra_1.default.writeFileSync(path_1.default.join(distPath, "default.project.json"), hjson_1.default.stringify(rojoConfig, jsonConfig));
                    project_1.generateWallyToml(configuration.wally, packageInfo.version, path_1.default.join(distPath, "wally.toml"));
                    return [2 /*return*/];
            }
        });
    });
}
module.exports = identity_1.identity({
    command: "init",
    describe: "Setup Luau project",
    builder: function () {
        return yargs_1.default
            .option("rootPath", {
            type: "string",
            describe: "The path of your project - defaults to current directory",
            default: ".",
        })
            .option("luauDir", {
            default: "luau",
            describe: "The name of the Luau directory",
            type: "string",
        })
            .option("packageName", {
            describe: "The name of the package",
            type: "string",
        });
    },
    handler: function (argv) { return init(argv); },
});

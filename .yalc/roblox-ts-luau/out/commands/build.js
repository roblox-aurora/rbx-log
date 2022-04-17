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
var fs_extra_1 = __importDefault(require("fs-extra"));
var identity_1 = require("../identity");
var path_1 = __importDefault(require("path"));
var hjson_1 = __importDefault(require("hjson"));
var execa_1 = __importDefault(require("execa"));
var util_1 = __importDefault(require("util"));
var project_1 = require("../project");
var copy_1 = __importDefault(require("copy"));
var copy = util_1.default.promisify(copy_1.default);
function build(argv) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var rootPath, luauPath, luauDistPath, luauOutputPath, luauArtefactPath, config, configuration, packageJson, projectPath, result, copyCallback, _i, _b, packageName;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    rootPath = path_1.default.join(process.cwd(), argv.rootPath);
                    luauPath = path_1.default.join(rootPath, argv.luauDir);
                    luauDistPath = path_1.default.join(luauPath, "dist");
                    luauOutputPath = path_1.default.join(luauPath, "out");
                    luauArtefactPath = path_1.default.join(luauPath, "artefacts");
                    config = path_1.default.join(rootPath, "luau-config.json");
                    if (!fs_extra_1.default.existsSync(config)) {
                        return [2 /*return*/];
                    }
                    configuration = hjson_1.default.parse(fs_extra_1.default.readFileSync(config).toString());
                    packageJson = require(path_1.default.join(rootPath, "package.json"));
                    console.log("generating wally.toml...");
                    project_1.generateWallyToml(configuration.wally, packageJson.version, path_1.default.join(luauDistPath, "wally.toml"));
                    projectPath = path_1.default.join(luauPath, "build.project.json");
                    if (!fs_extra_1.default.existsSync(projectPath)) {
                        return [2 /*return*/];
                    }
                    result = execa_1.default.command("rbxtsc --verbose --type=model --rojo=\"" + projectPath + "\"");
                    (_a = result.stdout) === null || _a === void 0 ? void 0 : _a.on("data", function (data) {
                        process.stdout.write("" + data);
                    });
                    return [4 /*yield*/, result];
                case 1:
                    _c.sent();
                    console.log("compiled " + configuration.wally.packageName);
                    copyCallback = function (prefix) {
                        if (prefix === void 0) { prefix = "emit"; }
                        return function (err, files) {
                            if (files) {
                                for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                                    var file = files_1[_i];
                                    console.log(prefix, file.path);
                                }
                            }
                            if (err) {
                                console.error(err);
                            }
                        };
                    };
                    console.log("copying output files...");
                    return [4 /*yield*/, copy(path_1.default.join(rootPath, configuration.build.outDir) + "/**/*.lua", path_1.default.join(luauOutputPath, "dist"))];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, copy(luauDistPath + "/*.*", luauOutputPath)];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, copy(rootPath + "/include/*.lua", path_1.default.join(luauOutputPath, "dist", "TS"))];
                case 4:
                    _c.sent();
                    _i = 0, _b = Object.entries(packageJson.dependencies);
                    _c.label = 5;
                case 5:
                    if (!(_i < _b.length)) return [3 /*break*/, 8];
                    packageName = _b[_i][0];
                    return [4 /*yield*/, copy(rootPath + "/node_modules/" + packageName + "/**/*.lua", path_1.default.join(luauOutputPath, "dist", "TS", packageName))];
                case 6:
                    _c.sent();
                    _c.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8:
                    fs_extra_1.default.ensureDir(luauArtefactPath);
                    execa_1.default.commandSync("wally package --project-path " + luauOutputPath + " --output " + path_1.default.join(luauArtefactPath, configuration.wally.packageName + "-luau.zip"));
                    execa_1.default.commandSync("rojo build " + projectPath + " --output " + path_1.default.join(luauArtefactPath, configuration.wally.packageName + "-luau.rbxm"));
                    if (argv.publish) {
                    }
                    return [2 /*return*/];
            }
        });
    });
}
module.exports = identity_1.identity({
    command: "build",
    describe: "Build Luau project",
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
            .option("publish", {
            type: "boolean",
            default: false,
        });
    },
    handler: function (argv) { return build(argv); },
});

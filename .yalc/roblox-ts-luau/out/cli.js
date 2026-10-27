#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var yargs_1 = __importDefault(require("yargs"));
void yargs_1.default
    // help
    .usage("rbxts-luau - A Roblox TypeScript to Luau package converter")
    .help("help")
    .alias("h", "help")
    .describe("help", "show help information")
    // version
    .version(require("../package.json").version)
    .alias("v", "version")
    .describe("version", "show version information")
    // commands
    .commandDir("commands")
    .demandCommand()
    .parse();

import { readFileSync, writeFileSync } from "fs";

const manifestFilePath = "./dist/manifest.json";
const versionsFilePath = "./versions.json";

const targetVersion = process.env.npm_package_version;

// read minAppVersion from manifest.json and bump version to target version
let manifest = JSON.parse(readFileSync(manifestFilePath, "utf8"));
const { minAppVersion } = manifest;
manifest.version = targetVersion;
writeFileSync(manifestFilePath, JSON.stringify(manifest, null, "\t"));

// update versions.json with target version and minAppVersion from manifest.json
let versions = JSON.parse(readFileSync(versionsFilePath, "utf8"));
versions[targetVersion] = minAppVersion;
writeFileSync(versionsFilePath, JSON.stringify(versions, null, "\t"));

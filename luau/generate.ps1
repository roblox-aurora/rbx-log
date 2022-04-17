param(
    [switch] $Publish
)

# ===============================================
# TypeScript to Luau generator script for CI
# by Jonathan Holmes (Vorlias)
# 2021
# ===============================================
$package = Get-Content package.json | ConvertFrom-JSON
$cwd = Get-Location


if (-not (Test-Path "node_modules")) {
    npm install
}

$build = "out"
npm run build:luau

Push-Location $PSScriptRoot

if (Test-Path "out") {
    Remove-Item -Force -Recurse $build
}

# mkdir -p out/dist/TS
New-Item -ItemType Directory -Force -Path $build\dist

# mkdir -p out/dist/TS
New-Item -ItemType Directory -Force -Path $build\dist\TS

# cp -r ../include/* out/dist/TS
Copy-Item -Recurse ..\include\* $build\dist\TS



$dependencies = $package.dependencies
foreach ($dependency in $dependencies.PSObject.Properties) {
    # $dependency.Name
    Copy-Item -Path "$cwd/node_modules/$($dependency.Name)" -Destination $build\dist\TS\node_modules\$($dependency.Name) -Recurse
} 


# cp -r ../out/* out/dist
Copy-Item -Recurse ..\$build\* $build\dist

# find out/dist -name '*.d.ts' -delete
Get-ChildItem $build/dist/*.d.ts -Recurse | ForEach-Object { Remove-Item $_ }


# cp -r dist/* out
Copy-Item -Recurse dist/* $build

# Generate Artefacts
New-Item -ItemType Directory -Force -Path artefacts

wally package --project-path $build --output artefacts/log.zip
rojo build build.project.json -o artefacts/log.rbxm

if ($Publish) {
    wally publish --project-path $build
}

Pop-Location
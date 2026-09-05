# တီၢ်လိကညီကျိာ် — Desktop Release Guide

## What users receive

Windows:
- `တီၢ်လိကညီကျိာ်-1.1.0-windows-x64.exe` — normal installer
- `တီၢ်လိကညီကျိာ်-1.1.0-Windows-x64-Portable.exe` — portable version

macOS:
- `တီၢ်လိကညီကျိာ်-1.1.0-mac-x64.dmg`
- `တီၢ်လိကညီကျိာ်-1.1.0-mac-arm64.dmg`
- ZIP versions are also produced.

## Build native installers

Native Windows and macOS installers must be built on their respective operating systems. This repository includes GitHub Actions under `.github/workflows/`.

1. Create a GitHub repository.
2. Upload this project.
3. Push the project.
4. Open GitHub → Actions.
5. Run `Build တီၢ်လိကညီကျိာ် Installers`.
6. Download the Windows and macOS artifacts.

For a public download page, create a release tag such as `v1.1.0` and use the generated release assets.

## Important

The Karen Literacy Keyboard mapping is embedded in the application. Users do not need to install a separate Karen keyboard to use the typing trainer.

This is an in-app keyboard, not a system-wide Windows/macOS input method.

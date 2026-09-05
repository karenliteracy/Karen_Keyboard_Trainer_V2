တီၢ်လိကညီကျိာ် — Desktop Educational Application

Version 1.2.0

NEW: TRUE TWO-LAYER KAREN KEYBOARD TRAINING
- Every physical key displays its normal and Shift character.
- Example: R = မ; Shift+R = ၤ.
- Learn Keys can ask for either layer.
- Shift lights up when a shifted character is required.
- The target key is highlighted.
- Finger guidance is shown for letter keys.
- Clicking Shift then R enters ၤ.
- Physical Shift+R enters ၤ.
- Typing practice uses the embedded Karen mapping automatically.

Users do not need to install a separate Karen keyboard to use the learning app.

DESKTOP BUILD
The project uses Electron + electron-builder.

Windows:
  npm install
  npm run dist:win

macOS:
  npm install
  npm run dist:mac

GITHUB
See GITHUB_SETUP_STEP_BY_STEP.md. GitHub Actions is configured to build Windows installers and macOS DMG/ZIP packages. Tag a release such as v1.2.0 to publish downloadable release files.

For signed/notarized public macOS distribution, Apple Developer signing credentials are required.

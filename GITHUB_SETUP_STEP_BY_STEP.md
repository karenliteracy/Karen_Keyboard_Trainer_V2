# GitHub setup for တီၢ်လိကညီကျိာ်

This project is ready to be stored in a GitHub repository and built by GitHub Actions.

## Recommended: GitHub Desktop (easiest on Windows)

1. Install **GitHub Desktop** and sign in.
2. Extract the ZIP so you have a folder named `Karen_Keyboard_Trainer_V2` containing `package.json`.
3. Open GitHub Desktop.
4. Choose **File → Add local repository**.
5. Choose the `Karen_Keyboard_Trainer_V2` folder.
6. If asked to create a repository, choose **Create a repository**.
7. Repository name: `te-li-karen-keyboard-academy`
8. Description: `တီၢ်လိကညီကျိာ် — Karen keyboard learning and typing academy`
9. Choose **Public** if you want the project/release to be public.
10. Click **Publish repository**.

GitHub's official documentation says GitHub Desktop can create a local repository and publish it to GitHub.

## After publishing

Open your repository on GitHub and click **Actions**. The repository already contains:

`.github/workflows/build-installers.yml`

and

`.github/workflows/release.yml`

The build workflow can be run manually and creates Windows and macOS artifacts.

## Make a real downloadable release

In the project folder, change the version in `package.json` when ready, for example:

`1.2.0`

Then in GitHub Desktop:

1. Commit the changes.
2. Push to GitHub.
3. Create a tag named `v1.2.0` (or another version).
4. Push the tag.

The release workflow runs on a `v*` tag and publishes the Windows and macOS build files to a GitHub Release.

The public download page can then link to that GitHub Release.

## PowerShell alternative (if Git is installed)

Open PowerShell in the project folder:

```powershell
git init
git add .
git commit -m "Initial release of တီၢ်လိကညီကျိာ်"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/te-li-karen-keyboard-academy.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.

For the first release:

```powershell
git tag v1.2.0
git push origin v1.2.0
```

## Important keyboard behavior

The application embeds the Karen Literacy two-layer mapping. For example, the R key contains:

- Normal: `မ`
- Shift: `ၤ`

Typing `R` produces `မ`.
Typing `Shift+R` produces `ၤ`.
Clicking the on-screen Shift key and then R also produces `ၤ`.

The Learn Keys screen can deliberately ask for either the normal or Shift layer. When a Shift character is requested, the app highlights Shift and the target key and shows a finger hint.

## Important GitHub security rule

Do not commit passwords, API keys, signing certificates, or other secrets. GitHub's documentation specifically warns against adding sensitive information to repositories.

## macOS distribution note

GitHub can build the `.dmg` and `.zip`, but a polished public macOS release normally also uses Apple Developer signing/notarization. Those credentials should be stored as GitHub Actions secrets, never in the repository.

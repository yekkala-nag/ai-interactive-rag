# Mobile Application Guide (Android & iOS)

This project has been converted into cross-platform native **Android** and **iOS** applications powered by **Capacitor**.

---

## 📱 Project Structure

- `android/`: Native Android project (Gradle, Kotlin, Android Studio).
- `ios/`: Native iOS project (Swift, Xcode workspace).
- `capacitor.config.json`: Configuration for app name, ID, splash screen, status bar, and server options.
- `dist/`: Compiled web application assets synced automatically to native containers.

---

## 🚀 Quick Start Commands

```bash
# 1. Build web app & sync to native Android & iOS projects
npm run cap:build

# 2. Open Android project in Android Studio
npm run cap:android

# 3. Open iOS project in Xcode (macOS only)
npm run cap:ios
```

---

## 🤖 Android Guide

### Prerequisites
- [Android Studio](https://developer.android.com/studio) installed.
- Java Development Kit (JDK 17 or higher).
- Android SDK & Build Tools installed via Android Studio SDK Manager.

### Running on Android Studio / Emulator
1. Run `npm run cap:android` (or open the `android/` directory in Android Studio).
2. Wait for Gradle Sync to complete.
3. Select an Emulator (e.g., Pixel 6) or connected Physical Android Device from the top toolbar.
4. Click the **Run** button (Green Play icon) or press `Shift + F10`.

### Building APK / Android App Bundle (AAB) for Production
1. In Android Studio, go to **Build > Generate Signed Bundle / APK**.
2. Select **Android App Bundle** (for Google Play Store) or **APK** (for direct installation).
3. Follow the wizard to create/select your keystore signature and export the `.aab` or `.apk` file.

Alternatively via CLI:
```bash
cd android
./gradlew assembleRelease # Generates APK in android/app/build/outputs/apk/release/
./gradlew bundleRelease   # Generates AAB in android/app/build/outputs/bundle/release/
```

---

## 🍏 iOS Guide

### Prerequisites
- macOS operating system.
- [Xcode](https://developer.apple.com/xcode/) installed from Mac App Store.
- CocoaPods / Swift Package Manager (managed automatically by Capacitor).

### Running on Xcode / iOS Simulator
1. Run `npm run cap:ios` (or open `ios/App/App.xcworkspace` in Xcode).
2. Select a Simulator (e.g., iPhone 15 Pro) or connected iPhone/iPad.
3. Click the **Play** button (`Cmd + R`) to run the application.

### Running on a Physical iOS Device
1. Connect your iPhone via USB.
2. In Xcode, select your project `App` target on the left sidebar.
3. Under **Signing & Capabilities**, select your **Development Team** (Apple ID / Developer account).
4. Select your connected device from the device picker and press **Run**.

### Building for App Store / TestFlight
1. In Xcode, select **Product > Archive**.
2. Once archiving completes, click **Distribute App** in the Organizer window.
3. Follow the prompts to upload directly to TestFlight & App Store Connect.

---

## 🔄 Development Workflow

Whenever you edit web source code (`src/App.jsx`, styles, components, etc.):

1. Rebuild and sync changes to native apps:
   ```bash
   npm run cap:build
   ```
2. Re-run or refresh the app in Android Studio / Xcode!

---

## 🎨 Customizing App Icon & Splash Screen

You can automatically generate all resolution icons and splash screens for both Android & iOS using `@capacitor/assets`:

```bash
# Install asset generator CLI
npm install -D @capacitor/assets

# Place your high-res logo (1024x1024) at assets/logo.png and splash (2732x2732) at assets/splash.png
npx cap generate
```

# Watoo
## Pitch de l'app

L'application Watoo permet à son utilisateur de localiser des points d'eau potable via la géolocalisation.<br/>
Si un utilisateur se trouve à côté d'un point d'eau, il n'a qu'à ouvrir l'application Watoo, une carte s'ouvre alors à lui, puis il marque le point d'eau sur celle-ci.<br/>
Les autres utilisateurs possédants l'application pourront alors voir apparaître ce point d'eau sur leur carte.


## Blocages
### Cordova
* Documentation Cordova en cours de remaniement

### Android
* Emulation -> résolu avec Homebrew
* Installation de dépendance pour compiler Android -> résolu en installant la dépendance ANT

### iOS
* iOS/Android: installation du plugin Camera -> erreurs de javascript

### Tous les OS
* Suppression de l'ancien curseur quand on relance la localisation
* Problème technique sur plugin globalization

### Git
* Conflits et gestion du gitignore

## Installation

Clone Watoo repo:

```console
$ git clone https://github.com/Jerome1337/IESA153A-Watoo.git
```

<br/>
You will need to download app dependencies (platform + plugins).

```console
$ cordova platform add ios
$ cordova platform add android
```

Add the plugins

```console
$ cordova plugin add org.apache.cordova.camera
$ cordova plugin add org.apache.cordova.geolocation
$ cordova plugin add org.apache.cordova.statusbar
$ cordova plugin add org.apache.cordova.contacts
$ cordova plugin add org.apache.cordova.device-orientation
$ cordova plugin add com.unarin.cordova.beacon
```

<br/>

There is some Cordova commands:

```console
$ cordova prepare
$ cordova compile
$ cordova build   // run cordova prepare and compile at the same time
$ cordova emulate ios/android  // Test the App on an Emulator or Device
$ cordova plugins ls  // List all your installed plugins
```

**You're done ! Let's code**

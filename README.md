# Bike Raleigh

Bike Raleigh is an app built on [Ionic](http://ionicframework.com/), an advanced HTML5 hybrid mobile app framework.  

### Set up local environment

- Install [Node.js](https://nodejs.org/en/)
- Install the latest Cordova and Ionic command line tools:  
    ```
    $ npm install -g cordova ionic
    ```  
   *OSX/Linux users may need to prefix the command with sudo.*  
   *Follow the Android and iOS platform guides to install required platform dependencies.*

### Run app locally

- clone repo: `git clone git@github.com:codeforraleigh/bike-raleigh.git`
- cd into repo: `cd bike-raleigh`
- create a branch: `git checkout -b yourbranchnamehere`
- to run in browser: `ionic serve`
- to run emulator : `ionic emulate ios` *or* `ionic emulate android`  
for live reloading in emulator add: `--livereload`  
    - *if you have trouble with emulator these commmands may be required:*  
`$ ionic platform add ios`  
`$ ionic build ios`

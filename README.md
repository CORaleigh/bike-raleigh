# Bike Raleigh

Bike Raleigh is an app built on [Ionic](http://ionicframework.com/), an advanced HTML5 hybrid mobile app framework.  

**To track our progress, add issues, and even help out - check out our [Waffle Board](https://waffle.io/codeforraleigh/bike-raleigh).**

Have a question or just want to join the conversation, hop in our [Slack Room](https://cfnc.slack.com/messages/bike-raleigh/).

Interested? Join us at [Triangle Code for America Raleigh Hack Nights](http://www.meetup.com/Triangle-Code-for-America/) - everyone is welcome :)

### Contributing
Please keep Pull Requests limited to a single issue.

**Team Members**  
When beginning work - assign an issue to yourself and move it to in progress (if in GitHub add the 'in progress' label).  
Create a new branch.  
Submit a PR referencing the issue number (ex. "closes #4") for code review.  
Delete the branch after the code is merged.

**Non-Team Members**  
Fork Repo, make your changes, then submit a PR referencing the issue number (ex. "closes #4") for code review and merging.

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

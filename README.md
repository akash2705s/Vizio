## Folder Structure

- `assets` folder will contain assets like images, fonts, videos etc
- `components` folder will contain view specific and re-usable components
- `config` folder will contain configuration settings
- `layout` folder will contain view layout wrappers
- `routes` folder will contain app wide route and views configuration
- `theme` folder will contain styling of views / components
- `services` folder will contain APIs and external services calls
- `utils` folder will contain helper functions to perform required operations
- `views` folder will contain module/screen wise views of the app

<br />

## Setup the codebase

**Install all the packages and dependencies:**

`npm install`

Then copy the .env-sample and save it with .env file, and fill in the configuration settings.

<br />

## Run the application

**Run the app:**

`npm start`

**Check source code errors:**

`npm run lint`

**Build the app for Samsung TV:**

- **Reference**
  - `https://docs.tizen.org/application/tizen-studio/setup/prerequisites/`
  - `https://developer.tizen.org/development/tizen-studio/download`
  - `https://docs.tizen.org/application/tizen-studio/setup/install-sdk/`
- **Before run the build command**
  - make sure install tizen-studio and create certificate from it.
  - make sure developer mode on your Samsung TV and put your device IP address in **Host PC IP**
  - launch device manager from tizen studio and connect to your Samsung TV
- **Replace variable with actual value**
  - CERTIFICATE_NAME: tizen certificate name
  - TV_IP_ADDRESS: target device ip address

`npm run build:samsung`

Above command will generate .wgt file which needs to install app in Samsung TV.

**Install the app for Samsung TV:**

- If you want to install app in Targeted Samsung TV then run install command after build command
`npm run install:samsung`

**Build the app for LG TV:**

- **Reference**
  - `https://webostv.developer.lge.com/develop/getting-started/developer-mode-app`
- **Before run the build command**
  - Make sure you have follow **Installing Developer Mode app** from above link
- **Replace variable with actual value**
  - LG_TV_NAME: Replace with your TV name specify while setup device using ares

`npm run build:lg`

Above command will generate IPK file which needs to install app in Targeted LG TV.

**Install the app for LG TV:**

- If you want to install app in Targeted LG TV then run install command after build command

`npm run install:lg`

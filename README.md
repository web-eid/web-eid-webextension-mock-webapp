# web-eid-webextension-mock-webapp

![European Regional Development Fund](https://github.com/open-eid/DigiDoc4-Client/blob/master/client/images/EL_Regionaalarengu_Fond.png)

A Node.js/Express mock web application for testing the Web eID browser extension.

## Setup

1. Install the latest LTS version of Node.js - [https://nodejs.org](https://nodejs.org)
    - **Windows:** Install Node.js via the official installer.
    - **Linux and MacOS:**
      - **Option 1:** Install Node.js and NPM via the official Node.js installer and optionally configure NPM global package path manually.
        ___
        **The following steps can be skipped when running the project locally and when you don't need global packages!**
        The following steps configure the NPM global package path, so that installing packages globally and running them does not require root or `sudo`.
        If you wish to run this project as a service on a server, then the recommended approach is to use a globally installed [PM2](https://pm2.keymetrics.io) and then the following steps are necessary.
        1. On the command line, in your home directory, create a directory for global installations:
            ```bash
            mkdir ~/.npm-global
            ```
        2. Configure npm to use the new directory path:
            ```bash
            npm config set prefix '~/.npm-global'
            ```
        3. In your preferred text editor, open or create a `~/.profile` file and **add this line**:
            ```bash
            export PATH=~/.npm-global/bin:$PATH
            ```
        4. On the command line, update your system variables:
            ```bash
            source ~/.profile
            ```
        6. To test your new configuration, install a package globally without using `sudo`
            ```bash
            npm install -g pm2
            ```
    - **Option 2:** Install Node.js and NPM via NVM (Node Version Manager).
      This option is recommended by NPM, but unless you need to switch between different Node.js versions quickly, I would recommend the first option instead.
      Manual configuration is more transparent.

2. Clone the project
    ```bash
    git clone git@github.com:web-eid/web-eid-webextension-mock-webapp.git
    ```
3. Install dependencies
    ```bash
    cd webextension-service-mock
    npm install
    ```
3. Start the service
    ```bash
    npm run start
    ```
4. Optionally use `ngrok` to serve your locally running service mock on an HTTPS connection.
    Get `ngrok` from [https://ngrok.com/](https://ngrok.com/) and run it in a separate terminal.
    ```bash
    ngrok http 3000 --region=eu
    ```
    It should display something similar to this:
    ```bash
    Session Status    online
    Session Expires   7 hours, 59 minutes
    Version           2.3.35
    Region            Europe (eu)
    Web Interface     http://127.0.0.1:4040
    Forwarding        http://e569eb9def37.eu.ngrok.io -> http://localhost:3000
    Forwarding        https://e569eb9def37.eu.ngrok.io -> http://localhost:3000
    ```
    From there, use the HTTPS forwarding URL for testing.

## Development

During development, start the service via `npm run dev`, this will:

- Watch for changes in the project files
- Run the linter when changes occur
- Automatically restart the service

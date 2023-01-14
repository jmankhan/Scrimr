# Scrimr - "Stop Getting Ganked by Scrims"

From managing participants to drafting balanced teams, the Scrimr application aims to reduce time spent organizing fair and fun scrim games.

  ![Scrimr](client\src\assets\logo.png)

## <u>Technologies:</u>

Scrimr is a [React](https://reactjs.org/) web app written using JSX style syntax.

It also leverages the following technologies and tools:

### <u>Backend:</u>

- #### <u>Database:</u>
    - [PostgreSQL](https://www.postgresql.org/) - a free, open source RDBMS
        - [pgAdmin](https://www.pgadmin.org/) - the recommended tool for administrating the PostgreSQL database
- #### <u>ORM:</u>
    - [Prisma](https://www.prisma.io/) - the ORM which maps our database records into data models
- #### <u>Javascript:</u>
    - [Node.js](https://nodejs.org/en/) - a JS runtime environment
        - [npm](https://www.npmjs.com/) - the "Node Package Manager" (comes installed with Node.js)

### </a><u>Frontend:</u>

- #### <u>UI:</u>
    - [Chakra UI](https://chakra-ui.com/) - a modular UI library for React

## <a name="new-developer-checklist:"></a><u>New Developer Checklist:</u>

1. Create a [Github](https://github.com/) account.
2. Download the latest version of [Git](https://git-scm.com/downloads).
3. Download [Visual Studio Code](https://code.visualstudio.com/download).
4. Download [PostgreSQL](https://www.postgresql.org/), [pgAdmin](https://www.pgadmin.org/), and [Node.js](https://nodejs.org/en/).
5. From the command-line (or git bash), clone the project to the current directory with git:
    
        git clone https://github.com/jmankhan/Scrimr.git

## <u>Installation - Development (Windows)</u>

1. Create a Github account
2. Download git bash
3. Download [PostgreSQL](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads) latest version is fine
4. Download [pgadmin](https://www.pgadmin.org/download/pgadmin-4-windows/) latest version is fine
5. You'll probably need to restart, do so now.
6. Open pgadmin4, create a master password. go to the browser 
7. Open git bash, navigate to a directory you want to install, run this command `git clone https://github.com/jmankhan/Scrimr.git` You can also use ssh but you have to configure a few things on your github account. i'd recommend doing that if you have time. if so, use this command `git@github.com:jmankhan/Scrimr.git`
8. Check if you have node by running `node --version` in git bash. if not, download from here: https://nodejs.org/dist/v14.17.0/ x64.msi is what most people need
9. Check if you have npm `npm --version`. if you have node, you should have npm
10. Rest of steps assume you are in git bash and are at the root folder. if you type `ls` you should see this README.md file in your output
11. Run `cd client && npm install` . you can check that it worked by then running `npm start`. a browser tab should open with the scrimr UI.
12. Run `cd ../server && npm install`. 
13. Run `npm install --global nodemon`
14. Run `npx prisma migrate dev`. you can check this worked by looking at pgadmin > postgresql13 > scrimr > schemas > tables. you should see a bunch of tables like "User", "Summoner", etc
15. Finally, you'll need to create a file called .env (don't use notepad to do this, make sure it doesn't end in a .txt extension). You'll need to create a bunch of secret tokens and passwords. 

| Key                 | Value                                                                                                          |
|---------------------|----------------------------------------------------------------------------------------------------------------|
| PG_URL              | [connection string](https://stackoverflow.com/a/52718093/7537946)                                              |
| ACCESS_TOKEN_SECRET | generate jwt token. in git bash, type `node`, then run this command `crypto.randomBytes(64).toString("hex");`. |
| RIOT_API_KEY        | contact me                                                                                                     |
| PORT                | 3001                                                                                                           |
| WHITELISTED_DOMAINS | <http://localhost:3001/,http://localhost:3000>                                                                 |
| EMAIL_FROM          | noreply.scrimr@gmail.com                                                                                       |
| SENDGRID_KEY        | contact me                                                                                                     |
| DOMAIN              | scrimr.herokuapp.com                                                                                           |
| NODE_ENV            | dev                                                                                                            |

16. You can now run a local instance of scrimr. although you can do it with just one terminal window, i recommend you open two. navigate to the server subfolder and type `npm run dev` in the first git bash window. then navigate to the client subfolder and type `npm start` in the second git bash window.
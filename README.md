# Audio Hosting App Frontend

[Link to backend repo](https://github.com/lee-kimmixq/audio-hosting-app-backend)

## To build docker image
```
npm run docker:build
```

## To start up local server
1. Ensure you have the required environment variables in `.env` (refer to `.env.example`)
2. Ensure that backend is running at http://localhost:3000 (or amend `.env` file accordingly)
3. Install npm packages
    ```
    npm install
    ```
4. Run server
    ```
    npm start
    ```
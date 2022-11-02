# FreeSpeech Server

<img width="960" alt="fs-digram" src="https://user-images.githubusercontent.com/18383101/199580206-ddd7bc75-569e-4df3-94ac-c444cd781711.png">

This is the server portion of the FreeSpeech application. This is a private API inteded to be accessed by the FreeSpeech client, and it handles everything from account authentication to project editing and even text to speech synthesis.

FreeSpeech Server currently supports Azure, AWS, and Google Cloud voice synthesis, this gives a wide range of tones, genders, ages, and languages for users to choose from. To connect your instance of FreeSpeech server to these services, simply input your credentials into a .env file in the project directory. See .env.example for a template you can rename to .env for convenience.

## Setup

```
npm install
```

## Lint

```
npm run lint
```

## Test

```
npm run test
```

## Development

```
npm run dev
```

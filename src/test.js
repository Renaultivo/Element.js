let clicks = State(0);

function increment() {
  clicks = clicks+1;
}

const Root = (
  <html>
    <head>
      <meta charset="utf-8" />
    </head>
    <body>
      <h1>You have clicked {clicks} times!</h1>
    </body>
  </html>
);
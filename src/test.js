let status = State("Loading");

<div>Status: {status}</div>

setTimeout(() => {
  status = "Loaded";
}, 2000);
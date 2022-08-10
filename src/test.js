let status = State("Loading");
let oldstatus = 321;

const root = (
  <div>
    <div>Status: {status}</div>
    <div>{status}</div>
    <div>{oldstatus}</div>
  </div>
);

setTimeout(() => {
  status = "Loaded";
}, 2000);
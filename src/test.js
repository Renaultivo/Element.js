const user = {
  name: 'John',
  age: 20
};

console.log("message")
console.log('common message')
console.error('error message')
console.warn('warning message')

const styles = createCSSObject({
  body: {
    top: 0,
    left: 0,
    width: '50%'
  },
  header: {
    height: '200px',
    position: 'fixed',
    backgroundColor: '#222222'
  },
  main: {
    li: {
      color: 'orange'
    }
  }
});

function Header(props) {

  console.log(props);

  return (
    <JSX>
      <header style={styles.header}>
        <nav>
          <ul>
            <li>Logged as  {user.name}</li>
            <li>Home</li>
            <li>Donwloads</li>
            <li>Sign out</li>
          </ul>
        </nav>
      </header>
    </JSX>
  );

}

const Index = (
  <JSX>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Name</title>
      </head>
      <body
        class="flexBoxAlign flexWrap" style={styles.body}>
        <Header data={ user } />
        <div>Let   me      see    how it's      going to     handle      spaces    </div>
      </body>
    </html>
  </JSX>
);

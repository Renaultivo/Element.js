
if (defaultHandlers[intent] != null) {

  // [...]

} else {

  const styles = createCSSObject({
    main: {
      width: '200px',
      height: '120px',
      backgroundColor: 'orange'
    }
  });

  let name = 'Level';

  System.toast.open(
    <div>
      <h1>Hello, World! :D</h1>
      <input type="text" value={10} />
      <div styles={styles.main}>
        <ul>
          <li>Good Evening, {name}!</li>
          <li>{  }</li>
          <li>Test</li>
          <li>Test</li>
        </ul>
      </div>      
    </div>
  );
  
}

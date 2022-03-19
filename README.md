# Element.jsx
A JSX Transpiler - JSX to ElementManager.js functions parser.

### Creating an empty element and add it to body
```javascript

const main = (
  <div id="main">Hello, World!</div>
);

main.addTo(document.body);

```
#### Generated code
```javascript

const main = (
  createElement({
    tag: 'div',
    id: "main",
    content: [
      'Hello, World!',
    ]
  })
);

main.addTo(document.body);

```

### Compile CSSObjects

```javascript

let styles = createCSSObject({
  element: {
    width: '200px',
    height: '200px',
    backgroundColor: 'orange'
  }
});

<div style={styles.element}></div>

```
#### Generated code
```javascript

let styles = {"element":"y_eDHoI"};
createElement({tag:"style",content:'.y_eDHoI {width:200px;height:200px;background-color:orange;} '}).addTo(document.head);

createElement({
  tag: 'div',
  style: styles.element
})

```

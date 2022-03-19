# Element.JSX
JSX to ElementManager.js functions parser.

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
    attributes: {
    
    },
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

let styles = {"element":"_YjzLgZ"};
createElement({tag:"style",content:'._YjzLgZ {width:200px;height:200px;background-color:orange;} '}).addTo(document.head);

createElement({
  tag: 'div',
  style: styles.element,
  attributes: {
  
  },
  content: [
  ]
})

```

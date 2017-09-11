# of-webpack-loaders

This package provides some useful webpack (> 3) loaders.

**How to install**

How to install it in your project:

1. Add the dependency

```shell
npm i --save-dev of-webpack-loaders
```

2. Add a module loader in your webpack configuration:

```js
  // webpack ...
  module: {
      rules: [
        {
            test: /\.html$/,
            use: [
                { loader: 'raw-loader'},
                { loader: 'of-webpack-loaders/svgfile-to-base64-loader' },
                { loader: 'of-webpack-loaders/svgfile-to-string-loader' }
        }
  // ...
```


## svgfile-to-base64-loader

The **svgfile-to-base64** loader parses any source file for svg file paths and returns their
base64 encoded version.

**Example**

```html
  <img class="share-img" src="requireSVGtoB64('assets/myico.svg');" alt="my icon">

  <!-- will output :
    <img class="share-img" src="data:image/svg+xml;base64,0123456789ABCDEF..." alt="my icon">
  -->
```

## svgfile-to-string-loader

The **svgfile-to-string** loader parses any source file for svg file paths and returns their content as a plain string.


**Example**

```html
   requireSVGtoString('assets/myico.svg');

  <!-- will output :
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="...">
        <path d="...."></path>
    </svg>
  -->
```

It is possible to assign some css classes to the final svg:

```html
   requireSVGtoString('assets/myico.svg', 'my class');

  <!-- will output :
    <svg class="my class" xmlns="http://www.w3.org/2000/svg" viewBox="...">
        <path d="...."></path>
    </svg>
  -->
```

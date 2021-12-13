# <div align="center">VueSandbox-wrapper</div>

This package is a standalone port of the [VueSandbox](git@github.com:mekkanix/vue-sandbox-wrapper.git)'s live-testing system.

It is designed to be integrated in an existing codebase, and provides an "out-of-the-box" working Vue component for live-testing Vue components in your application.

*If you're looking for the complete VueSandbox utility, you can find it [here](https://github.com/mekkanix/vue-sandbox).*

# Compatibility

Note that **Vue v2.6.8** or greater is required on your project. Vue 3 is not currently supported.

:warning: Vue is **not** provided in this package and you'll need to inject it manually to the main `VSComponentWrapper` component (as described in the [API Reference](#api-reference) section below).

### Browsers

Here are the minimum browser versions required for this package to work.

**Desktop**

| Chrome | Firefox | Safari | IE         | Edge | Opera |
|:------:|:-------:|:------:|:----------:|:----:|:-----:|
| 18     | 14      | 6.1    | No support | 12   | 15    |

**Smartphone/Tablet**

| iOS Safari | Opera Mini | Opera Mobile | Android Browser | Chrome Android | Firefox Android | UC Browser | Samsung | QQ Browser | Baidu | KaiOS |
|:----------:|:----------:|:------------:|:---------------:|:--------------:|:---------------:|:----------:|:-------:|:----------:|:-----:|:-----:|
| 7          | No support | 59           | 4.4             | 88             | 83              | 12.12      | 4       | 10.4       | 7.12  | 2.5   |

## Installation

Via `npm` or `yarn`:

```
npm i vue-sandbox-wrapper --save
```

```
yarn add vue-sandbox-wrapper
```

## Usage

This package is currently bundled in the [UMD](https://github.com/umdjs/umd) format, meaning it can be integrated to your project in several ways.

*Note: This package currently relies on a Vue.js context present in the hosting project. A full working vanilla-based version will be released later.*

### Module Builder

This is the preferred method to use.

```js
import { VSComponentWrapper } from 'vue-sandbox-wrapper'
import 'vue-sandbox-wrapper/dist/vue-sandbox-wrapper.css'
```

*Note: A plugin-based version (allowing global `VSComponentWrapper` registration) will be released later.*

### HTML `<script>` tags

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/vue-sandbox-wrapper@1.0.0-beta.2/dist/vue-sandbox-wrapper.js"></script>
<link type="text/css" src="https://cdn.jsdelivr.net/npm/vue-sandbox-wrapper@1.0.0-beta.2/dist/vue-sandbox-wrapper.css">
```

## API Reference

#### Component: `VSComponentWrapper`

**Props**

| Name      | Type     | Required | Default | Description |
|:---------:|:--------:|:--------:|:-------:|:-----------:|
| vue       | function | Yes      | -       | The Vue constructor. |
| component | object  | Yes      | -       | Compiled Vue component you want to live-test. |

## Licensing

Released under the [MIT](https://opensource.org/licenses/MIT) license.

## Contribute

Soon...


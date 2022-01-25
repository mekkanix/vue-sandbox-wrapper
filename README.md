# <div align="center">VueSandbox-wrapper</div>

*This package is a Vue-based port of the [VueSandbox](https://github.com/mekkanix/vue-sandbox)'s live-testing system. It is only usable as an importable Vue component ([UMD](https://github.com/umdjs/umd) module), and is designed to be integrated into an existing Vue.js codebase.*

*If you're looking for the complete installable utility, please follow instructions [here](https://mekkanix.github.io/vue-sandbox/docs/).*

---

## Compatibility

### Prerequisites

You'll need the following packages to be installed on your project.

- **Vue v2.6.8** or greater *(Vue3 is not currently supported)*

*Note that Vue.js is not included in order to limit the output bundle size, so you'll need to provide your own Vue constructor when using VS-wrapper (see the [API Reference](#api-reference) for detail).*

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

Through `npm` or `yarn`:

```
npm i vue-sandbox-wrapper --save
```

```
yarn add vue-sandbox-wrapper
```

## Usage

As this package is bundled following the [UMD](https://github.com/umdjs/umd) format, it can be integrated to your project in several ways.

### Module Builder

```js
import { VSComponentWrapper } from 'vue-sandbox-wrapper'
import 'vue-sandbox-wrapper/dist/vue-sandbox-wrapper.css'
```

### HTML `<script>` tags

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/vue-sandbox-wrapper@1.0.0-beta.6/dist/vue-sandbox-wrapper.js"></script>
<link type="text/css" src="https://cdn.jsdelivr.net/npm/vue-sandbox-wrapper@1.0.0-beta.6/dist/vue-sandbox-wrapper.css">
```

## API Reference

This section references all options available when using this package.

### Components

#### > VSComponentWrapper

This is the main component used for live-testing, allowing live-edit of component's props.  
Displays a user-editable area alongside a viewport containing the component's render.

***Props***

| Name           | Type     | Required | Default | Description |
|:--------------:|:--------:|:--------:|:-------:|:-----------:|
| vue            | function | Yes      | -       | The Vue constructor. |
| compiledObject | object   | Yes      | -       | The **compiled** version of the component that needs to be live-tested (more infos [here](https://github.com/vuejs/vue/tree/dev/packages/vue-template-compiler#readme)). |

## Licensing

Released under the [MIT](https://opensource.org/licenses/MIT) license.

## Contribute

Soon...


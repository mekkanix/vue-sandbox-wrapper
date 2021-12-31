# <div align="center">VueSandbox-wrapper</div>

### Disclaimer

This package is a Vue-based port of the **VueSandbox**'s
live-testing system and only contains components needed for that.
This means it **cannot** be used as a locally-installable utility.

If you're looking for such tool, please follow instructions [here](https://github.com/mekkanix/vue-sandbox).

## Introduction

This package contains the core system needed to provide a
components' live-testing feature on your project. It is usable as an importable Vue component (e.g. `VSComponentWrapper`) and is primarily designed to be integrated in an existing Vue.js project.

## Compatibility

### Prerequisites

You'll need the following packages to be installed on your project.

- **Vue v2.6.8** or greater *(Vue3 is not currently supported)*

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

#### # VSComponentWrapper

***Props***

| Name      | Type     | Required | Default | Description |
|:---------:|:--------:|:--------:|:-------:|:-----------:|
| vue       | function | Yes      | -       | The Vue constructor. |
| component | object   | Yes      | -       | The **compiled** version of the component needed for live-test. |

## Licensing

Released under the [MIT](https://opensource.org/licenses/MIT) license.

## Contribute

Soon...


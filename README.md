# <center>VueSandbox-wrapper</center>

This package is a standalone port of [VueSandbox](git@github.com:mekkanix/vue-sandbox-wrapper.git)'s live-testing system.

It is designed to be integrated in an existing codebase, and provides an "out-of-the-box" working component for live-testing Vue components in your application.

*If you're looking for the complete VueSandbox utility, you can find it [here](https://github.com/mekkanix/vue-sandbox).*

# Compatibility

Note that **Vue v2.6.8** or greater *(Vue 3 not currently supported)* is required.

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

### Usage

This package uses the UMD format, so you can either import it through your module bundler (only tested with webpack yet) or include it directly through a `<script>` tag.

#### Module Builder

The main component you'll need to import is nested in the default export.  
You'll also need to import the associated CSS file.

```js
import { VSComponentWrapper } from 'vue-sandbox-wrapper'
import 'vue-sandbox-wrapper/dist/vue-sandbox-wrapper.css'
```

*Note: A installable plugin will be added in a next release to use this component globally without importing it manually.*

#### HTML Tags

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/vue-sandbox-wrapper@1.0.0-beta.1/dist/vue-sandbox-wrapper.js"></script>
<link type="text/css" src="https://cdn.jsdelivr.net/npm/vue-sandbox-wrapper@1.0.0-beta.1/dist/vue-sandbox-wrapper.css">
```

### API Reference

#### VSComponentWrapper

**Props**

| Name                  | Type    | Required | Default | Description |
|:---------------------:|:-------:|:--------:|:-------:|:-----------:|
| vsComponent           | object  | Yes      | -       |             |
| vsComponent.component | object  | Yes      | -       | Compiled Vue component you want to live-test. |
| vsComponent.filepath  | string  | No       | -       | Component's `public/`-relative filepath. |

## Licensing

Released under the [MIT](https://opensource.org/licenses/MIT) license.

## Contribute

Soon...


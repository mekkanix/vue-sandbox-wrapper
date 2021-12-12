## Global

[Priority: 1]

- Allow use:
  - from direct `VSComponentWrapper` import (Vue not needed in bundle)
  - from manual script inclusion (JS-based programmatic way)
  - in the local VueSandbox tool (props-based, slot-based)
- Check for a child-components' rendering strategy
- Check feasibility & create a legacy `<script>`-based version of the pkg (= programmatic way)
- Optimize libs/pkgs/codebase to reduce final bundle size

[Priority: 2]

- Allow global- or window-based Vue usage instead of providing through props

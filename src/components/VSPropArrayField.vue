<template>
  <div
    class="vsc-prop-field-array"
    :class="containerClasses"
  >
    <template v-if="modelValue.length">
      <div
        v-for="(field, i) in modelValue"
        :key="i"
        class="vsc-prop-field-wrapper"
      >

        <!-- Prop: Array -->
        <div
          v-if="field.type === '$array'"
          class="vsc-prop-subarray"
          :class="{ open: field.open, }"
        >
          <div class="vsc-prop-kname-box">
            <div class="vsc-prop-array-index">
              {{ i }}<span class="vsc-prop-arr-index-colon">:</span>
            </div>
            <div
              class="vsc-prop-kname-wrapper"
              :class="{ 'opening-disabled': !field._initialized }"
              @click="onNestedGroupKeyNameClick(field)"
            >
              <FAIcon
                :icon="faIcons.attrCaret"
                class="vs-icon vsc-prop-array-kname-icn"
              />
              <div class="vsc-prop-array-icn">
                <span class="prop-type">Array</span>
                <span class="prop-type-icn" v-show="!field.open">[...]</span>
              </div>
            </div>
            <VSPropToolbar
              class="vsc-prop-array-actions"
              :initialized="field._initialized"
              :editable="false"
              :errored="field._error"
              :to-object="false"
              :to-array="false"
              @edit="onEditPropClick(field)"
              @validate-edit="onValidatePropEditClick(field)"
              @cancel="onCancelPropEditClick(field)"
              @delete="onDeletePropClick(field)"
            />
          </div>
          <VSPropArrayField
            v-show="field.open"
            v-model="field.value"
            :depth="depth + 1"
            :parent-type="field.type"
            @delete-field="onDeletePropClick"
            @reset-fields="resetPropFieldsStates"
          />
        </div>

        <!-- Prop: Object -->
        <template v-else-if="field.type === '$object'">
          <div
            v-if="parentType === '$array'"
            class="vsc-prop-kname-box"
            :class="{ open: field.open, }"
          >
            <div class="vsc-prop-array-index">
              {{ i }}<span class="vsc-prop-arr-index-colon">:</span>
            </div>
            <div
              class="vsc-prop-kname-wrapper"
              :class="{ 'opening-disabled': !field._initialized }"
              @click="onNestedGroupKeyNameClick(field)"
            >
              <FAIcon
                :icon="faIcons.attrCaret"
                class="vs-icon vsc-prop-array-kname-icn"
              />
              <div class="vsc-prop-object-kname">
                <span class="prop-type">Object</span>
                <span v-show="!field.open" class="prop-type-icn">{...}</span>
              </div>
            </div>
            <VSPropToolbar
              class="vsc-prop-actions"
              :initialized="field._initialized"
              :editable="false"
              :errored="field._error"
              :to-object="false"
              :to-array="false"
              @edit="onEditPropClick(field)"
              @validate-edit="onValidatePropEditClick(field)"
              @cancel="onCancelPropEditClick(field)"
              @delete="onDeletePropClick(field)"
            />
          </div>
          <!-- VSPropObjectField -->
          <component
            v-if="objFieldComp"
            :is="objFieldComp"
            v-model="field.value"
            v-show="field.open"
            :depth="depth + 1"
            :parent-type="field.type"
            @delete-field="onDeletePropClick"
            @reset-fields="resetPropFieldsStates"
          />
        </template>

        <!-- Prop: Primitive -->
        <template v-else>
          <div class="vsc-prop-primitive" :class="{ idle: !field._editing, updating: field._editing, }">
            <div class="vsc-prop-array-index">
              {{ i }}<span class="vsc-prop-arr-index-colon">:</span>
            </div>
            <template v-if="field._initialized && !field._editing">
              <div class="vsc-prop-value">
                <VSPrimitiveValue
                  :value="field.value"
                  :type="field.type"
                />
                <VSPropToolbar
                  class="vsc-prop-actions"
                  :initialized="field._initialized"
                  :editing="field._editing"
                  :errored="field._error"
                  :to-object="true"
                  :to-array="true"
                  @edit="onEditPropClick(field)"
                  @validate-edit="onValidatePropEditClick(field)"
                  @cancel="onCancelPropEditClick(field)"
                  @delete="onDeletePropClick(field)"
                  @convert-to-object="onConvertToObjectPropClick(field)"
                  @convert-to-array="onConvertToArrayPropClick(field)"
                />
              </div>
            </template>
            <template v-else>
              <div class="vsc-prop-value">
                <div class="vsc-prop-kv-wrapper vsc-prop-value-wrapper">
                  <input
                    type="text"
                    v-model="field.userValue"
                    ref="inputKeyValue"
                    class="vsc-prop-attr-input input-value xs"
                    :class="{ 'errored': field._initialized && field._error }"
                    :style="keyValueInputStyles"
                    placeholder="value"
                    autocomplete="none"
                    @keyup.enter="onValidatePropEditClick(field)"
                    @keyup.esc="onCancelPropEditClick(field)"
                  />
                  <div class="vsc-prop-v-input v-input-value" ref="vInputKeyValue">{{ field.userValue }}</div>
                </div>
                <VSPropToolbar
                  class="vsc-prop-actions"
                  :initialized="field._initialized"
                  :editing="field._editing"
                  :errored="field._error"
                  :to-object="false"
                  :to-array="false"
                  @edit="onEditPropClick(field)"
                  @validate-edit="onValidatePropEditClick(field)"
                  @cancel="onCancelPropEditClick(field)"
                  @delete="onDeletePropClick(field)"
                />
              </div>
            </template>
          </div>
        </template>
      </div>
    </template>
    <template v-else>
      <div class="vsc-prop-array-blank">(empty)</div>
    </template>
    <div class="vsc-prop-row-actions">
      <span class="vsc-prop-action add-primitive" @click="onAddPropClick()">
        <FAIcon :icon="faIcons.add" class="vs-icon" />
      </span>
      <span class="vsc-prop-action convert2object add-object" @click="onAddPropClick('$object')">
        +{}
      </span>
      <span class="vsc-prop-action convert2array add-array" @click="onAddPropClick('$array')">
        +[]
      </span>
    </div>
  </div>
</template>

<script>
/**
 * VSPropArrayField
 *
 * Component dedicated to array-based props management, by providing
 * a multidimensional form to update Array props in any way.
 * This component uses the "recursive component" system to allow
 * unlimited depth levels.
 */
import { FontAwesomeIcon as FAIcon } from '@fortawesome/vue-fontawesome'
import {
  faPlus,
  faEdit,
  faTrash,
  faTimes,
  faCheck,
  faCaretRight,
} from '@fortawesome/free-solid-svg-icons'
import { isValidPropName, isValidCodePrimitiveValue, } from '@/helpers/Validator.js'
import VSPropToolbar from './VSPropToolbar.vue'
import VSPrimitiveValue from '@/components/VSPrimitiveValue.vue'

export default {
  name: 'VSPropArrayField',
  components: {
    FAIcon,
    VSPropToolbar,
    VSPrimitiveValue,
  },

  props: {
    /**
     * Value used for the current level's v-model behavior.
     *
     * @type {array}
     */
    value: {
      type: Array,
      required: true,
    },
    /**
     * Recursion depth level.
     * Incremented by 1 at each new deeper recursion.
     *
     * @type {number}
     */
    depth: {
      type: Number,
      default: 0,
    },
    /**
     * VS-formatted type of the current field's parent.
     *
     * @type {string}
     */
    parentType: {
      type: String,
      default: null,
    }
  },

  data: () => ({
    /**
     * -
     */
    faIcons: {
      add: faPlus,
      edit: faEdit,
      delete: faTrash,
      cancel: faTimes,
      validate: faCheck,
      attrCaret: faCaretRight,
    },
    /**
     * `VSObjectPropField` component definition filled when needed
     * for nested object-based fields.
     * This dynamic import is required to avoid circular loop between
     * crossed Object/Array static imports.
     *
     * @type {VComponent}
     */
    objFieldComp: null,
    /**
     * Clone of `value` prop, used for v-model updates.
     *
     * @type {mixed}
     */
    modelValue: [],
    /**
     * Bound HTML input used while editing field's value.
     *
     * @type {HTMLElement}
     */
    $inputKeyValue: null,
    /**
     * Bound HTML element of the virtual "value input"'s hidden block.
     *
     * @type {HTMLElement}
     */
    $vInputKeyValue: null,
    /**
     * Computed width of the virtual `$vInputKeyValue` element.
     *
     * @type {HTMLElement}
     */
    vKeyValueInputWidth: 0,
  }),

  computed: {
    /**
     * Component's conditional root element's classes.
     *
     * @return  {object}
     */
    containerClasses () {
      return {
        open: this.open,
        'nested-field': this.depth > 0,
        'parent-array': this.parentType === '$array',
      }
    },
    /**
     * Computed styles of field's "name input" element.
     *
     * @return  {object}
     */
    keyValueInputStyles () {
      return {
        width: `${this.vKeyValueInputWidth}px`,
      }
    },
    /**
     * State property for nested objects.
     *
     * @return  {boolean}
     */
    hasNestedObjectFields () {
      return !!this.modelValue.filter(field => field.type === '$object').length
    },
  },

  watch: {
    modelValue: {
      handler (value) {
        this.$nextTick(() => {
          this.autosetInputsElements()
          this.handleLocalFieldUpdate(value)
          this.$emit('input', value)
        })
      },
      deep: true,
    },
    hasNestedObjectFields (value) {
      if (value) {
        this.objFieldComp = require('@/components/VSPropObjectField.vue').default
      }
    },
  },

  methods: {
    /**
     * Set internal bound & virtual inputs if present in the DOM.
     * Must be called in a `$nextTick` callback to ensure that
     * input elements are rendered.
     *
     * @return  {void}
     */
    autosetInputsElements () {
      this.$inputKeyValue = this.$refs.inputKeyValue && this.$refs.inputKeyValue.length ? this.$refs.inputKeyValue[0] : null
      this.$vInputKeyValue = this.$refs.vInputKeyValue && this.$refs.vInputKeyValue.length ? this.$refs.vInputKeyValue[0] : null
    },
    /**
     * Wrapper method for all DOM-related updates.
     *
     * @return  {void}
     */
    handleLocalFieldUpdate (localValue) {
      this.handleDOMUpdates()
    },
    /**
     * Compute editing inputs' widths from their respective
     * virtual inputs blocks and set values in corresponding `data`
     * fields.
     *
     * @return  {void}
     */
    handleDOMUpdates () {
      if (this.$inputKeyValue && this.$vInputKeyValue) {
        this.vKeyValueInputWidth = this.$inputKeyValue.value ? this.$vInputKeyValue.offsetWidth : 40
      }
    },
    /**
     * Reset fields' states for the current `modelValue` (including all
     * lower-level nested fields).
     * Also emits a "reset-fields" event to trigger upper-level updates.
     *
     * @param {array} nestedValue - Nested fields list used for recursion.
     *
     * @return {void}
     */
    resetPropFieldsStates (nestedValue) {
      let value = nestedValue ? nestedValue : this.modelValue
      for (let [i, field] of value.entries()) {
        field._editing = false
        if (field.type === '$object') {
          this.resetPropFieldsStates(field.value)
        } else if (field.type === '$array') {

        } else {
          if (!field._initialized && (!isValidPropName(field.name) || !isValidCodePrimitiveValue(field.userValue))) {
            value.splice(i, 1)
          } else {
            field._initialized = true
          }
        }
      }
      this.$emit('reset-fields')
    },

    /**
     * Event Handlers
     *
     * Used to handle behaviors from user actions.
     * ---
     * Note: All event handlers can ONLY update field's internal state
     * (not values), which will trigger a top-level `computeLocalFields`
     * call dedicated to all internal values' updates. This is required
     * to ensure fields' udpates at the largest scope and at all nesting
     * levels.
     */

    onEditPropClick (field) {
      this.resetPropFieldsStates()
      this.$emit('edit-field', field)
      field._editing = true
      this.$nextTick(() => {
        this.autosetInputsElements()
        if (this.$inputKeyValue) {
          this.$inputKeyValue.focus()
        }
      })
    },
    onNestedGroupKeyNameClick (field) {
      if (field._initialized) {
        this.resetPropFieldsStates()
        field.open = !field.open
      }
    },
    onCancelPropEditClick (field) {
      field._editing = false
      field._cancelling = true
      field.rawValue = field.initialValue
    },
    onValidatePropEditClick (field) {
      if (!field._error) {
        field._editing = false
        field._validating = true
      }
    },
    onAddPropClick (specialType = null) {
      this.resetPropFieldsStates()
      let newField = null
      if (!specialType) {
        newField = {
          _initialized: false,
          _editing: true,
          _cancelling: false,
          _validating: false,
          _deleting: false,
          _converting: false,
          _error: false,
          type: null,
          name: null,
          value: null,
          rawValue: null,
          userValue: '',
          initialName: null,
          initialValue: null,
        }
      } else {
        if (specialType === '$object') {
          newField = {
            _initialized: true,
            _editing: false,
            _cancelling: false,
            _validating: false,
            _deleting: false,
            _error: false,
            open: false,
            type: '$object',
            name: '',
            value: [],
            rawValue: {},
            initialName: '',
          }
        } else if (specialType === '$array') {
          newField = {
            _initialized: true,
            _editing: false,
            _cancelling: false,
            _validating: false,
            _deleting: false,
            _error: false,
            open: false,
            type: '$array',
            name: null,
            value: [],
            rawValue: [],
            initialName: null,
          }
        }
      }
      this.modelValue.push(newField)
      this.$nextTick(() => {
        this.autosetInputsElements()
        if (this.$inputKeyValue) {
          this.$inputKeyValue.focus()
        }
      })
    },
    onDeletePropClick (field) {
      this.resetPropFieldsStates()
      field._deleting = true
    },
    onConvertToObjectPropClick (field) {
      if (!field._error) {
        field._converting = '$object'
      }
    },
    onConvertToArrayPropClick (field) {
      if (!field._error) {
        field._converting = '$array'
      }
    },
  },

  created () {
    this.modelValue = this.value
  },
}
</script>

<style lang="sass" scoped>
.vsc-prop-field-array
  color: #444

  .vsc-prop-attr-input,
  .vsc-prop-name
    outline: none

  .vsc-prop-kv-wrapper,
  .vsc-prop-kname-wrapper
    position: relative

    .vsc-prop-attr-input
      padding: 0
      font-size: 14px
      box-shadow: none
      border: 1px solid transparent
      border-bottom-color: #8e949a
      border-radius: 0

      &:hover,
      &:focus
        border-bottom-color: #3667ae

      &.errored
        border-bottom-style: solid
        border-bottom-color: #dd0000

    .vsc-prop-v-input
      position: absolute
      top: 25px
      min-width: 40px
      height: 100%
      padding: 0
      white-space: nowrap
      font-size: 14px
      border: 1px solid transparent
      pointer-events: none
      visibility: hidden

  .vsc-prop-actions, .vsc-prop-array-actions, .vsc-prop-row-actions
    display: none
    padding-left: 10px
    align-items: center
    font-size: 11px

    .vsc-prop-action
      width: 21px
      height: 21px
      flex: 0 0 21px
      display: flex
      align-items: center
      justify-content: center
      color: #777
      cursor: pointer

      &:hover
        color: #333

      &.convert2object,
      &.convert2array
        position: relative
        top: -1px
        font-family: 'Source Code Pro', monospace
        font-size: 12px
        font-weight: 700

        span
          position: relative
          top: -1px

  .vsc-prop-array-blank
    padding: 1px 0 1px 15px
    font-size: 14px
    font-style: italic
    color: #999
  .vsc-prop-array-index
    font-size: 14px
    color: #1b1bff
    margin-right: 5px

    .vsc-prop-arr-index-colon
      color: #909090

  // Nested objects-specific content (via CSS class)
  &.nested-field
    position: relative
    padding-left: 22px

    &::before
      content: ''
      display: block
      position: absolute
      top: 0
      bottom: 0
      left: 16px
      background: #bbb
      width: 1px

  // Nested objects
  &.parent-array
    &.open > .vsc-prop-kname-box > .vsc-prop-kname-wrapper > .vsc-prop-array-kname-icn,
    .vsc-prop-kname-box.open > .vsc-prop-kname-wrapper > .vsc-prop-array-kname-icn
      transform: rotate(90deg)

    .vsc-prop-kname-box
      position: relative
      display: flex
      align-items: center
      min-height: 22px
      padding-bottom: 1px
      color: #444
      cursor: pointer

      &:hover .vsc-prop-object-actions
        display: flex

      .vsc-prop-kname-wrapper
        display: flex
        align-items: center

        &.opening-disabled .vsc-prop-array-kname-icn
          color: #aaa

        .vsc-prop-array-kname-icn
          position: absolute
          left: -2px
          top: 6px
        .vsc-prop-object-kname
          display: flex
          padding-left: 9px
          font-size: 14px
        .prop-type
          color: #909090
          font-size: 14px
          font-weight: 700
        .prop-type-icn
          position: relative
          top: 1px
          padding-left: 4px
          font-size: 12px
          color: #909090
          font-weight: 500
          letter-spacing: 0.5px

  // Nested arrays
  .vsc-prop-subarray
    &.open > .vsc-prop-kname-box > .vsc-prop-kname-wrapper > .vsc-prop-array-kname-icn
      transform: rotate(90deg)

    .vsc-prop-kname-box
      position: relative
      display: flex
      align-items: center
      min-height: 22px
      padding-bottom: 1px
      color: #444
      cursor: pointer

      &:hover .vsc-prop-array-actions
        display: flex

      .vsc-prop-kname-wrapper
        display: flex

        &.opening-disabled .vsc-prop-array-kname-icn
          color: #aaa

        .vsc-prop-array-kname-icn
          position: absolute
          left: -2px
          top: 6px
        .vsc-prop-array-kname
          display: flex
          padding-left: 15px
          font-size: 14px
        .vsc-prop-array-icn
          position: relative
          top: 1px
          padding-left: 9px
          font-size: 12px
          color: #909090
          font-weight: 500
          letter-spacing: 0.5px

        .prop-type
          color: #909090
          font-size: 14px
          font-weight: 700

  // Primitive value
  .vsc-prop-primitive
    position: relative
    display: flex
    align-items: center

    &.idle .vsc-prop-name
      border: 1px solid transparent

      .vsc-prop-colon
        margin-left: 1px

      &.vsc-prop-colon
        margin-left: 1px

    &:hover .vsc-prop-actions
      display: flex

    .vsc-prop-name
      display: inline-flex
      align-items: baseline
      margin: 0 5px 0 0
      font-size: 14px

    .vsc-prop-value
      flex: 1 1 auto
      display: flex
      position: relative
      font-size: 14px

      .input-value
        width: auto

  .vsc-prop-kname-box
    &:hover > .vsc-prop-actions
      display: flex

  .vsc-prop-row-actions
    display: flex
    margin-left: 16px
    padding-left: 0
    padding-top: 4px

    &:hover .vsc-prop-action,
    &:hover .vsc-prop-action:not(.add-primitive)
      display: flex

    .vsc-prop-action
      flex: 0 0 auto
      color: #777
      cursor: pointer
      text-align: center

      &.add-primitive
        font-size: 9px

      &:not(.add-primitive)
        display: none
        width: auto
        padding: 0 4px

      &:hover
        color: #333

</style>

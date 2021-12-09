<template>
  <span class="vs-primitive-value" :class="cssClasses">
    {{ codeFormattedValue }}
  </span>
</template>

<script>
import { formatPrimitiveValueToCode, } from '@/helpers/Formatter.js'

/**
 * VSPrimitiveValue
 *
 * Formatted displaying & colors of a primitive `value`, depending
 * of its given `type`.
 */

export default {
  name: 'VSPrimitiveValue',

  props: {
    /**
     * Primitive (raw) value to display.
     *
     * @type {mixed}
     */
    value: {
      type: [Boolean, String, Number, Date,],
    },
    /**
     * VS-formatted type of the primitive value.
     *
     * @type {string}
     */
    type: {
      type: String,
      required: true,
      validator: value => ['boolean', 'string', 'number', 'date', 'null'].includes(value),
    },
  },

  computed: {
    /**
     * "Code"-formatted representation of the current primitive value.
     *
     * @return {string}
     */
    codeFormattedValue () {
      // This is needed because passing an empty string "" to a prop makes Vue convert it to `true`
      const value = this.value === true && this.type === 'string' ? '' : this.value
      return formatPrimitiveValueToCode(value, this.type)
    },
    /**
     * Computed element's classes, applied depending on the current
     * `type`.
     *
     * @return {object}
     */
    cssClasses () {
      return {
        't-null': this.type === 'null',
        't-boolean': this.type === 'boolean',
        't-string': this.type === 'string',
        't-number': this.type === 'number',
        't-date': this.type === 'date',
      }
    },
  },
}
</script>

<style lang="sass" scoped>
.vs-primitive-value
  &.t-null
    color: #ba4b00
  &.t-boolean
    color: #aa3aff
  &.t-string
    color: #148e15
  &.t-number
    color: #ba4b00
</style>

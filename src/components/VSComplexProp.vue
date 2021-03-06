<template>
  <div class="vs-complex-prop">
    <VSPropObjectField
      v-if="type === '$object'"
      v-model="localValue"
      :parent-type="type"
      @reset-fields="resetPropFieldsStates"
    />
    <VSPropArrayField
      v-else-if="type === '$array'"
      v-model="localValue"
      :parent-type="type"
      @reset-fields="resetPropFieldsStates"
    />
  </div>
</template>

<script>
/**
 * VSComplexProp
 *
 * Wrapper component used to centralize management of
 * Object- or Array-based props:
 *   - Auto-detection of provided complex prop type (Object/Array)
 *   - VueSandbox-compliant formatting of provided prop
 *   - Centralized management for prop's updates (additions, deletions,
 *     updates)
 */
import { sortBy, } from 'lodash'
import {
  formatFromNativeStrType,
  formatPrimitiveValueToCode,
  convertPropObjectToFields,
  convertPropArrayToFields,
} from '@/helpers/Formatter.js'
import { isValidPropName, isValidCodePrimitiveValue, } from '@/helpers/Validator.js'
import VSPropObjectField from '@/components/VSPropObjectField.vue'
import VSPropArrayField from '@/components/VSPropArrayField.vue'

export default {
  name: 'VSComplexProp',
  components: {
    VSPropObjectField,
    VSPropArrayField,
  },

  props: {
    /**
     * Component prop's raw value, used as v-model.
     *
     * @type {mixed}
     */
    value: {
      type: [Object, Array,],
      required: true,
    },
  },

  data: () => ({
    /**
     * Component prop's type.
     *
     * @type {string}
     */
    type: null,
    /**
     * Clone of `value` prop, used for v-model updates.
     *
     * @type {mixed}
     */
    modelValue: null,
    /**
     * VS-formatted fields, generated from raw `value` prop.
     * Also used in nested type-specific components
     * (`VSObjectPropField` and `VSArrayPropField`).
     *
     * @type {array}
     */
    localValue: null,
  }),

  watch: {
    value: {
      handler (value) {
        this.type = this.getFormattedType(value)
      },
      deep: true,
    },
    modelValue: {
      handler (value) {
        this.$emit('input', value)
      },
      deep: true,
    },
    localValue: {
      handler (value) {
        let updatedValue = this.computeLocalFields(value)
        // Sorting `localValue` here causes an infinite loop of this watcher,
        // because sorting it changes its internal state and re-call the watcher.
        // TODO:  Maybe use a separate "sort button" feature to avoid this problem.
        this.modelValue = this.formatLocalToModelValue(updatedValue)
      },
      deep: true,
    },
  },

  methods: {
    /**
     * Formats provided raw value into its VS-specific
     * fields equivalent.
     *
     * @param {mixed} initValue - The original raw value.
     *
     * @return {mixed}
     */
    formatToLocalValue (initValue) {
      if (typeof initValue === 'object' && !Array.isArray(initValue)) { // Object
        let formattedValue = convertPropObjectToFields(initValue)
        formattedValue = this.formatToLocalValueFields(formattedValue)
        formattedValue = this.sortLocalFields(formattedValue)
        return formattedValue
      } else { // Array
        let formattedValue = convertPropArrayToFields(initValue)
        formattedValue = this.formatToLocalValueFields(formattedValue)
        return formattedValue
      }
    },
    /**
     * Formats provided VS-formatted `value` by adding
     * some state & control informations to all of its fields.
     *
     * TODO:  As this operation is almost the same as the
     * `convertPropObjectToFields` / `convertPropArrayToFields` helpers,
     * find a way to merge formatting in the same function.
     *
     * @param {array} value - The VueSandbox-formatted value.
     *
     * @return {array}
     */
    formatToLocalValueFields (value) {
      const fields = []
      for (let field of value) {
        let newField = {
          name: field.name,
          type: field.type,
          rawValue: field.rawValue,
          initialName: field.name,
          _initialized: true,
          _editing: field._editing ? field._editing : false,
          _error: field._error ? field._error : false,
          _cancelling: field._cancelling ? field._cancelling : false,
          _validating: field._validating ? field._validating : false,
          _deleting: field._deleting ? field._deleting : false,
        }
        if (['$object', '$array'].includes(field.type)) {
          newField.open = true
          newField.value = this.formatToLocalValueFields(field.value)
        } else {
          newField._converting = field._converting ? field._converting : false
          newField.userValue = formatPrimitiveValueToCode(field.rawValue, field.type)
          newField.value = field.rawValue !== null ? field.rawValue.toString() : null
        }
        fields.push(newField)
      }
      return fields
    },
    /**
     * Formats provided VS-formatted value into its raw value
     * equivalent.
     * Especially used to update local v-model for parent component.
     *
     * @param {array} value - The VS-formatted value to format.
     * @param {string} type - Parent field's type of the currently
     * processed field. Used for recursion processing.
     *
     * @return {mixed}
     */
    formatLocalToModelValue (value, type = null) {
      let localParentType = type ? type : this.type
      let propValue = null
      if (localParentType === '$object') {
        propValue = {}
        for (const field of value) {
          if (field._initialized) {
            if (['$object', '$array',].includes(field.type)) {
              propValue[field.name] = this.formatLocalToModelValue(field.value, field.type)
            } else {
              const fieldName = !field._error && !field._editing ? field.name : field.initialName
              const fieldValue = !field._error && !field._editing ? field.rawValue : field.initialValue
              propValue[fieldName] = fieldValue
            }
          }
        }
      } else {
        propValue = []
        for (const field of value) {
          if (field._initialized) {
            if (['$object', '$array',].includes(field.type)) {
              propValue.push(this.formatLocalToModelValue(field.value, field.type))
            } else {
              const fieldValue = !field._error && !field._editing ? field.rawValue : field.initialValue
              propValue.push(fieldValue)
            }
          }
        }
      }
      return propValue
    },
    /**
     * Main fields' computing method.
     * This method is called each time a change occurs in `localValue`
     * (including all nested values), and perform internal fields'
     * updates depending on their related state
     * (field additions, deletions, etc.).
     *
     * @param {array} localFields - Current processed fields list.
     * @param {string} parentPropType - Parent field's type of the
     * currently processed field. Used for recursion processing.
     *
     * @return {array}
     */
    computeLocalFields (localFields, parentPropType = null) {
      const parentType = parentPropType ?? this.type
      const strNullValue = 'null'
      for (let [i, field] of localFields.entries()) {
        // Object Field updates
        if (field.type === '$object') {
          // - Initialize if validated
          if (field._validating && !field._initialized) {
            field._initialized = true
          }
          if (field._cancelling) {
            if (!field._initialized) {
              this.$delete(localFields, i)
            } else {
              field.name = field.initialName
              field._cancelling = false
            }
          } else {
            if (parentType === '$object') {
              if (isValidPropName(field.name) && this.isUniqueFieldPropName(field.name, localFields)) {
                field._error = false
                if (!field._editing) {
                  field.initialName = field.name
                  field._validating = false
                  field._initialized = true
                }
              } else {
                if (field._editing) {
                  field._error = true
                }
                if (!field._initialized && !field._editing) { // - Delete the field if not editing & not initialized
                  this.$delete(localFields, i)
                }
              }
            } else if (parentType === '$array') {
              // No state to update with "array-in-array" field...
            }
          }
          // - Deleting
          if (field._deleting) {
            this.$delete(localFields, i)
          }
          if (!field._editing && !field._deleting) {
            this.computeLocalFields(field.value, field.type)
          }

        // Array Field updates
        } else if (field.type === '$array') {
          // - Initialize if validated
          if (field._validating && !field._initialized) {
            field._initialized = true
          }
          if (field._cancelling) {
            if (!field._initialized) {
              this.$delete(localFields, i)
            } else {
              field.name = field.initialName
              field._cancelling = false
            }
          } else {
            if (parentType === '$object') {
              const isValidObjectPropName = isValidPropName(field.name) && this.isUniqueFieldPropName(field.name, localFields)
              const isValidObjectPropValue = isValidCodePrimitiveValue(field.userValue) || field.type === '$array'
              if (isValidObjectPropName && isValidObjectPropValue) {
                field._error = false
                if (!field._editing) {
                  field.initialName = field.name
                  field._validating = false
                  field._initialized = true
                }
              } else {
                if (field._editing) {
                  field._error = true
                }
                if (!field._initialized && !field._editing) { // - Delete the field if not editing & not initialized
                  this.$delete(localFields, i)
                }
              }
            }
          }
          // - Deleting
          if (field._deleting) {
            this.$delete(localFields, i)
          }
          if (!field._editing && !field._deleting) {
            this.computeLocalFields(field.value, field.type)
          }

        // Primitive Field updates
        } else {
          // - Change type to object/array if requested
          if (field._converting && !field._error) {
            this.resetPropFieldsStates()
            const oldType = field.type
            this.$set(field, 'type', field._converting)
            this.$set(field, 'open', true)
            this.$set(field, 'value', [])
            if (field.type === '$object') {
              // -- Add object field's attrs
              const nestedField = {
                type: oldType,
                name: 'attr',
                initialName: 'attr',
                value: field.value,
                rawValue: field.rawValue,
                userValue: field.userValue,
                initialValue: field.initialValue,
                _initialized: true,
                _deleting: false,
                _editing: false,
                _cancelling: false,
                _error: false,
                _validating: false,
                _converting: false,
              }
              this.$set(field, 'rawValue', {})
              this.$set(field.rawValue, nestedField.name, nestedField.rawValue)
              this.$set(field.value, 0, nestedField)
              // -- Remove unnecessary attrs
              this.$delete(field, 'initialValue')
              this.$delete(field, 'userValue')
              this.$delete(field, '_converting')
            } else if (field.type === '$array') {
              // -- Add array field's attrs
              const nestedField = {
                type: oldType,
                name: null,
                initialName: null,
                value: field.value,
                rawValue: field.rawValue,
                userValue: field.userValue,
                initialValue: field.initialValue,
                _initialized: true,
                _deleting: false,
                _editing: false,
                _cancelling: false,
                _error: false,
                _validating: false,
                _converting: false,
              }
              this.$set(field, 'rawValue', [])
              this.$set(field.rawValue, 0, nestedField.rawValue)
              this.$set(field.value, 0, nestedField)
              // -- Remove unnecessary attrs
              this.$delete(field, 'initialValue')
              this.$delete(field, 'userValue')
              this.$delete(field, '_converting')
            }
          }
          // - Start primitive type processing
          if (!['$object', '$array',].includes(field.type)) {
            // // -- Initialize if validated
            if (field._validating && !field._initialized) {
              field._initialized = true
            }
            // -- Cancelling (edit)
            if (field._cancelling) {
              if (!field._initialized) {
                this.$delete(localFields, i)
              } else {
                field.rawValue = field.initialValue
                field.name = field.initialName
                field.value = field.rawValue !== null ? field.rawValue.toString() : strNullValue
                field.type = this.getFormattedType(field.rawValue)
                field.userValue = formatPrimitiveValueToCode(field.rawValue, field.type)
                field._cancelling = false
              }
            } else {
              // -- [continuing] Valid code provided (name & value)
              const validPropName = isValidPropName(field.name) || parentType === '$array'
              const uniquePropName = this.isUniqueFieldPropName(field.name, localFields) || parentType === '$array'
              const validPropValue = isValidCodePrimitiveValue(field.userValue)
              if (validPropName && uniquePropName && validPropValue) {
                field._error = false
                const parsedValue = this.parseUserCodeValue(field.userValue)
                field.rawValue = parsedValue
                field.type = this.getFormattedType(parsedValue)
                field.value = parsedValue !== null ? field.rawValue.toString() : strNullValue
                // --- Field's values update if editing done
                if (!field._editing) {
                  field.initialName = field.name
                  field.initialValue = field.rawValue
                  field._validating = false
                }
              } else { // --- Invalid code-value or prop name provided (error)
                if (field._editing) {
                  field._error = true
                }
                if (!field._editing) { // ---- Reset to field's previous values if editing done
                  field.name = field.initialName
                  field.userValue = formatPrimitiveValueToCode(field.initialValue, field.type)
                  field.rawValue = field.initialValue
                  field.value = field.rawValue !== null ? field.rawValue.toString() : null
                }
              }
              // - Deleting
              if (field._deleting) {
                localFields.splice(i, 1)
              }
            }
          }
        }
      }
      return localFields
    },
    /**
     * Sorting method for VS-formatted `fields`.
     * The sort is made by `field.name`'s alphabetical order.
     *
     * @param {array} fields - The fields' list to sort.
     *
     * @return {array}
     */
    sortLocalFields (fields) {
      let sortedFields = sortBy(fields, [field => field.name])
      for (let field of sortedFields) {
        if (field.type === '$object') {
          field.value = this.sortLocalFields(field.value)
        } else if (field.type === '$array') {
          // Nothing to sort with `array` fields...
        }
      }
      return sortedFields
    },
    /**
     * Checks for `propName` unicity (checks performed against
     * `field.name` in `localFields`).
     *
     * @param   {[type]}  propName     [propName description]
     * @param   {[type]}  localFields  [localFields description]
     *
     * @return  {[type]}               [return description]
     */
    isUniqueFieldPropName (propName, localFields) {
      const matches = localFields.filter(field => propName === field.name)
      return !(matches.length > 1)
    },
  /**
   * Wrapper around the `formatFromNativeStrType` that fixes
   * the special case of "Array-type checking" which initially
   * returns 'object'.
   *
   * @param {mixed} value - Value to get type of.
   *
   * @return {mixed}
   */
    getFormattedType (value) {
      if (Array.isArray(value)) {
        return '$array'
      } else if (value === null) {
        return 'null'
      } else {
        return formatFromNativeStrType(typeof value)
      }
    },
    /**
     * Parse the given user-entered "code" value to its real primitive
     * equivalent.
     *
     * @param {string} value - The user-entered "code" value.
     *
     * @return {mixed}
     */
    parseUserCodeValue (value) {
      return value === '""' ? "" : JSON.parse(value)
    },
    /**
     * Loops through all VS-formatted fields (including nested ones)
     * to reset them to their "idle" state.
     *
     * @param {array} nestedValue - Low-level fields. Used for recursion processing.
     *
     * @return {void}
     */
    resetPropFieldsStates (nestedValue) {
      let value = nestedValue ? nestedValue : this.localValue
      for (let field of value) {
        field._editing = false
        if (field.type === '$object') {
          this.resetPropFieldsStates(field.value)
        } else if (field.type === '$array') {

        }
      }
    },
  },

  created () {
    this.type = this.getFormattedType(this.value)
    this.modelValue = this.value
    this.localValue = this.formatToLocalValue(this.value)
  },
}
</script>

<style lang="sass" scoped>
@import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;700&display=swap')

.vs-complex-prop
  width: 100%
</style>

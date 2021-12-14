<template>
  <div class="vs-prop-toolbar">
    <div class="vs-prop-toolbar-actions">
      <!-- Edit -->
      <div
        v-if="initialized && !editing"
        class="action edit"
        @click="onEditClick"
      >
        <FAIcon :icon="faIcons.edit" class="vs-icon" />
      </div>
      <!-- Validate Edit -->
      <div
        v-if="editing && !errored"
        class="action validate-edit"
        @click="onValidateEditClick"
      >
        <FAIcon :icon="faIcons.validate" class="vs-icon" />
      </div>
      <!-- Cancel Edit -->
      <div
        v-if="editing"
        class="action cancel-edit"
        @click="onCancelEditClick"
      >
        <FAIcon :icon="faIcons.cancel" class="vs-icon" />
      </div>
      <!-- Delete -->
      <div
        v-if="initialized"
        class="action delete"
        @click="onDeleteClick"
      >
        <FAIcon :icon="faIcons.delete" class="vs-icon" />
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon as FAIcon } from '@fortawesome/vue-fontawesome'
import {
  faPlus,
  faEdit,
  faTrash,
  faTimes,
  faCheck,
  faCaretRight,
} from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'VSPropToolbar',
  components: {
    FAIcon,
  },

  props: {
    initialized: {
      type: Boolean,
      default: false,
    },
    editing: {
      type: Boolean,
      default: false,
    },
    errored: {
      type: Boolean,
      default: false,
    },
    toObject: {
      type: Boolean,
      default: false,
    },
    toArray: {
      type: Boolean,
      default: false,
    },
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
  }),

  methods: {
    onEditClick () {
      this.$emit('edit')
    },
    onValidateEditClick () {
      this.$emit('validate-edit')
    },
    onCancelEditClick () {
      this.$emit('cancel')
    },
    onDeleteClick () {
      this.$emit('delete')
    },
  },
}
</script>

<style lang="sass" scoped>
.vs-prop-toolbar
  .vs-prop-toolbar-actions
    display: flex
    padding-left: 10px
    align-items: center
    font-size: 11px

    .action
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
</style>

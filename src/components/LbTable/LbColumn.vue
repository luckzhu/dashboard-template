/* eslint-disable */
<template>
  <el-table-column
    v-bind="$attrs"
    :prop="column.prop"
    :label="column.label"
    :type="column.type"
    :index="column.index"
    :column-key="column.columnKey"
    :width="column.width"
    :min-width="column.minWidth"
    :fixed="column.fixed"
    :render-header="column.renderHeader"
    :sortable="column.sortable || false"
    :sort-method="column.sortMethod"
    :sort-by="column.sortBy"
    :sort-orders="column.sortOrders"
    :resizable="column.resizable || true"
    :formatter="column.formatter"
    :show-overflow-tooltip="column.showOverflowTooltip || false"
    :align="column.align || align || 'center'"
    :header-align="column.headerAlign || headerAlign || column.align || align || 'center'"
    :class-name="column.className || column.prop || column.type"
    :label-class-name="column.labelClassName"
    :selectable="column.selectable"
    :reserve-selection="column.reserveSelection || false"
    :filters="column.filters"
    :filter-placement="column.filterPlacement"
    :filter-multiple="column.filterMultiple"
    :filter-method="column.filterMethod"
    :filtered-value="column.filteredValue"
    v-on="$listeners"
  >
    <template #header="scope">
      <lb-render v-if="column.customHeader" :scope="scope" :render="column.customHeader" />
      <span v-else>{{ scope.column.label }}</span>
    </template>

    <template #default="scope">
      <lb-render :scope="scope" :render="column.render" />
    </template>

    <template v-if="column.children">
      <lb-column v-for="(col, index) in column.children" :key="index" :column="col" />
    </template>
  </el-table-column>
</template>

<script>
import LbRender from './LbRender'
import forced from './forced.js'
export default {
  name: 'LbColumn',
  components: {
    LbRender
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    column: Object,
    // eslint-disable-next-line vue/require-default-prop
    headerAlign: String,
    // eslint-disable-next-line vue/require-default-prop
    align: String
  },
  watch: {
    column: {
      handler() {
        this.setColumn()
      },
      immediate: true
    }
  },
  methods: {
    setColumn() {
      if (this.column.type) {
        this.column.customHeader = forced[this.column.type].renderHeader
        this.column.render =
          this.column.render || forced[this.column.type].renderCell
      }
      if (this.column.formatter) {
        this.column.render = (h, scope) => {
          return (
            <span>
              {scope.column.formatter(
                scope.row,
                scope.column,
                scope.row[scope.column.property],
                scope.$index
              )}
            </span>
          )
        }
      }
      if (!this.column.render) {
        this.column.render = (h, scope) => {
          return <span>{scope.row[scope.column.property]}</span>
        }
      }
    }
  }
}
</script>

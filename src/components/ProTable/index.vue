<template>
  <div>
    <div class="top-action">
      <div class="section">
        <div v-for="item in searchFiltered" :key="item.prop">
          <el-select v-if="item.type === 'radio' || item.type === 'select'" v-model="searchFields[item.prop]" clearable :placeholder="`请选择${item.label}`">
            <el-option v-for="option in item.options" :key="option.value" :value="option.value" :label="option.text" />
          </el-select>
          <el-cascader v-else-if="item.type === 'cascader'" v-model="searchFields[item.prop]" :placeholder="`请选择${item.label}`" v-bind="item.attrs" />
          <el-input v-else v-model="searchFields[item.prop]" :placeholder="`请输入${item.label}进行搜索`" />
        </div>
        <el-button :loading="loading" type="primary" icon="el-icon-refresh" @click="getTableList">刷新数据</el-button>
        <div class="right">
          <el-button type="primary" icon="el-icon-document-add" @click="dialogFormVisible = true">新增数据</el-button>
          <Export2Excel table-id="lbTable" />
        </div>
      </div>
    </div>

    <lb-table
      v-loading="loading"
      :columns="columnsFiltered"
      :data-source="dataSource"
      pagination
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10,20,100,200]"
      :pager-count="5"
      :current-page.sync="page"
      :total="total"
      :page-size="pageSize"
      @size-change="handleSizeChange"
      @p-current-change="handleCurrentChange"
      v-on="$listeners"
    />

    <ele-form-dialog
      v-model="formData"
      :form-desc="formOptions.formDesc"
      :visible.sync="dialogFormVisible"
      :rules="formOptions.rules"
      title="新增数据"
      :is-show-cancel-btn="!formDisabled"
      :is-show-submit-btn="!formDisabled"
      :request-fn="handleSubmit"
      @request-success="handleSuccess"
    />

  </div>
</template>

<script>
import { getList } from '@/api/table'
import Export2Excel from '@/components/Export2Excel'

export default {
  components: {
    Export2Excel
  },
  props: {
    // label type prop
    // required options attrs formRule
    // action actionType: ['view', 'update', 'export', 'delete']
    columns: {
      type: Array,
      required: true,
      default: () => []
    },
    // eslint-disable-next-line vue/require-default-prop
    deleteFn: Function,
    // eslint-disable-next-line vue/require-default-prop
    exportRowFn: Function
  },
  data() {
    return {
      loading: false,
      page: 1,
      pageSize: 20,
      total: 0,
      formDisabled: false,
      searchFields: {},
      dataSource: [],
      dialogFormVisible: false,
      formData: {},
      tableId: 'forExport'
    }
  },
  computed: {
    columnsFiltered() {
      const { columns, page, pageSize } = this
      return columns.map(item => {
        const { type, ...rest } = item
        if (item.hideInTable) return
        if (type === 'index') {
          return { ...item, render: (h, scope) => {
            return <div> {scope.$index + 1 + (page - 1) * pageSize} </div>
          } }
        }
        if (type === 'selection') {
          return item
        }
        if (type === 'radio' || type === 'select') {
          // eslint-disable-next-line no-unused-vars
          return { ...rest, render: (h, scope) => {
            const option = item.options.find(ele => ele.value === scope.row[item.prop])
            return <span>{option.text}</span>
            // <el-radio-group vModel={scope.row[item.prop]}>
            //   {item.options.map(option => { return <el-radio label={option.value}>{option.text}</el-radio> })}
            // </el-radio-group>
          } }
        }
        if (type === 'action') {
          const { actionType } = item
          // eslint-disable-next-line no-unused-vars
          return { render: (h, scope) => {
            const { row } = scope
            const inbuiltAction = {
              view: <el-link type='primary' onClick={() => this.view(row)}>查看</el-link>,
              update: <el-link type='warning' onClick={() => this.update(row)}>编辑</el-link>,
              delete: <el-link type='danger' onClick={() => this.delete(row)}>删除</el-link>,
              export: <el-link type='success' onClick={() => this.exportRow(row)}>导出</el-link>
            }
            return <div> { actionType.map(action => inbuiltAction[action]) } </div>
          }, ...rest, prop: 'action' }
        }
        return rest
      })
    },
    formOptions() {
      const { columns, autoHidedColumn, formDisabled } = this
      let formDesc = {}
      let rules = {}
      columns.forEach(item => {
        const { prop, hideInForm, formRule } = item
        if (autoHidedColumn(item) || hideInForm) return
        formDesc = { ...formDesc,
          [prop]: {
            type: 'input',
            disabled: formDisabled,
            ...item
          }
        }
        if (formRule) { rules = { ...rules, [prop]: formRule } }
      })
      return { formDesc, rules }
    },
    searchFiltered() {
      const { columns, autoHidedColumn } = this
      return columns.filter(item => !(autoHidedColumn(item) || item.hideInSearch))
    }
  },
  mounted() {
    this.getTableList()
  },
  methods: {
    async getTableList() {
      this.loading = true
      const { page, pageSize, searchFields } = this
      try {
        const { data: { total, items }} = await getList({ ...searchFields, page, pageSize })
        this.dataSource = items
        this.total = total
      } finally {
        this.loading = false
      }
    },
    autoHidedColumn({ type }) {
      const autoHidedTypes = ['index', 'selection', 'action']
      return autoHidedTypes.includes(type)
    },
    xxx() {
      console.log(this.dataSource)
    },
    handleCurrentChange(currentPage) {
      this.page = currentPage
      this.getTableList()
    },
    handleSizeChange(val) {
      this.page = 1
      this.pageSize = val
      this.getTableList()
    },
    update(row) {
      this.formData = row
      this.formDisabled = false
      this.dialogFormVisible = true
    },
    view(row) {
      this.formData = row
      this.formDisabled = true
      this.dialogFormVisible = true
    },
    async delete({ id }) {
      if (!this.deleteFn) return
      await this.deleteFn({ id })
      this.$message(`删除了id：${id}`)
    },
    async exportRow({ id }) {
      if (!this.exportRowFn) return
      await this.exportRowFn({ id })
      this.$message(`导出了id：${id}`)
    },
    handleSubmit(data) {
      return new Promise((resolve) => {
        resolve(data)
      })
    },
    handleSuccess(data) {
      this.dataSource.push(data)
      this.dialogFormVisible = false
      this.formData = {}
      this.$message.success('创建成功')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

<template>
  <div>
    <ProTable :columns="columns" @selection-change="handleSelectionChange" />
  </div>
</template>

<script>
import ProTable from '@/components/ProTable'
import { validPhone } from '@/utils/validate'
let id = 0
export default {
  components: {
    ProTable
  },

  data() {
    return {
      multipleSelection: [],
      cascaderProps: {
        lazy: true,
        checkStrictly: true,
        emitPath: false,
        lazyLoad(node, resolve) {
          const { level } = node
          setTimeout(() => {
            const nodes = Array.from({ length: level + 1 })
              .map(item => ({
                value: ++id,
                label: `选项${id}`,
                leaf: level >= 2
              }))
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            resolve(nodes)
          }, 1000)
        }
      }
    }
  },
  computed: {
    columns() {
      return [
        { label: '序号', type: 'selection' },
        { label: '序号', type: 'index' },
        { label: '名称', prop: 'name', required: true },
        { label: '性别', type: 'radio', prop: 'gender', required: true, options: [{ text: '男', value: 1 }, { text: '女', value: 0 }] },
        { label: '地区', type: 'cascader', prop: 'regionCode', formatter: row => row.address, attrs: { props: this.cascaderProps }},
        { label: '手机', prop: 'phone', hideInSearch: true, formRule: { validator: validPhone, trigger: 'blur' }},
        { label: '操作', type: 'action', actionType: ['view', 'update', 'export', 'delete'] }
      ]
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

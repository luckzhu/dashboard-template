<template>
  <div>
    <ProTable :columns="columns" @selection-change="handleSelectionChange" />
  </div>
</template>

<script>
import ProTable from '@/components/ProTable'
import { validPhone } from '@/utils/validate'

export default {
  components: {
    ProTable
  },
  data() {
    return {
      columns: [
        { label: '序号', type: 'selection' },
        { label: '序号', type: 'index' },
        { label: '名称', prop: 'name', required: true },
        { label: '性别', type: 'radio', prop: 'gender', required: true, options: [{ text: '男', value: 1 }, { text: '女', value: 0 }] },
        { label: '地区', type: 'cascader', prop: 'regionCode', formatter: row => row.address, attrs: { placeholder: '请选择地区' }},
        { label: '手机', prop: 'phone', hideInSearch: true, formRule: { validator: validPhone, trigger: 'blur' }},
        { label: '操作', type: 'action', actionType: ['view', 'update', 'export', 'delete'] }
      ],
      multipleSelection: []
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

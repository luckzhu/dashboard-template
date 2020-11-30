<template>
  <div>
    <LbTable :columns="columns" :data-source="dataSource" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        { label: '序号', type: 'index' },
        { label: '名称', prop: 'name' },
        { label: '手机', prop: 'phone' },
        {
          label: '地址',
          prop: 'address',
          customHeader: (h, scope) => {
            return <span>{scope.column.label}*</span>
          }
        },
        {
          label: '操作',
          render: (h, scope) => {
            return (
              <div>
                <el-link type='warning'>编辑</el-link>
                <el-link type='primary'>查看</el-link>
                <el-link type='success'>导出</el-link>
                <el-link type='danger'>删除</el-link>
              </div>
            )
          }
        }
      ],
      dataSource: [
        {
          name: '大傻子',
          phone: '12344567890',
          address: '广东省农科院创新大楼231'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

<template>
  <div>
    <div class="top-action">
      <div class="section">
        <el-select v-model="value1">
          <el-option :value="null" />
        </el-select>
        <el-cascader v-model="value2" />
        <div>
          <el-input v-model="value3" placeholder="请搜索" />
        </div>

        <el-checkbox-group v-model="value4">
          <el-checkbox-button label="复选框 A" />
          <el-checkbox-button label="复选框 B" />
        </el-checkbox-group>

        <div class="right">
          <el-button type="primary" icon="el-icon-refresh">刷新数据</el-button>
        </div>
      </div>
    </div>

    <LbTable :columns="columns" :data-source="dataSource" />
  </div>
</template>

<script>
import LbTable from '@/components/LbTable'

export default {
  components: {
    LbTable
  },
  data() {
    return {
      value1: null,
      value2: null,
      value3: null,
      value4: [],
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

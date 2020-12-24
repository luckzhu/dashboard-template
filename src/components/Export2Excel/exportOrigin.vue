<template>
  <el-button :loading="loading" type="warning" icon="el-icon-document" @click="handleDownload">
    <slot>导出</slot>
  </el-button>
</template>

<script>
export default {
  props: {
    // eslint-disable-next-line vue/require-default-prop
    columns: {
      type: Array,
      require: true
    },
    // eslint-disable-next-line vue/require-default-prop
    tableData: {
      type: Array,
      require: true
    },
    filename: {
      type: String,
      default: '表格'
    }
  },
  data() {
    return {
      loading: false,
      tHeader: [],
      autoWidth: true,
      // 导出文件格式
      bookType: 'xlsx'
    }
  },
  mounted() {
    const columns = this.columns
    const tHeader = []
    const filterVal = []
    for (let i = 0; i < columns.length; i++) {
      const temp = columns[i]
      tHeader.push(temp.label)
      filterVal.push(temp.prop)
    }
    this.tHeader = tHeader
    this.filterVal = filterVal
  },
  methods: {
    handleDownload() {
      this.loading = true
      this.$emit('download', () => {
        import('./Export2Excel').then((excel) => {
          const data = this.tableData
          excel.export_json_to_excel({
            header: this.tHeader,
            data,
            filename: this.filename,
            autoWidth: this.autoWidth,
            bookType: this.bookType
          })
          this.loading = false
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

<template>
  <el-button
    :loading="downloadLoading"
    type="primary"
    v-bind="$attrs"
    icon="el-icon-download"
    @click="exportExcel"
  >
    <slot>导出</slot>
  </el-button>
</template>

<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

export default {
  props: {
    allPages: {
      type: Boolean
    },
    // 过滤列数，['selection','name','handle']
    // selection 多选栏
    // index 序号列
    // name 传正常列的prop
    // handle slot-column自定的 class-name
    // eslint-disable-next-line
    filterArr: {
      type: Array,
      default: () => ['selection', 'action']
    },
    tableId: {
      type: String,
      default: 'tableId'
    },
    filename: {
      type: String,
      default: '导出数据'
    }
  },
  data() {
    return {
      downloadLoading: false
    }
  },
  methods: {
    handleKeyup(event) {
      // eslint-disable-next-line no-caller
      const e = event || window.event || arguments.callee.caller.arguments[0]
      if (!e) return
      const { key, ctrlKey } = e
      if (key === 'q' && ctrlKey === true) {
        this.exportExcel()
      }
    },
    exportExcel() {
      if (this.allPages) {
        this.getAllPages()
      } else {
        this.export()
      }
    },
    getAllPages() {
      this.$emit('exportAll', () => {
        this.export()
      })
    },
    columnDisplay(display) {
      if (this.filterArr) {
        this.filterArr.forEach((item) => {
          const elements = document.querySelectorAll(`.${item}`)
          for (let i = elements.length - 1; i >= 0; i--) {
            // elements[i].parentNode.removeChild(elements[i])
            elements[i].style.display = display
          }
        })
      }
    },
    export() {
      const xlsxParam = { raw: true, display: true }
      this.columnDisplay('none')
      const dom = document.querySelector(`#${this.tableId}`)
      const fix = document.querySelector(`#${this.tableId} .el-table__fixed`)
      let wb
      if (fix) {
        // 判断要导出的节点中是否有fixed的表格，如果有，转换excel时先将该dom移除，然后append回去
        wb = XLSX.utils.table_to_book(dom.removeChild(fix), xlsxParam)
        dom.appendChild(fix)
      } else {
        wb = XLSX.utils.table_to_book(dom, xlsxParam)
      }

      const wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      })

      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: 'application/octet-stream;charset=utf-8' }),
          `${this.filename}.xlsx`
        )
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
      }
      this.columnDisplay('table-cell')
      return wbout
    }
  }
}
</script>


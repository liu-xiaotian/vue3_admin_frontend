<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input
        style="width: 200px"
        placeholder="请你输入SPU名称"
        v-model="SpuParams.spuName"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select v-model="SpuParams.tmId" style="width: 200px">
        <el-option
          v-for="item in AllTradeMark"
          :key="item.id"
          :label="item.tmName"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        v-model="SpuParams.description"
        type="textarea"
        placeholder="请你输入SPU描述"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <el-upload
        action="/api/admin/product/fileUpload"
        :before-upload="handlerUpload"
        :on-remove="handleRemove"
        :on-preview="handlePictureCardPreview"
        v-model:file-list="imgList"
        list-type="picture-card"
      >
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img :src="dialogImageUrl" alt="Preview Image" style="width: 100%; height: 100%" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <el-select
        style="width: 200px"
        v-model="saleAttrIdAndValueName"
        :placeholder="unSelectSaleAttr.length ? `还未选择${unSelectSaleAttr.length}个` : '无'"
      >
        <el-option
          :label="item.name"
          :value="`${item.id}:${item.name}`"
          v-for="item in unSelectSaleAttr"
          :key="item.id"
        ></el-option>
      </el-select>
      <el-button
        @click="addSaleAttr"
        :disabled="saleAttrIdAndValueName ? false : true"
        style="margin-left: 10px"
        type="primary"
        size="default"
        icon="Plus"
        >添加属性</el-button
      >
      <el-table border style="margin: 10px 0px" :data="saleAttr">
        <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
        <el-table-column label="销售属性名字" width="120px" prop="saleAttrName"></el-table-column>
        <el-table-column label="销售属性值">
          <template #default="{ row }">
            <el-tag
              @close="row.spuSaleAttrValueList.splice(index, 1)"
              closable
              style="margin: 0 5px"
              v-for="(item, index) in row.spuSaleAttrValueList"
              :key="index"
              >{{ item.saleAttrValueName }}</el-tag
            >
            <el-input
              @blur="toLook(row)"
              v-if="row.flag == true"
              v-model="row.saleAttrValue"
              placeholder="请你输入属性值"
              size="small"
              style="width: 100px"
            ></el-input>
            <el-button
              @click="toEdit(row)"
              v-else
              type="primary"
              size="small"
              icon="Plus"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template #default="{ $index }">
            <el-button
              @click="saleAttr.splice($index, 1)"
              type="primary"
              size="small"
              icon="Delete"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" @click="save">保存</el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { computed, ref } from 'vue'
import {
  reqAllTradeMark,
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAllSaleAttr
} from '@/api/product/spu'
let $emit = defineEmits(['changeScene'])
let SpuParams = ref({
  category3Id: '', //收集三级分类的ID
  spuName: '', //SPU的名字
  description: '', //SPU的描述
  tmId: '', //品牌的ID
  spuImageList: [],
  spuSaleAttrList: []
})
//存储已有的SPU这些数据
let AllTradeMark = ref([])
//商品图片
let imgList = ref([])
//已有的SPU销售属性
let saleAttr = ref([])
//全部销售属性
let allSaleAttr = ref([])
let dialogVisible = ref(false)
//存储预览图片地址
let dialogImageUrl = ref('')
//将来收集还未选择的销售属性的ID与属性值的名字
let saleAttrIdAndValueName = ref('')
const cancel = () => {
  $emit('changeScene', 0)
}
const initHasSpuData = async (spu) => {
  SpuParams.value = spu
  //spu:即为父组件传递过来的已有的SPU对象[不完整]
  //获取全部品牌的数据
  let res1 = await reqAllTradeMark()
  let res2 = await reqSpuImageList(spu.id)
  let res3 = await reqSpuHasSaleAttr(spu.id)
  let res4 = await reqAllSaleAttr()
  AllTradeMark.value = res1.data
  imgList.value = res2.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl
    }
  })
  //存储已有的SPU销售属性
  saleAttr.value = res3.data
  //存储全部的SPU销售属性
  allSaleAttr.value = res4.data
}

const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}
const handleRemove = () => {
  console.log('照片墙删除文件钩子')
}
const handlerUpload = (file) => {
  if (file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/gif') {
    if (file.size / 1024 / 1024 < 3) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件务必小于3M'
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件务必PNG|JPG|GIF'
    })
    return false
  }
}
defineExpose({
  initHasSpuData
})
// 计算出当前还未拥有的销售属性
const unSelectSaleAttr = computed(() => {
  let unSelectArr = allSaleAttr.value.filter((item) => {
    return saleAttr.value.every((item1) => {
      return item.name != item1.saleAttrName
    })
  })
  return unSelectArr
})
//添加销售属性的方法
const addSaleAttr = () => {
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
  let newSaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: []
  }
  saleAttr.value.push(newSaleAttr)
  saleAttrIdAndValueName.value = ''
}
const toEdit = (row) => {
  row.flag = true
  row.saleAttrValue = ''
}
const toLook = (row) => {
  const { baseSaleAttrId, saleAttrValue } = row
  let newSaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue
  }
  if (saleAttrValue.trim() == '') {
    ElMessage({
      type: 'error',
      message: '属性值不能为空的'
    })
    return
  }
  let repeat = row.spuSaleAttrValueList.find((item) => {
    return item.saleAttrValueName == saleAttrValue
  })
  if (repeat) {
    ElMessage({
      type: 'error',
      message: '属性值重复'
    })
    return
  }
  //追加新的属性值对象
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  //切换为查看模式
  row.flag = false
}
</script>

<style lang="scss" scoped></style>

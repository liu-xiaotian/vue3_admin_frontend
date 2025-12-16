<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input placeholder="请你输入SPU名称" v-model="SpuParams.spuName"></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select v-model="SpuParams.tmId"> </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        v-model="SpuParams.description"
        type="textarea"
        placeholder="请你输入SPU描述"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <el-upload>
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>
    </el-form-item>
    <el-form-item label="SPU销售属性"></el-form-item>
    <el-form-item>
      <el-button type="primary" size="default">保存</el-button>
      <el-button type="primary" size="default">取消</el-button>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <el-select></el-select>
      <el-button style="margin-left: 10px" type="primary" size="default" icon="Plus"
        >添加属性</el-button
      >
      <el-table border style="margin: 10px 0px">
        <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
        <el-table-column label="销售属性名字" width="120px"></el-table-column>
        <el-table-column label="销售属性值"></el-table-column>
        <el-table-column label="操作" width="120px"></el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" @click="save">保存</el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref } from 'vue'
let $emit = defineEmits(['changeScene'])
let SpuParams = ref({
  category3Id: '', //收集三级分类的ID
  spuName: '', //SPU的名字
  description: '', //SPU的描述
  tmId: '', //品牌的ID
  spuImageList: [],
  spuSaleAttrList: []
})
const cancel = () => {
  $emit('changeScene', 0)
}
const initHasSpuData = (spu) => {
  SpuParams.value = spu
}
defineExpose({
  initHasSpuData
})
</script>

<style lang="scss" scoped></style>

<template>
  <el-card style="margin: 0 0 10px 0">
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select
          @change="handle"
          v-model="categoryStore.c1Id"
          placeholder="请选择"
          style="width: 200px"
        >
          <el-option
            v-for="c1 in categoryStore.c1Arr"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          @change="handle1"
          v-model="categoryStore.c2Id"
          placeholder="请选择"
          style="width: 200px"
        >
          <el-option
            v-for="c2 in categoryStore.c2Arr"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="categoryStore.c3Id" placeholder="请选择" style="width: 200px">
          <el-option
            v-for="c3 in categoryStore.c3Arr"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import useCategoryStore from '@/stores/modules/category'
import { onMounted } from 'vue'
const categoryStore = useCategoryStore()

const getC1 = () => {
  categoryStore.getC1()
}
onMounted(() => getC1())

//此方法即为一级分类下拉菜单的change事件(选中值的时候会触发,保证一级分类ID有了)
const handle = () => {
  categoryStore.c2Id = ''
  categoryStore.c3Id = ''
  categoryStore.c3Arr = []
  categoryStore.getC2()
}
const handle1 = () => {
  categoryStore.c3Id = ''
  categoryStore.getC3()
}
</script>

<style lang="scss" scoped></style>

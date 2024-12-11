<script setup>

</script>

<template>
      <el-result
        icon="warning"
        title="找不到你想要的"
        sub-title="这是一片荒无人烟的地方">
        <template #extra>
          <el-button type="primary" @click="$router.push('/')">点我回主页</el-button>
        </template>
      </el-result>
</template>

<style scoped>

</style>
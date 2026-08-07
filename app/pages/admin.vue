<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">แผงควบคุมสำหรับผู้ดูแลระบบ</h1>
    </div>

    <div class="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <i class="pi pi-exclamation-triangle text-yellow-400"></i>
        </div>
        <div class="ml-3">
          <p class="text-sm text-yellow-700 dark:text-yellow-300">
            <strong>ประกาศด้านความปลอดภัย:</strong> การแสดงรายชื่อผู้ใช้ทั้งหมดต้องใช้ Firebase Admin SDK
            หน้า UI นี้เป็นเพียงตัวอย่างเท่านั้น การจัดการผู้ใช้จริงควรทำผ่าน Cloud Functions ที่ปลอดภัย
          </p>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700"
      >
        <h3 class="text-gray-500 dark:text-gray-400 text-sm">ผู้ใช้ทั้งหมด</h3>
        <p class="text-2xl font-bold dark:text-white">1,024</p>
      </div>
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700"
      >
        <h3 class="text-gray-500 dark:text-gray-400 text-sm">ระงับการใช้งาน</h3>
        <p class="text-2xl font-bold text-red-500">12</p>
      </div>
    </div>

    <!-- Dummy Users Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
      <DataTable :value="dummyUsers" responsiveLayout="scroll">
        <Column field="uid" header="UID" class="text-xs text-gray-500"></Column>
        <Column field="email" header="อีเมล" class="font-medium dark:text-white"></Column>
        <Column field="status" header="สถานะ">
          <template #body="{ data }">
            <span
              :class="
                data.status === 'Active'
                  ? 'text-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'text-red-500 bg-red-50 dark:bg-red-900/20'
              "
              class="px-2 py-1 rounded-full text-xs font-bold"
            >
              {{ data.status }}
            </span>
          </template>
        </Column>
        <Column header="การจัดการ">
          <template #body="{ data }">
            <Button
              v-if="data.status === 'ใช้งานปกติ'"
              label="ระงับ"
              severity="danger"
              size="small"
              outlined
            />
            <Button v-else label="เปิดใช้งานอีกครั้ง" severity="success" size="small" outlined />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const dummyUsers = ref([
  { uid: 'u_1', email: 'test@example.com', status: 'ใช้งานปกติ' },
  { uid: 'u_2', email: 'spam@example.com', status: 'ระงับการใช้งาน' }
])
</script>

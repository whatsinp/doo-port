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
    <!-- Dummy Users Table -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden border border-gray-200 dark:border-gray-700">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <th class="py-3 px-4 font-semibold text-sm text-gray-600 dark:text-gray-300">UID</th>
              <th class="py-3 px-4 font-semibold text-sm text-gray-600 dark:text-gray-300">อีเมล</th>
              <th class="py-3 px-4 font-semibold text-sm text-gray-600 dark:text-gray-300">สถานะ</th>
              <th class="py-3 px-4 font-semibold text-sm text-gray-600 dark:text-gray-300 text-right">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in dummyUsers" :key="user.uid" class="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/25 transition-colors">
              <td class="py-3 px-4 text-sm text-gray-500 dark:text-gray-400 font-mono">{{ user.uid }}</td>
              <td class="py-3 px-4 font-medium text-gray-900 dark:text-white">{{ user.email }}</td>
              <td class="py-3 px-4">
                <span
                  :class="
                    user.status === 'ใช้งานปกติ'
                      ? 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800'
                      : 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800'
                  "
                  class="px-2.5 py-1 rounded-full text-xs font-semibold"
                >
                  {{ user.status }}
                </span>
              </td>
              <td class="py-3 px-4 text-right">
                <button
                  v-if="user.status === 'ใช้งานปกติ'"
                  class="px-3 py-1.5 text-xs font-medium text-red-600 hover:text-white border border-red-600 hover:bg-red-600 rounded-lg transition-colors"
                >
                  ระงับ
                </button>
                <button
                  v-else
                  class="px-3 py-1.5 text-xs font-medium text-green-600 hover:text-white border border-green-600 hover:bg-green-600 rounded-lg transition-colors"
                >
                  เปิดใช้งานอีกครั้ง
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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

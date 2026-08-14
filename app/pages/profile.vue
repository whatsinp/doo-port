<template>
  <div class="pb-10">
    <div v-if="loading" class="flex justify-center p-12">
      <i class="pi pi-spin pi-spinner text-4xl text-blue-500"/>
    </div>

    <div v-else-if="profile" class="bg-white dark:bg-gray-900 rounded-b-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-800">
      <!-- Banner -->
      <div 
        class="h-48 sm:h-[300px] w-full relative bg-[#F2DBDB] dark:bg-[#4a3a3a]"
        :class="{ 'cursor-pointer': profile?.bannerUrl }"
        :style="profile.bannerUrl ? `background-image: url('${profile.bannerUrl}'); background-size: cover; background-position: center;` : ''"
        @click="profile?.bannerUrl ? viewerImage = profile.bannerUrl : null"
      >
        <div v-if="!profile.bannerUrl" class="absolute inset-0 flex items-center justify-center opacity-30">
          <h1 class="text-6xl font-black text-black">BANNER</h1>
        </div>
      </div>

      <!-- Profile Info Section -->
      <div class="max-w-5xl mx-auto px-6 sm:px-10 relative">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between pb-8">
          
          <!-- Avatar and Text -->
          <div class="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-20 sm:-mt-16 relative z-10 mb-4 sm:mb-0">
            <!-- Avatar -->
            <div class="relative bg-white dark:bg-gray-900 rounded-full p-1" :class="{ 'cursor-pointer hover:opacity-90 transition-opacity': profile?.avatarUrl }" @click="profile?.avatarUrl ? viewerImage = profile.avatarUrl : null">
              <img
                v-if="profile?.avatarUrl"
                :src="profile.avatarUrl"
                alt="Profile"
                class="w-36 h-36 sm:w-44 sm:h-44 rounded-full object-cover border-4 border-[#E5E0F5] bg-[#E5E0F5] dark:border-gray-700"
              >
              <div
                v-else
                class="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-[#E5E0F5] dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-gray-300 text-5xl font-black border-4 border-[#E5E0F5] dark:border-gray-700 shadow-sm"
              >
                PROFILE
              </div>
            </div>

            <!-- Nickname & Email -->
            <div class="text-center sm:text-left mb-2 sm:mb-6">
              <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white">
                {{ profile?.nickname || 'Nickname' }}
              </h1>
              <p class="text-lg font-bold text-black dark:text-gray-400 mt-1">
                {{ auth.user.value?.email }}
              </p>
            </div>
          </div>

          <!-- Edit Button -->
          <div class="flex justify-center sm:justify-end mb-4 sm:mb-6">
            <button 
              class="flex items-center gap-2 bg-[#2E65F3] hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-colors text-lg" 
              @click="openEditModal"
            >
              <span>แก้ไขโปรไฟล์</span>
            </button>
          </div>

        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div class="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-xl shadow-2xl relative my-8">
        <!-- Modal Header -->
        <div class="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 class="text-2xl font-extrabold text-gray-900 dark:text-white">แก้ไขโปรไฟล์</h2>
          <button class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 w-10 h-10 rounded-full flex items-center justify-center transition-colors" @click="closeEditModal">
            <i class="pi pi-times text-xl"/>
          </button>
        </div>

        <!-- Modal Body -->
        <div :key="modalKey" class="p-6 space-y-6">
          <Message v-if="errorMessage" severity="error" :closable="false" class="mb-4">{{ errorMessage }}</Message>
          <Message v-if="successMessage" severity="success" :closable="false" class="mb-4">{{ successMessage }}</Message>

          <!-- 
            DISABLED_IMAGE_UPLOAD
            Banner and Avatar Upload UI commented out 
          -->

          <!-- Nickname -->
          <div>
            <label class="block text-base font-bold text-gray-700 dark:text-gray-300 mb-2">ชื่อเล่น (Nickname)</label>
            <input v-model="editForm.nickname" type="text" autocomplete="off" :placeholder="profile?.nickname || 'ตั้งชื่อเล่นใหม่...'" class="w-full px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all" >
            <p class="text-xs text-gray-500 mt-1">เว้นว่างไว้หากไม่ต้องการเปลี่ยน</p>
          </div>

          <!-- New Password -->
          <div>
            <label class="block text-base font-bold text-gray-700 dark:text-gray-300 mb-2">รหัสผ่านใหม่ (ไม่บังคับ)</label>
            <input v-model="editForm.newPassword" type="password" autocomplete="new-password" placeholder="เว้นว่างไว้ถ้าไม่ต้องการเปลี่ยน" class="w-full px-5 py-3.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all" >
          </div>

        </div>

        <!-- Modal Footer -->
        <div class="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-b-3xl">
          <button :disabled="isSaving" class="px-6 py-3 rounded-xl text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50" @click="closeEditModal">
            ยกเลิก
          </button>
          <button :disabled="isSaving" class="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" @click="openPasswordModal">
            <span>บันทึกข้อมูล</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Password Confirmation Modal -->
    <div v-if="isPasswordModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div class="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md shadow-2xl relative my-8">
        <!-- Modal Header -->
        <div class="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 class="text-xl font-extrabold text-gray-900 dark:text-white">ยืนยันตัวตน</h2>
          <button class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 w-10 h-10 rounded-full flex items-center justify-center transition-colors" @click="closePasswordModal">
            <i class="pi pi-times text-xl"/>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 space-y-6">
          <Message v-if="errorMessage" severity="error" :closable="false" class="mb-4">{{ errorMessage }}</Message>
          <Message v-if="successMessage" severity="success" :closable="false" class="mb-4">{{ successMessage }}</Message>

          <div class="bg-red-50 dark:bg-red-900/10 p-5 rounded-2xl border border-red-100 dark:border-red-800/30">
            <label class="block text-base font-extrabold text-red-700 dark:text-red-400 mb-2">
              <i class="pi pi-lock mr-1"/> ยืนยันรหัสผ่านปัจจุบัน (จำเป็น)
            </label>
            <p class="text-sm font-medium text-red-600/80 dark:text-red-400/80 mb-4">กรุณากรอกรหัสผ่านปัจจุบันของคุณเพื่อบันทึกการเปลี่ยนแปลงใดๆ</p>
            <input v-model="editForm.currentPassword" type="password" autocomplete="current-password" placeholder="รหัสผ่านปัจจุบัน..." class="w-full px-5 py-3.5 rounded-xl border border-red-200 dark:border-red-800/50 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-red-500 outline-none transition-all" >
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-b-3xl">
          <button :disabled="isSaving" class="px-6 py-3 rounded-xl text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50" @click="closePasswordModal">
            ยกเลิก
          </button>
          <button :disabled="isSaving || !editForm.currentPassword" class="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" @click="saveProfile">
            <i v-if="isSaving" class="pi pi-spin pi-spinner"/>
            <span>ยืนยัน</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Image Viewer Modal -->
    <div v-if="viewerImage" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" @click="viewerImage = null">
      <button class="absolute top-6 right-6 text-white hover:text-gray-300 w-12 h-12 flex items-center justify-center bg-black/50 rounded-full transition-colors z-10" @click.stop="viewerImage = null">
        <i class="pi pi-times text-2xl"/>
      </button>
      <img :src="viewerImage" class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" @click.stop >
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useNuxtApp } from '#app'
import { useAuth } from '~/features/auth/composables/useAuth'
import { useProfile } from '~/features/profile/composables/useProfile'
// Note: using built-in PrimeVue components if available, otherwise just use standard HTML structure
// In Nuxt with PrimeVue, <Message> usually auto-imports, but if not we can use custom div

const { $storage } = useNuxtApp() as any
const auth = useAuth()
const { profile, loading, updateProfile } = useProfile()

const isModalOpen = ref(false)
const isPasswordModalOpen = ref(false)
const isSaving = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const modalKey = ref(0)
const viewerImage = ref<string | null>(null)

const bannerFile = ref<File | null>(null)
const avatarFile = ref<File | null>(null)
const bannerPreviewUrl = ref<string | null>(null)
const avatarPreviewUrl = ref<string | null>(null)

const editForm = reactive({
  nickname: '',
  newPassword: '',
  currentPassword: ''
})

const openEditModal = () => {
  modalKey.value++
  editForm.nickname = ''
  editForm.newPassword = ''
  editForm.currentPassword = ''
  bannerFile.value = null
  avatarFile.value = null
  bannerPreviewUrl.value = profile.value?.bannerUrl || null
  avatarPreviewUrl.value = profile.value?.avatarUrl || null
  errorMessage.value = ''
  successMessage.value = ''
  isModalOpen.value = true
}

const closeEditModal = () => {
  if (isSaving.value) return
  isModalOpen.value = false
}

const openPasswordModal = () => {
  isModalOpen.value = false
  isPasswordModalOpen.value = true
}

const closePasswordModal = () => {
  if (isSaving.value) return
  isPasswordModalOpen.value = false
  isModalOpen.value = true // go back to edit modal
}

const onBannerChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    bannerFile.value = target.files[0]
    bannerPreviewUrl.value = URL.createObjectURL(target.files[0])
  }
}

const onAvatarChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    avatarFile.value = target.files[0]
    avatarPreviewUrl.value = URL.createObjectURL(target.files[0])
  }
}

const uploadFile = async (file: File, folder: string) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${folder}/${auth.user.value?.uid}-${Date.now()}.${fileExt}`
  const sRef = storageRef($storage, fileName)
  await uploadBytes(sRef, file)
  return await getDownloadURL(sRef)
}

const saveProfile = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  
  if (!editForm.currentPassword) {
    errorMessage.value = 'กรุณากรอกรหัสผ่านปัจจุบัน'
    return
  }

  isSaving.value = true

  try {
    // 1. Re-authenticate to ensure current password is correct
    await auth.reauthenticate(editForm.currentPassword)

    const updates: any = {}

    /* DISABLED_IMAGE_UPLOAD
    // 2. Upload banner if changed
    if (bannerFile.value) {
      updates.bannerUrl = await uploadFile(bannerFile.value, 'banners')
    }

    // 3. Upload avatar if changed
    if (avatarFile.value) {
      updates.avatarUrl = await uploadFile(avatarFile.value, 'avatars')
    }
    */

    // 4. Update nickname if changed and not empty
    if (editForm.nickname && editForm.nickname.trim() !== '' && editForm.nickname !== profile.value?.nickname) {
      updates.nickname = editForm.nickname.trim()
    }

    // 5. Update password if provided
    if (editForm.newPassword) {
      await auth.changePassword(editForm.newPassword)
    }

    // 6. Save profile updates to firestore if there are any
    if (Object.keys(updates).length > 0) {
      await updateProfile(updates)
    }

    successMessage.value = 'อัปเดตข้อมูลสำเร็จ'
    
    // Close modal after short delay on success
    setTimeout(() => {
      isPasswordModalOpen.value = false
    }, 1500)

  } catch (error: any) {
    console.error('Failed to update profile:', error)
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
      errorMessage.value = 'รหัสผ่านปัจจุบันไม่ถูกต้อง'
    } else {
      errorMessage.value = 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล: ' + error.message
    }
  } finally {
    isSaving.value = false
  }
}
</script>

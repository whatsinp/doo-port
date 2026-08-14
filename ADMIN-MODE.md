# การเปิดใช้งานโหมดผู้ดูแลระบบ (Admin Mode)

หน้านี้อธิบายวิธีการนำเมนู **ผู้ดูแลระบบ (Admin)** กลับมาแสดงผลบนแถบนำทาง (Navigation Bar) 
โดยในปัจจุบันเมนูนี้ถูกซ่อนไว้เพื่อไม่ให้ผู้ใช้ทั่วไปมองเห็น แต่ตัวไฟล์โค้ด (หน้าเพจ) ยังคงอยู่ครบถ้วน

## วิธีการเปิดใช้งาน (Enable Admin Menu)

หากคุณต้องการเปิดเมนูผู้ดูแลระบบขึ้นมาใหม่ ให้ทำตามขั้นตอนดังนี้:

1. เปิดไฟล์ `app/layouts/default.vue`
2. ค้นหาบรรทัดที่มีข้อความว่า `ผู้ดูแลระบบ` หรือ `<NuxtLink href="/admin"` (มีทั้งหมด 2 จุด: สำหรับหน้าจอคอมพิวเตอร์ และสำหรับหน้าจอมือถือ)
3. คุณจะพบว่าโค้ดถูกคอมเมนต์ (Comment) ซ่อนไว้ด้วยสัญลักษณ์ `<!--` และ `-->` 
4. ทำการลบสัญลักษณ์ `<!--` และ `-->` ออก เพื่อให้โค้ดทำงานได้ปกติ

### จุดที่ 1: เมนูบน Desktop
```html
<!-- ลบสองบรรทัดนี้ออก -->
<!-- 
<NuxtLink href="/admin"
  class="border-transparent text-red-500 dark:text-red-400 hover:border-red-600 hover:text-red-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold">
  ผู้ดูแลระบบ</NuxtLink>
-->
```

### จุดที่ 2: เมนูบน Mobile
```html
<!-- ลบสองบรรทัดนี้ออก -->
<!-- 
<NuxtLink href="/admin" @click="isMobileMenuOpen = false"
  class="block px-4 py-3 rounded-xl text-base font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
  <i class="pi pi-shield mr-2"></i> ผู้ดูแลระบบ
</NuxtLink>
-->
```

5. กดบันทึก (Save) ไฟล์ `app/layouts/default.vue`
6. เมนู **ผู้ดูแลระบบ** จะกลับมาแสดงผลทันที!

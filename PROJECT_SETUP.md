# คู่มือการติดตั้งและทดสอบโปรเจ็กต์ (Project Setup Guide)

เอกสารนี้จะอธิบายขั้นตอนการโคลน (Clone) โปรเจ็กต์จาก GitHub ลงเครื่องใหม่ และสิ่งที่ต้องติดตั้งทั้งหมดเพื่อให้สามารถรันและทดสอบระบบในเครื่อง Local ได้อย่างสมบูรณ์

---

## 1. สิ่งที่ต้องมีในเครื่อง (Prerequisites)
ก่อนเริ่มทำงาน กรุณาตรวจสอบและติดตั้งโปรแกรมเหล่านี้ลงในเครื่องของคุณ:

1. **Node.js** (แนะนำเวอร์ชัน 18.x หรือ 20.x ขึ้นไป)
   - ดาวน์โหลด: [https://nodejs.org/](https://nodejs.org/)
   - ทดสอบว่าลงสำเร็จ: เปิด Terminal แล้วพิมพ์ `node -v` และ `npm -v`
2. **Java (JRE หรือ JDK)** 
   - *จำเป็นมาก* สำหรับการรัน **Firebase Emulators** (ระบบจำลองฐานข้อมูลในเครื่อง)
   - ดาวน์โหลด: [https://www.java.com/en/download/](https://www.java.com/en/download/) หรือติดตั้ง OpenJDK
   - ทดสอบว่าลงสำเร็จ: เปิด Terminal แล้วพิมพ์ `java -version`
3. **Git**
   - ดาวน์โหลด: [https://git-scm.com/](https://git-scm.com/)

---

## 2. ขั้นตอนการติดตั้ง (Installation Steps)

เปิด Command Prompt (CMD), PowerShell หรือ Terminal แล้วทำตามคำสั่งทีละขั้นตอนดังนี้:

### ขั้นตอนที่ 1: Clone โปรเจ็กต์
```bash
git clone <URL_ของ_GITHUB_REPO>
cd doo-port
```
*(แทนที่ `<URL_ของ_GITHUB_REPO>` ด้วยลิ้งก์ Git ของโปรเจ็กต์นี้)*

### ขั้นตอนที่ 2: ติดตั้ง Dependencies
ติดตั้งแพ็กเกจที่จำเป็นทั้งหมดของ Node.js โดยใช้คำสั่ง:
```bash
npm install
```

### ขั้นตอนที่ 3: ตั้งค่าตัวแปรสภาพแวดล้อม (Environment Variables)
โปรเจ็กต์นี้มีการเชื่อมต่อกับ Firebase คุณต้องสร้างไฟล์ตั้งค่าก่อน:
1. คัดลอกไฟล์ `.env.example` แล้วเปลี่ยนชื่อเป็น `.env`
2. หากใช้ Command Line (สำหรับ Windows) สามารถพิมพ์คำสั่งนี้:
```bash
copy .env.example .env
```
*(สำหรับ Mac/Linux ใช้คำสั่ง: `cp .env.example .env`)*
3. เปิดไฟล์ `.env` ด้วย Code Editor แล้วกรอกค่าตั้งค่าของ Firebase ลงไปให้ครบถ้วน

---

## 3. ขั้นตอนการรันโปรเจ็กต์ (Running the App)

ในการจะรันโปรเจ็กต์นี้ให้ทำงานได้สมบูรณ์ คุณจำเป็นต้องเปิดหน้าต่าง **Terminal 2 หน้าต่าง** (เพื่อรันเซิร์ฟเวอร์จำลองฐานข้อมูล และเซิร์ฟเวอร์ของเว็บไซต์ไปพร้อมๆ กัน)

### หน้าต่างที่ 1: รัน Firebase Emulators (ฐานข้อมูลจำลอง)
เปิด Terminal หน้าต่างที่ 1 ตรวจสอบว่าอยู่ในโฟลเดอร์ `doo-port` จากนั้นพิมพ์คำสั่ง:
```bash
npm run emulators
```
*รอจนกว่าจะขึ้นข้อความว่า "All emulators ready! It is now safe to connect your app." ห้ามปิดหน้าต่างนี้ระหว่างทดสอบ*

### หน้าต่างที่ 2: รัน Nuxt Dev Server (เซิร์ฟเวอร์เว็บไซต์)
เปิด Terminal **หน้าต่างใหม่ (หน้าต่างที่ 2)** ตรวจสอบว่าอยู่ในโฟลเดอร์ `doo-port` จากนั้นพิมพ์คำสั่ง:
```bash
npm run dev
```
*เมื่อระบบรันเสร็จสิ้น จะแสดง URL (เช่น `http://localhost:3000`) ให้คุณนำ URL นี้ไปเปิดใน Web Browser ได้เลย*

---

## สรุปคำสั่งแบบย่อ (สำหรับก็อปวาง)

```bash
# 1. โคลนและเข้าโฟลเดอร์
git clone <URL_ของ_GITHUB_REPO>
cd doo-port

# 2. ติดตั้งแพ็กเกจ
npm install

# 3. สร้างไฟล์ .env
copy .env.example .env

# 4. รันระบบ (เปิด 2 Terminal)
# Terminal 1:
npm run emulators

# Terminal 2:
npm run dev
```

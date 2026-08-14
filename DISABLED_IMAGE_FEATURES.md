# DISABLED_IMAGE_FEATURES

This file documents the image upload features that were intentionally disabled to save Firebase Storage costs, or until the Firebase Storage is fully set up and ready to be used.

When you (the user) are ready to re-enable image uploads, please tell the AI to "Read `DISABLED_IMAGE_FEATURES.md` and restore the image features."

## Files Modified

### 1. `app/pages/auth.vue`
- **UI Disabled**: The "Avatar Upload" block in the registration form was replaced with an HTML comment containing `DISABLED_IMAGE_UPLOAD`.
- **Logic Disabled**: The block of code inside `handleRegister` that uploads the `registerAvatarFile` to Firebase Storage and gets the download URL was commented out using a JS block comment `/* DISABLED_IMAGE_UPLOAD ... */`.

### 2. `app/pages/profile.vue`
- **UI Disabled**: The "Banner Upload" and "Avatar Upload" inputs inside the "Edit Profile Modal" were replaced with an HTML comment containing `DISABLED_IMAGE_UPLOAD`.
- **Logic Disabled**: The block of code inside `saveProfile` that uploads the `bannerFile` and `avatarFile` to Firebase Storage and gets their download URLs was commented out using a JS block comment `/* DISABLED_IMAGE_UPLOAD ... */`.

## How to Restore
1. Search for `DISABLED_IMAGE_UPLOAD` in `app/pages/auth.vue` and `app/pages/profile.vue`.
2. Uncomment the UI blocks in the `<template>` sections.
3. Uncomment the logic blocks in the `<script setup>` sections.

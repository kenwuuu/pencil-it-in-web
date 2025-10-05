<template>
  <div
    class="relative max-w-md mx-auto md:max-w-2xl mt-28 min-w-0 break-words bg-base-100 w-full mb-6 shadow-lg rounded-xl"
  >
    <div class="px-6">
      <div class="flex flex-wrap justify-center">
        <div class="w-full flex justify-center -mb-10">
          <div class="avatar relative group cursor-pointer">
            <div class="w-40 rounded-full">
              <img
                :src="profilePhotoUrl"
                class="absolute left-1/2 -top-15 transform -translate-x-1/2 shadow-xl rounded-full"
              />
              <div
                class="absolute -top-15 bottom-15 inset-0 bg-black/60 shadow-xl rounded-full opacity-0 group-hover:opacity-90 transition-opacity flex items-center justify-center"
              >
                <iconify-icon class="text-white text-2xl" icon="mdi:pencil"></iconify-icon>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full text-center">
          <div class="flex justify-center">
            <!--                          <div class="p-3 text-center">-->
            <!--                              <span class="text-xl font-bold block uppercase tracking-wide text-slate-700">3,360</span>-->
            <!--                              <span class="text-sm text-slate-400">Photos</span>-->
            <!--                          </div>-->
            <!--                          <div class="p-3 text-center">-->
            <!--                              <span class="text-xl font-bold block uppercase tracking-wide text-slate-700">2,454</span>-->
            <!--                              <span class="text-sm text-slate-400">Followers</span>-->
            <!--                          </div>-->
            <!--      -->
            <!--                          <div class="p-3 text-center">-->
            <!--                              <span class="text-xl font-bold block uppercase tracking-wide text-slate-700">564</span>-->
            <!--                              <span class="text-sm text-slate-400">Following</span>-->
            <!--                          </div>-->
          </div>
        </div>
      </div>

      <!-- Names and location -->
      <div class="text-center mt-2">
        <h3 class="text-2xl font-bold leading-normal mb-1">
          {{ profile.first_name }} {{ profile.last_name }}
        </h3>
        <div class="text-xs mt-0 mb-2 text-slate-400 font-bold uppercase">
          <p v-if="profile.username" class="fas fa-map-marker-alt mr-2 text-slate-400">
            @{{ profile.username }}
          </p>
          <p v-if="profile.city_and_state" class="fas fa-map-marker-alt mr-2 text-slate-400">
            {{ profile.city_and_state }}
          </p>
        </div>
      </div>

      <!-- Stats and Settings -->
      <div class="mt-6 py-6 border-t border-slate-200 text-center">
        <div class="flex flex-wrap justify-center">
          <div class="w-full px-4"></div>
        </div>
        <div>
          <!--  todo add confirmation modal to confirm logout  -->
          <button id="logout-btn" class="btn btn-outline btn-warning mb-2" @click="logOut">
            Logout
          </button>
        </div>
        <div>
          <!--  todo add confirmation modal to confirm delete  -->
          <!--  todo only show if profile.id matches supabase.user.id  -->
          <button class="btn btn-outline btn-error">Delete account</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { supabase } from '../../../../src/supabase-client/supabase-client.ts'
import { getUser } from '../../../../src/profile/services/get-profile.ts'
import { getProfilePhotoUrl } from '../../../../src/profile/services/get-profile-photo-url.ts'
import { logoutAndRedirect } from '../../../../src/auth/services/logout.ts'
import Alpine from 'alpinejs'

const currentUserId = ref(-1)
const profile = ref({})
const profilePhotoUrl = ref('')

async function loadProfile(userId: string) {
  console.log('Loading profile, ID: ', userId)
  const user = await getUser(userId)
  console.log('Loaded user profile: ', user)
  try {
    profile.value = user
    profilePhotoUrl.value = await getProfilePhotoUrl()

    // todo switch this to Pinia after we rewrite header in Vue
    Alpine.store('profile_photo').set(profilePhotoUrl.value)
  } catch (error) {
    console.error('Error fetching profile:', error)
  }
}

function logOut() {
  logoutAndRedirect()
}

onMounted(async () => {
  // Fetch current user and profile
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) {
    console.error(userError)
    return
  }
  currentUserId.value = user.id
  await loadProfile(currentUserId.value)
})
</script>

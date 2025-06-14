import { getUser } from '@/profile/services/get-profile.js';
import { supabase } from '@/supabase-client/supabase-client.js';
import { logoutAndRedirect } from '@/auth/services/logout.js';
import { getProfilePhotoUrl } from '@/profile/services/get-profile-photo-url.js';

class ProfileContainer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="relative max-w-md mx-auto md:max-w-2xl mt-28 min-w-0 break-words bg-base-100 w-full mb-6 shadow-lg rounded-xl">
          <div class="px-6" x-data="profileData()">
              <div class="flex flex-wrap justify-center">
                  <div class="w-full flex justify-center -mb-10">
                    <div
                      class="avatar relative group cursor-pointer"
                      x-data="{ showOverlay: false }"
                      @click="
                        showOverlay = true;
                        setTimeout(() => showOverlay = false, 500);
                      "
                    >
                          <div class="w-40 rounded-full">
                            <img :src="$store.profile_photo.url" class="absolute left-1/2 -top-15 transform -translate-x-1/2 shadow-xl rounded-full"/>
                            <div
                                :class="{ 'opacity-90': showOverlay }"
                                class="absolute -top-15 bottom-15 inset-0 bg-black/60 shadow-xl rounded-full opacity-0 group-hover:opacity-90 transition-opacity flex items-center justify-center">
                              <iconify-icon class="text-white text-2xl" icon="mdi:pencil"></iconify-icon>
                            </div>
                          </div>
                      </div>
                  </div>
                  <div class="w-full text-center ">
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
                  <h3 class="text-2xl font-bold leading-normal mb-1" x-show="profile.first_name" x-text="profile.first_name + ' ' + profile.last_name"></h3>
                  <div class="text-xs mt-0 mb-2 text-slate-400 font-bold uppercase">
                      <p class="fas fa-map-marker-alt mr-2 text-slate-400" x-show="profile.username" x-text="'@' + profile.username"></p>
                      <p class="fas fa-map-marker-alt mr-2 text-slate-400" x-show="profile.city_and_state" x-text="profile.city_and_state"></p>
                  </div>
              </div>
              
              <!-- Stats and Settings -->
              <div class="mt-6 py-6 border-t border-slate-200 text-center">
                  <div class="flex flex-wrap justify-center">
                      <div class="w-full px-4">
                      </div>
                  </div>
                  <div>
                    <!--  todo add confirmation modal to confirm logout  -->
                    <button x-on:click="logOut()" id="logout-btn" class="btn btn-outline btn-warning mb-2">Logout</button>
                  </div>
                  <div>
                    <!--  todo add confirmation modal to confirm delete  -->
                    <!--  todo only show if profile.id matches supabase.user.id  -->
                    <button class="btn btn-outline btn-error">Delete account</button>
                  </div>
              </div>
          </div>
      </div>
    `;
  }
}

function profileData() {
  return {
    currentUserId: -1,
    profile: {},
    async init() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      this.currentUserId = user.id;

      // todo remove this.currentUserId and init based off the user we're viewing, whether it's ourselves or a friend
      await this.loadProfile(this.currentUserId);
    },
    async loadProfile(userId) {
      try {
        this.profile = await getUser(userId);
        const url = await getProfilePhotoUrl();
        Alpine.store('profile_photo').set(url);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    },
    async logOut() {
      logoutAndRedirect();
    },
    // async removeFriendship(friendId) {
    //   try {
    //     await apiRemoveFriendship(friendId);
    //     await this.loadProfile();
    //   } catch (err) {
    //     console.error('Error in AlpineJS removeFriendship:', err);
    //   }
    // },
    // async addFriend(input) {
    //   let username = input.value.trim();
    //   if (!username) return;
    //
    //   insertFriendship(username)
    //     .then(() => {
    //       input.value = '';
    //       this.loadProfile();
    //     })
    //     .catch(err => {
    //       console.error('Failed to add friend:', err);
    //     });
    // },
  };
}

window.profileData = profileData;

customElements.define('profile-container', ProfileContainer);

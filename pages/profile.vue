<!-- pages/profile.vue -->
<template>
    <div class="min-h-screen bg-gray-100">
      <NavBar />
      <div class="py-10">
        <header>
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 class="text-3xl font-bold leading-tight text-gray-900">Profile</h1>
          </div>
        </header>
        <main>
          <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white shadow overflow-hidden sm:rounded-lg">
              <div class="px-4 py-5 sm:px-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-20 w-20">
                    <img
                      :src="authStore.user?.profile_picture || '/default-avatar.png'"
                      class="h-20 w-20 rounded-full"
                      alt="Profile picture"
                    />
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">
                      {{ authStore.user?.username }}
                    </h3>
                    <p class="mt-1 max-w-2xl text-sm text-gray-500">
                      {{ authStore.user?.email }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="border-t border-gray-200">
                <dl>
                  <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Role</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {{ authStore.user?.role }}
                    </dd>
                  </div>
                  <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Bio</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {{ authStore.user?.bio || 'No bio provided' }}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </template>
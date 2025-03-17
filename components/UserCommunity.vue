<template>
    <div class="feed">
     
    </div>
  </template>
  
  <script setup>
  const posts = ref([
    {
      username: 'Name',
      handle: '@username',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor eros at felis fermentum, id efficitur felis malesuada.',
      comments: 21,
      likes: 22,
      shares: 23,
      isLiked: false,
      isOwner: true,
      showStatus: false,
      showFollow: false,
      isCommunity: false
    },
    {
      username: 'Name',
      handle: '@username',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed auctor eros at felis fermentum, id efficitur felis malesuada.',
      comments: 78,
      likes: 66,
      shares: 50,
      isLiked: false,
      isOwner: false,
      showStatus: true,
      showFollow: 'Follow',
      isCommunity: false
    },
    {
      username: 'Community Name',
      content: 'This is a community post. Join the community to see more content like this.',
      comments: 21,
      likes: 22,
      shares: 23,
      isLiked: false,
      isOwner: false,
      showStatus: true,
      showFollow: 'join',
      isCommunity: true
    }
  ])
  
  const activeDropdown = ref(null)
  
  const toggleDropdown = (index) => {
    activeDropdown.value = activeDropdown.value === index ? null : index
  }
  
  const handleLike = (index) => {
    const post = posts.value[index]
    post.isLiked = !post.isLiked
    post.likes += post.isLiked ? 1 : -1
  }
  
  const handleComment = (index) => {
    // Add comment functionality
    console.log('Comment clicked on post:', index)
  }
  
  const handleShare = (index) => {
    // Add share functionality
    console.log('Share clicked on post:', index)
  }
  
  // Close dropdown when clicking outside
  onMounted(() => {
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.relative')) {
        activeDropdown.value = null
      }
    })
  })
  
  onUnmounted(() => {
    document.removeEventListener('click', () => {})
  })
  </script>
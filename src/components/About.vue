<template>
  <div class="container mx-auto justify-center gap-2 grid lg:grid-cols-3 grid-cols-1 mb-10">
    <div class="hero-content text-center text-neutral-600">
      <div class="max-w-screen-md">
        <h1 class="mb-5 text-5xl font-bold">关于 <span class="llama">电影侦探社</span></h1>
        <p class="mb-2 text-justify">
          《骆驼电影侦探》是一个项目，它的目标是利用 Llama3 模型的强大功能，结合来自 The Movie Database (TMDB) 的最新电影信息，打造一个有趣的测验游戏。
          <br /><br />
        </p>
        <h2 class="text-2xl llama">后端</h2>
        <p class="mb-2 text-justify">
          后端基于 FastAPI 和 Python 构建，采用了检索增强生成（RAG）技术，通过实时元数据来增强查询内容。利用 Jinja
          模板技术，后端将提示生成过程分为基础、个性化、以及数据增强几个模块，这样就能够生成既准确又吸引人的测验题目。
        </p>
        <!-- 添加一点间距 -->
        <br /><br />
        <h2 class="text-2xl llama">前端</h2>
        <p class="mb-2 text-justify">
          前端采用 Vue 3 和 Vite 技术，借助 daisyUI 和 Tailwind CSS 实现高效的前端开发。这些工具共同提供了一个流畅而现代的用户界面，使用户能够轻松地与后端系统进行交互。
        </p>
        <br /><br />
        <h2 class="text-2xl llama">概述</h2>
        <p class="mb-2 text-justify">
          在《骆驼电影侦探》游戏中，测验的答案将再次通过大语言模型（LLM）来解读，实现动态计分和个性化回应。这不仅展示了在游戏设计和开发中结合使用 LLM 和 RAG
          的巨大潜力，也为打造真正个性化的游戏体验铺平了道路。此外，它还展示了通过加入 LLM 创造吸引人的测验游戏或教育游戏的可能性。添加或更换个性或语言就像添加更多的 Jinja
          模板一样简单。这样可以轻松改变整个游戏体验，大大减轻了开发者的负担。不妨亲自尝试，改变测验配置中 AI 的个性吧。
        </p>
      </div>
    </div>
    <div class="col-span-2 card  bg-zinc-500 shadow-xl m-5">
      <div class="card-body">
        <img src="../assets/system-overview.png" alt="system overview" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About'
}
</script>

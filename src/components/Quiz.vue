<template>
  <div>
    <vue-particles v-if="answerData && answerData.result.points > 0" id="tsparticles" :options=particleSettings />
    <div v-if="!gameStarted && !loading" class="hero h-[calc(100vh-68px)]"
      :style="{ 'background-image': `url(${this.backgroundImg})` }">
      <div class="hero-overlay bg-opacity-95"></div>
      <div class="hero-content text-center text-neutral-content mb-16">
        <div class="max-w-screen-md">
          <h1 class="mb-5 text-5xl font-bold"><span class="llama">骆驼电影</span>侦探社</h1>
          <p class="mb-5">点击“开始游戏”后，系统会随机挑选一部电影，然后 Llama3 会根据这部电影设计一个谜题给你。你需要做的就是尝试猜出这部电影的名称。来试一试吧，看看你能拿到多少分数！</p>
          <div class="collapse bg-neutral-900">
            <input type="checkbox" class="peer" />
            <div class="text-left collapse-title bg-neutral-900 peer-checked:bg-info peer-checked:text-info-content">
              更多偏好设置
            </div>
            <div class="collapse-content bg-neutral-900 peer-checked:bg-indigo-900">
              <p class="text-left py-3">使用下面的设置，你可以根据自己的喜好定制体验，并调节其难度。
                默认的设置为均衡的体验请，请小心调整这些设置。</p>
              <div class="label">
                <span class="label-text text-white">最少投票数量: </span><span class="badge badge-secondary badge-outline">{{
      minVotes
    }}</span>
              </div>
              <input type="range" min="100" max="5000" value="1000" class="range range-secondary" v-model="minVotes" />
              <div class="label">
                <span class="label-text text-white">最低平均评级:</span><span class="badge badge-info badge-outline">{{
      minAvgRating }}</span>
              </div>
              <input type="range" min="1" max="8" value="5" step="1" class="range range-info" v-model="minAvgRating" />
              <div class="label">
                <span class="label-text text-white">口碑-:</span>
              </div>
              <input type="range" min="1" max="3" value="3" step="1" class="range range-warning" v-model="popularity" />
              <div class="w-full flex justify-between text-xs px-2">
                <span>我都知道，挑战我吧</span>
                <span>最受欢迎</span>
              </div>
              <div class="grid grid-cols-2 gap-2 items-end mt-4">
                <div>
                  <div class="label"><span class="label-text text-white">AI 性格 (<i>experimental</i>)</span></div>
                  <select v-model="personality" class="select select-primary w-full max-w-xs">
                    <option value="default">默认</option>
                    <option value="christmas">圣诞老人</option>
                    <option value="scientist">科学家</option>
                    <option value="dad">幽默爸爸</option>
                  </select>
                </div>
                <!-- <div>
                  <div class="label"><span class="label-text text-white">语言 (<i>experimental</i>)</span></div>
                  <select v-model="language" class="select select-primary w-full max-w-xs">
                    <option value="default">英语</option>
                    <option value="german">德语</option>
                    <option value="chinese">中文</option>
                  </select>
                </div> -->
              </div>
            </div>
          </div>
          <button @click="startQuiz" class="btn btn-outline btn-success mt-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512">
              <path fill="currentColor"
                d="M464.7 221.5L86.1 7.3C52.5-11.7 25 7.5 25 50v412c0 42.5 27.5 61.7 61.1 42.7l378.6-214.1c33.5-19.1 33.5-50.1 0-69.1" />
            </svg>
            开始游戏
          </button>
        </div>
      </div>
    </div>

    <div v-if="gameStarted || loading" class="container mx-auto flex justify-center py-4 px-4">
      <div v-if="loading" class="text-center"><span class="loading loading-lg loading-spinner text-info"></span></div>
      <div v-if="gameStarted && !loading" class="grid md:grid-cols-3 grid-cols-1 gap-4">
        <div class="md:row-span-2">
          <div class="divider divider-info py-4 my-6 md:hidden">电影海报</div>
          <figure class="max-w-lg">
            <img ref="posterImage" class="h-auto max-w-full rounded-lg opacity-0" :src="quizData.movie.poster_url"
              @load="pixelatePoster">
          </figure>
          <div ref="posterCanvasContainer"><canvas ref="posterCanvas" class="h-auto max-w-full rounded-lg"></canvas>
          </div>
        </div>

        <!-- Game running -->
        <div v-if="!processingAnswer && !gameFinished"
          class="md:col-span-2 md:col-start-2 row-start-1 mockup-window bg-base-300">
          <div class="grid grid-cols-1 gap-4 px-4 py-4">

            <div class="chat chat-start">
              <div class="chat-image avatar">
                <div class="w-10 rounded-full">
                  <img alt="Tailwind CSS chat bubble component" :src="generateRoboHash()" />
                </div>
              </div>
              <div class="chat-header">
                侦探
              </div>
              <div class="chat-bubble">{{ quizData.question.question }}</div>
              <div class="chat-footer opacity-50">
                会话 ID: {{ quizData.quiz_id }}
              </div>
            </div>

            <div class="chat chat-start">
              <div class="chat-image avatar">
                <div class="w-10 rounded-full">
                  <img alt="Tailwind CSS chat bubble component" :src="generateRoboHash()" />
                </div>
              </div>
              <div class="chat-header">
                侦探
              </div>
              <div class="chat-bubble">{{ quizData.question.hint1 }}</div>
              <div class="chat-footer opacity-50">
                提示 1
              </div>
            </div>

            <div class="content-center" :class="{ blurred: !showHint2 }" @mouseover="showHint2 = true"
              @mouseleave="showHint2 = false">
              <div class="chat chat-start">
                <div class="chat-image avatar">
                  <div class="w-10 rounded-full">
                    <img alt="Tailwind CSS chat bubble component" :src="generateRoboHash()" />
                  </div>
                </div>
                <div class="chat-header">
                  侦探
                </div>
                <div class="chat-bubble">{{ quizData.question.hint2 }}</div>
                <div class="chat-footer opacity-50">
                  提示 2
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Processing Answer -->
        <div v-if="processingAnswer && !gameFinished"
          class="md:col-span-2 md:col-start-2 row-start-1 mockup-window bg-base-300">
          <div class="text-center"><span class="loading loading-lg loading-spinner text-info"></span></div>
        </div>

        <!-- Game finished -->
        <div v-if="!processingAnswer && gameFinished"
          class="md:col-span-2 md:col-start-2 row-start-1 mockup-window bg-base-300">

          <div class="chat chat-end px-3">
            <div class="chat-header">
              柯南
            </div>
            <div class="chat-bubble chat-bubble-info">{{ answerData.user_answer }}</div>
          </div>

          <div class="chat chat-start">
            <div class="chat-image avatar">
              <div class="w-10 rounded-full">
                <img alt="Tailwind CSS chat bubble component" :src="generateRoboHash()" />
              </div>
            </div>
            <div class="chat-header">
              侦探
            </div>
            <div class="chat-bubble">{{ answerData.result.answer }}</div>
            <div class="chat-footer opacity-50">
              Session: {{ quizData.quiz_id }}
            </div>
          </div>

          <div class="chat chat-start">
            <div class="chat-image avatar">
              <div class="w-10 rounded-full">
                <img alt="Tailwind CSS chat bubble component" :src="generateRoboHash()" />
              </div>
            </div>
            <div class="chat-header">
              侦探
            </div>
            <div class="chat-bubble">我要找的电影是: <strong>{{ answerData.movie.title }}</strong></div>
            <div class="chat-footer opacity-50">
              Session: {{ quizData.quiz_id }}
            </div>
          </div>

          <div class="chat chat-start">
            <div class="chat-image avatar">
              <div class="w-10 rounded-full">
                <img alt="Tailwind CSS chat bubble component" :src="generateRoboHash()" />
              </div>
            </div>
            <div class="chat-header">
              侦探
            </div>
            <div class="chat-bubble">获得 {{ answerData.result.points }} 金币!</div>
            <div class="chat-footer opacity-50">
              金币
            </div>
          </div>

        </div>

        <div class="md:col-span-2 md:col-start-2 row-start-2">
          <div v-if="!gameFinished" class="flex flex-row gap-2">
            <div class="basis-3/4">
              <input type="text" v-model="userInput" @keyup.enter="submitAnswer" placeholder="请在此处键入您的答案"
                class="input input-bordered input-info w-full" />
            </div>
            <div class="basis-1/4">
              <button @click="submitAnswer" class="btn btn-outline btn-success w-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1792 1792">
                  <path fill="currentColor"
                    d="M1764 11q33 24 27 64l-256 1536q-5 29-32 45q-14 8-31 8q-11 0-24-5l-453-185l-242 295q-18 23-49 23q-13 0-22-4q-19-7-30.5-23.5T640 1728v-349l864-1059l-1069 925l-395-162q-37-14-40-55q-2-40 32-59L1696 9q15-9 32-9q20 0 36 11" />
                </svg>
                发送
              </button>
            </div>
          </div>
          <div v-if="!gameFinished" class="my-2">按 <kbd class="kbd">回车键 ↵</kbd> 或单击 <span class="text-success">发送</span>
            提交答案, 悬停文本，查看第二个提示</div>
          <div v-if="gameFinished">
            <router-link to="/" tag="button" class="btn btn-outline btn-info w-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
                <path fill="currentColor" fill-rule="evenodd" stroke="currentColor" stroke-linejoin="round"
                  stroke-width="4"
                  d="M44 40.836c-4.893-5.973-9.238-9.362-13.036-10.168c-3.797-.805-7.412-.927-10.846-.365V41L4 23.545L20.118 7v10.167c6.349.05 11.746 2.328 16.192 6.833c4.445 4.505 7.009 10.117 7.69 16.836Z"
                  clip-rule="evenodd" />
              </svg>
              返回主页
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- modal for API errors -->
    <dialog id="errorModal" class="modal modal-bottom sm:modal-middle">
      <div class="modal-box bg-neutral-400">
        <h3 class="font-bold text-lg llama">API 异常</h3>
        <p class="py-2">哎呀！出错了。请记住，这是一个原型。休息一下，看看电影再玩一次！</p>
        <p class="py-2 font-bold text-lg">异常信息:</p>
        <pre class="bg-neutral-950 rounded p-3 py-2 text-xs"
          style="white-space: pre-wrap; overflow-wrap: anywhere; color: white">{{ errorMessage }}</pre>
        <div class="modal-action">
          <button @click="closeModal" class="btn">返回主页</button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<style scoped>
.blurred {
  filter: blur(5px);
  cursor: pointer;
}
</style>

<script>
import Pixelate from 'pixelate'
import { API_BASE_URI, PARTICLE_SETTINGS } from '../config.js'
import backgroundImg from '../assets/bg-quiz.webp'
import { ref } from "vue"

export default {
  name: 'Quiz',
  data() {
    return {
      gameStarted: false,
      gameFinished: false,
      loading: false,
      quizData: null,
      showHint2: false,
      userInput: '',
      processingAnswer: false,
      answerData: null,
      backgroundImg: backgroundImg,
      minVotes: 1000,
      minAvgRating: 5,
      popularity: 3,
      personality: ref('default'),
      language: ref('default'),
      errorMessage: '',
      particleSettings: PARTICLE_SETTINGS
    }
  },
  created() {
    this.randomRobot = Math.floor(Math.random() * 1000)
  },
  methods: {
    showModal() {
      const modal = document.getElementById('errorModal')
      modal.showModal()
    },

    closeModal() {
      const modal = document.getElementById('errorModal')
      modal.close()
      // redirect to home after error message is closed
      this.$router.push('/')
    },

    async startQuiz() {
      try {
        const url = `${API_BASE_URI}/quiz`
        const requestBody = {
          vote_avg_min: this.minAvgRating,
          vote_count_min: this.minVotes,
          popularity: this.popularity,
          personality: this.personality,
          language: this.language
        }

        this.loading = true
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody),
          redirect: 'follow'
        })

        if (!response.ok) {
          const error = await response.text()
          throw new Error(error)
        }
        this.quizData = await response.json()
        this.gameStarted = true
      } catch (error) {
        this.errorMessage = error.toString()
        this.errorMessage = this.errorMessage.substring(0, 500)
        this.showModal()
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    async submitAnswer() {
      if (this.gameFinished || !this.userInput.trim()) {
        return
      }

      try {
        const url = `${API_BASE_URI}/quiz/${this.quizData.quiz_id}/answer`
        const requestBody = {
          answer: this.userInput.trim()
        }

        this.processingAnswer = true
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody),
          redirect: 'follow'
        })

        if (!response.ok) {
          const error = await response.text()
          throw new Error(error)
        }
        this.answerData = await response.json()
        this.userInput = ''
      } catch (error) {
        this.errorMessage = error.toString()
        this.errorMessage = this.errorMessage.substring(0, 500)
        this.showModal()
        console.error(error)
      } finally {
        this.processingAnswer = false
        this.gameFinished = true
        this.revealPoster()
      }
    },

    generateRoboHash() {
      return `https://robohash.org/${this.randomRobot}`
    },

    pixelatePoster() {
      const image = this.$refs.posterImage
      const canvas = this.$refs.posterCanvas

      this.pixelate = new Pixelate(image, { amount: 0.99, canvas })
      image.classList.toggle("hidden")
    },

    revealPoster() {
      const image = this.$refs.posterImage

      image.classList.toggle("hidden")
      image.classList.toggle("opacity-0")
      this.pixelate.canvas.classList.toggle("hidden")
    }
  }
}
</script>

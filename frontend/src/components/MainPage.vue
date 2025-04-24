<template>
  <AppLayout>
    <main class="main-content">
      <!-- Main visuals -->
      <div class="visual-container">
        <!-- Upper left square -->
        <div class="visual-section" role="button" @click="navigateToBarChart">
          <BarChart/>
        </div>
        <!-- Upper right square -->
        <div class="visual-section" role="button" @click="navigateToBubbleChart">
          <BubbleChart/>
        </div>
        <!-- Lower left square -->
        <div class="visual-section" role="button" @click="navigateToPieChart"> 
          <PieChart/>
        </div>
        <!-- Lower right square -->
        <div class="visual-section"></div>
      </div>
      <div class="bottom-visual-container">
        <div class="wide-visual-section" role="button" @click="navigateToLineChart">
          <LineChart/>
        </div>
      </div>
    </main>
  </AppLayout> 
  <UploadButton/>
</template>


<script setup>
import { useRouter} from 'vue-router';
import AppLayout from './AppLayout.vue';
import BarChart from './BarChart.vue';
import BubbleChart from './BubbleChart.vue';
import PieChart from './PieChart.vue';
import LineChart from './LineChart.vue';
import UploadButton from './UploadButton.vue';

const router = useRouter();

const navigateToBarChart = () => router.push('/bar-chart');
const navigateToBubbleChart = () => router.push('/bubble-chart');
const navigateToPieChart = () => router.push('/pie-chart');
const navigateToLineChart = () => router.push('/line-chart');

defineProps({
  timestamp: {
    type: String, 
    default: ''
  }
})
</script>

<style scoped>
/* ---------- reset ---------- */
*{margin:0;padding:0;box-sizing:border-box;}

/* ---------- main wrapper ---------- */
.main-content{
  width:100%;
  max-width:1400px;
  margin:0 auto;
  padding:10px 20px 20px; /* less top padding than before (was 20px) */
  display:flex;
  flex-direction:column;
  flex:1;
  gap:10px
}

/* ---------- 2 × 2 grid of charts ---------- */
.visual-container{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  grid-template-rows:repeat(2,1fr);
  gap:18px;
  width:100%;
  max-width:1400px;
  margin:-20px auto 0; /* shifts whole grid upward 20px */
  padding:20px;
  height:calc(100vh - 71px - 20px); /* reduced the internal offset (-20px) */
}

/* individual small‑chart “cards” */
.visual-section{
  background:#fff;
  border:2px solid rgba(0,0,0,.05);
  box-shadow:0 4px 16px rgba(0,0,0,.1);
  border-radius:8px;
  display:flex;align-items:center;justify-content:center;
  width:100%;height:100%;
  overflow:hidden;
  position:relative;
  padding:10px;
}
.visual-section>*{width:100%;height:100%;border-radius:inherit;}

.sources-wrapper {
  display: flex; justify-content: center;
  margin-top: -40px;
  margin: -40px auto 0;
  width: 100%;
  max-width: 1400px;
  position: relative;
}


/* ---------- bottom wide chart ---------- */
.bottom-visual-container{
  display:flex;justify-content:center;
  width:100%;
  max-width:1400px;
  margin:-40px auto 0; /* pulls wide chart up another 10px */
  padding:20px;
  position:relative;
  z-index:1;
}

.wide-visual-section{
  background:#fff;
  border:2px solid rgba(0,0,0,.05);
  box-shadow:0 4px 16px rgba(0,0,0,.1);
  border-radius:8px;
  display:flex;align-items:center;justify-content:center;
  width:100%;height:400px;
  overflow:hidden;
  position:relative;
  padding:10px;
}
.wide-visual-section>*{width:100%;height:100%;border-radius:inherit;}
</style>

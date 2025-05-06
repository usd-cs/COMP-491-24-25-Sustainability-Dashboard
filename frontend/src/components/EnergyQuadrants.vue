<template>
  <div class="energy-quadrants">
    <div class="chart-wrapper">
      <div class="title">What Does 20,000 kWh Mean to You?</div>
      <transition name="zoom" mode="out-in">
        <!-- 2×2 Grid -->
        <div v-if="active === null" key="grid" class="grid">
          <div
            v-for="(it, i) in items"
            :key="it.label"
            class="quadrant"
            @click="active = i"
          >
            <img :src="it.img" alt="icon" class="icon-img" />
            <div class="value">{{ it.value }}{{ it.unit }}</div>
            <div class="label">{{ it.label }}</div>
          </div>
        </div>

        <!-- Zoomed-In View -->
        <div v-else key="expanded" class="expanded">
          <button class="back-btn" @click="active = null">←</button>
          <img :src="items[active].img" alt="icon" class="icon-img large" />
          <div class="value large">{{ items[active].value }}{{ items[active].unit }}</div>
          <div class="label large">{{ items[active].label }}</div>
          <p class="details">{{ items[active].details }}</p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import carImg from '@/assets/car.png';
import houseImg from '@/assets/house.png';
import treeImg from '@/assets/tree.png';
import phoneImg from '@/assets/phone.png';

const items = [
  { img: carImg,   value: 1.1,       unit: '', label: 'Gas cars / year',
    details: "That's the CO₂ from roughly 1.1 average gasoline-powered cars driven for a year." },
  { img: houseImg, value: 1.6,       unit: '', label: 'Homes (electricity/year)',
    details: 'Equivalent to the yearly electricity use of about 1.6 typical U.S. homes.' },
  { img: treeImg,  value: 78.7,      unit: '', label: 'Tree seedlings (10 yrs)',
    details: 'Carbon sequestered by ~79 tree seedlings growing over a decade.' },
  { img: phoneImg, value: '512,259', unit: '', label: 'Phone charges',
    details: 'Energy enough to fully charge over half a million smartphones.' }
];

const active = ref(null);
</script>

<style scoped>
.energy-quadrants {
  width:100%; height:100%; position:relative;
  font-family:sans-serif; color:#333;
}

.chart-wrapper {
  display:flex; flex-direction:column;
  height:100%; flex:1; min-height:0;
  padding:8px; box-sizing:border-box;
  background:#fff; border-radius:8px;
  overflow:hidden;
}

.title {
  text-align:center;
  font-size:18px; font-weight:bold;
  margin-bottom:6px; line-height:1.2;
}

/* Transition */
.zoom-enter-active,
.zoom-leave-active {
  transition:transform .3s ease, opacity .3s ease;
  transform-origin:center center;
}
.zoom-enter-from,
.zoom-leave-to { transform:scale(0.8); opacity:0; }
.zoom-enter-to,
.zoom-leave-from { transform:scale(1); opacity:1; }

/* GRID */
.grid {
  flex:1; display:grid;
  grid-template-rows:repeat(2,1fr);
  grid-template-columns:repeat(2,1fr);
  gap:4px; /* tighter gap */
  min-height:0;
}
.quadrant {
  background:#fff; border-radius:8px;
  box-shadow:0 1px 4px rgba(0,0,0,0.1);
  display:flex; flex-direction:column;
  align-items:center; justify-content:flex-start;
  padding:4px; /* tighter padding */
  box-sizing:border-box;
  cursor:pointer; transition:transform .2s;
  height:100%; /* fill cell */
  width:100%;
}
.quadrant:hover { transform:scale(1.02); }

.icon-img {
  width:3rem; height:3rem; /* smaller icon */
  object-fit:contain;
  margin:0; /* no gap */
}
.value {
  font-size:1.1rem; font-weight:bold;
  margin-top:4px;
}
.label {
  font-size:0.8rem; margin-top:2px;
  color:#555;
}

/* EXPANDED */
.expanded {
  position:absolute; top:0; left:0;
  width:100%; height:100%;
  background:#f9f9f9; padding:16px;
  box-sizing:border-box;
  display:flex; flex-direction:column;
  align-items:center; justify-content:flex-start;
  z-index:10;
}
.back-btn {
  position:absolute; top:12px; left:12px;
  background:#ff6b6b; color:#fff;
  border:none; border-radius:50%;
  width:32px; height:32px;
  font-size:1.25rem; line-height:32px;
  cursor:pointer;
}
.back-btn:hover { background:#ff2c2c; }

.icon-img.large {
  width:5rem; height:5rem;
  margin-bottom:6px;
}
.value.large {
  font-size:2.2rem; margin:6px 0 4px;
}
.label.large {
  font-size:1.1rem; margin-bottom:6px;
}
.details {
  max-width:60ch; text-align:center;
  line-height:1.4; margin-top:4px;
}

/* small screens */
@media (max-height:700px) {
  .grid { gap:2px; }
  .quadrant { padding:2px; }
  .icon-img { width:2.5rem; height:2.5rem; }
  .value { font-size:0.9rem; }
  .label { font-size:0.7rem; }
}
</style>

<template>
  <AppLayout>
    <main class="main-content">
      <div class="story-container">
        <div class="story-steps">
          <section class="step-row" data-step="0">
            <div class="step-text">
              <div class="step-content">
                <p>Starting from a <span class="pill">2010 baseline</span>, we're committed to slicing our university's <span class="pill">emissions</span> and overall <span class="pill">environmental footprint</span> by <span class="pill">15 %</span> by <span class="pill">2020</span>, ramping up to <span class="pill">40 %</span> by <span class="pill">2030</span>, and hitting a <span class="pill">50 %</span> cut by <span class="pill">2035</span>. These bold <span class="pill">targets</span> are informed by—and fully aligned with—the <span class="pill">City of San Diego's Climate Action Plan</span>.
                </p>
              </div>
            </div>
            <div class="step-chart">
              <EmissionsChart ref="chartRefs.emissions" />
            </div>
          </section>

          <section class="step-row" data-step="1">
            <div class="step-text">
              <div class="step-content">
                <p>Through the <span class="pill">Eco-Resident Certification</span> program, students are introduced to <span class="pill">water conservation</span> practices for daily life. Across campus, traditional lawns have been replaced with <span class="pill">drought-tolerant landscaping</span>, reducing the need for irrigation.
                </p>
              </div>
            </div>
            <div class="step-chart">
              <WaterUsageChart ref="chartRefs.water" />
            </div>
          </section>

          <section class="step-row" data-step="2">
            <div class="step-text">
              <div class="step-content">
                <p>Through the <span class="pill">Eco-Resident Certification</span> program, students are introduced to <span class="pill">water conservation</span> practices for daily life. Across campus, traditional lawns have been replaced with <span class="pill">drought-tolerant landscaping</span>, reducing the need for irrigation.
                </p>
              </div>
            </div>
            <div class="step-chart">
              <WasteChart ref="chartRefs.waste" />
            </div>
          </section>

          <section class="step-row" data-step="3">
            <div class="step-text">
              <div class="step-content">
                <p>Through the <span class="pill">Eco-Resident Certification</span> program, students are introduced to <span class="pill">water conservation</span> practices for daily life. Across campus, traditional lawns have been replaced with <span class="pill">drought-tolerant landscaping</span>, reducing the need for irrigation.
                </p>
              </div>
            </div>
            <div class="step-chart">
              <VehicleGraph ref="chartRefs.vehicle" />
            </div>
          </section>
        </div>
      </div>
    </main>
  </AppLayout> 
</template>

<script setup>
import AppLayout from './AppLayout.vue';
import { ref,onMounted, nextTick } from 'vue';
import EmissionsChart from './EmissionsChart.vue';
import WaterUsageChart from './WaterUsageChart.vue';
import WasteChart from './WasteChart.vue';
import VehicleGraph from './VehicleGraph.vue';

// Array to hold references to chart components
const chartRefs = {
  emissions: ref(null),
  water: ref(null),
  waste: ref(null),
  vehicle: ref(null)
};

// Handle window resize to update charts
const handleResize = () => {
  nextTick(() => {
    Object.values(chartRefs).forEach(ref => {
      if (ref.value && typeof ref.value.resize === 'function') {
        ref.value.resize();
      }
    });
  });
};

onMounted(() => {
  // Initial resize after component mounts
  setTimeout(() => {
    handleResize();
  }, 300);
  
  // Add window resize listener
  window.addEventListener('resize', handleResize);
  
  // Add intersection observer for better scroll handling
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // When a step comes into view, resize its chart
        const step = entry.target;
        const stepIndex = parseInt(step.dataset.step);
        const chartKeys = ['emissions', 'water', 'waste', 'vehicle'];
        
        if (chartRefs[chartKeys[stepIndex]]?.value?.resize) {
          chartRefs[chartKeys[stepIndex]].value.resize();
        }
      }
    });
  }, { threshold: 0.5 });
  
  // Observe all step rows
  document.querySelectorAll('.step-row').forEach(step => {
    observer.observe(step);
  });
  
  return () => {
    window.removeEventListener('resize', handleResize);
    observer.disconnect();
  };
});
</script>

<style scoped>
/* Reset styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.main-content {
  width: 100%;
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
}

.story-container {
  padding: 1rem;
  width: 100%;
}

/* New layout for text+chart rows */
.story-steps {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Each step is now a row with text and chart side-by-side */
.step-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  min-height: 60vh; /* Give enough room for content */
  scroll-margin-top: 2rem;
}

/* Styling for the text part */
.step-text {
  grid-column: 1;
}

/* Styling for the chart part */
.step-chart {
  grid-column: 2;
  height: 400px; /* Fixed height for charts */
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.step-content {
  border-radius: 8px;
  opacity: 1;
  background-color: #ffffff;
  width: 100%;
  padding: 2rem;
  background-color: #d2e3fc;
}

/* Text styling */
.step-content p {
  color: #003b70;
  font-size: 2em;          
  font-weight: 600;           
  line-height: 1;           
  padding: 0.75rem;
}

/* Pill styling */
.pill {
  display: inline-block;
  background-color: #dbeaf4;  
  border-radius: 9999px;
  padding: 0.2em 0.6em;
  font-size: 0.9em;
  font-weight: 600;
  line-height: 1;
  margin: 0 0.2em;
}

.pill:hover {
  background-color: #d2e3fc;
  color: #174ea6;
}
</style>
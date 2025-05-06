<template>
  <AppLayout>
    <main class="main-content">
      <div class="story-container">
        <div class="story-steps">
          <section class="step-row" data-step="0">
            <div class="step-text">
              <div class="step-content">
               <p>Starting from a<span class="pill">2010 baseline,</span> the University of San Diego originally aimed to cut emissions by 50% by 2035, aligning with the City of San Diego's Climate Action Plan.</p>
              </div>
            </div>
            <div class="step-chart">
              <div class="chart-container-bg">
                <EmissionsChart ref="chartRefs.emissions" />
              </div>
            </div>
          </section>

          <section class="step-row" data-step="1">
            <div class="step-text">
              <div class="step-content">
                <p>Undertakings such as the planting of <span class="pill">drought-tolerant landscaping,</span> irrigation reductions, and participation in the <span class="pill">Eco-Resident Certification</span> program, where students learn <span class="pill">water conservation</span> best practices, has had a drastic effect on campus wide water usage. </p>
              </div>
            </div>
            <div class="step-chart">
              <div class="chart-container-bg">
                <WaterUsageChart ref="chartRefs.water" />
              </div>
            </div>
          </section>

          <section class="step-row" data-step="2">
            <div class="step-text">
              <div class="step-content">
                <p> Promoting a<span class="pill">Zero Waste goal,</span>USD has introduced single-stream recycling, the promotion of Sustain-A-Bottle for reusable water bottles, and pre-consumer composting in dining areas.<span class="pill">Community composting</span>takes place at Crossroads Garden and SOLES.</p>
              </div>
            </div>
            <div class="step-chart">
              <div class="chart-container-bg">
              <WasteChart ref="chartRefs.waste" />
              </div>
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
              <div class="chart-container-bg">
              <VehicleGraph ref="chartRefs.vehicle" />
              </div>
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
.chart-container-bg {
  background-color: #d2e3fc;
  border-radius: 8px;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.06);
  padding: 1rem;
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

.chart-container {
  height: 400px; /* Fixed height for charts */
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Styling for the chart part */
.step-chart {
  width: 100%;
  height: 100%;
  min-height: 350px;
}

.step-content {
  border-radius: 8px;
  opacity: 1;
  width: 100%;
  padding: 2rem;
  min-height: 400px;
  display: flex;                /* Add */
  align-items: center;          /* Add: vertical centering */
  justify-content: center; 
}

/* Text styling */
.step-content p {
  color: #003b70;
  font-size: 2em;          
  font-weight: 600;           
  line-height: 1.25;           
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 8px;
}

/* Pill styling */
.pill {
  display: inline-block;
  background-color: #dbeaf4;  
  border-radius: 9999px;
  padding: 0.2em 0.6em;
  font-size: 0.9em;
  font-weight: 600;
  margin: 0 0.2em;
}

.pill:hover {
  background-color: #d2e3fc;
  color: #174ea6;
}
</style>
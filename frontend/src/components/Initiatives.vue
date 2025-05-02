<template>
  <AppLayout>
    <main class="main-content">
      <div class="story-container">
        <!-- Graphs that accompany story-text -->
        <div class="story-graphic">
          <EmissionsChart v-if="activeStep === 0" />
          <WaterChart v-else-if="activeStep === 1" />
        </div>

        <!-- scroll “steps” -->
        <div class="story-text">
          <section class="step" data-step="0">
            <div class="step-content">
              <p>Starting from a <span class="pill">2010 baseline</span>, we're committed to slicing our university's <span class="pill">emissions</span> and overall <span class="pill">environmental footprint</span> by <span class="pill">15 %</span> by <span class="pill">2020</span>, ramping up to <span class="pill">40 %</span> by <span class="pill">2030</span>, and hitting a <span class="pill">50 %</span> cut by <span class="pill">2035</span>. These bold <span class="pill">targets</span> are informed by—and fully aligned with—the <span class="pill">City of San Diego's Climate Action Plan</span>.
              </p>
          </div>
          </section>
          <section class="step" data-step="1">
            <div class="step-content">
              <p>Through the <span class="pill">Eco-Resident Certification</span> program, students are introduced to <span class="pill">water conservation</span> practices for daily life. Across campus, traditional lawns have been replaced with <span class="pill">drought-tolerant landscaping</span>, reducing the need for irrigation.
              </p>
            </div>
          </section>
          <!-- TODO: more steps… -->
        </div>
      </div>
    </main>
  </AppLayout> 
</template>

<script setup>
import { useRouter} from 'vue-router';
import AppLayout from './AppLayout.vue';
import { ref,onMounted } from 'vue';
import EmissionsChart from './EmissionsChart.vue';
import WaterChart from './WaterUsageChart.vue';

const activeStep = ref(0);

let lastActive = null;

onMounted(() => {
  const container = document.querySelector('.story-text');
  const steps = container.querySelectorAll('.step');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const idx = +entry.target.dataset.step;

      if (entry.isIntersecting) {
        // Remove is-active from all
        steps.forEach(s => {
          if (s !== entry.target && s.classList.contains('is-active')) {
            s.classList.remove('is-active');
            s.classList.add('was-active');
            setTimeout(() => s.classList.remove('was-active'), 600); // match CSS duration
          }
        });

        entry.target.classList.add('is-active');
        activeStep.value = idx;
      }
    });
  }, { threshold: .1 });

  steps.forEach(s => io.observe(s));
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
  max-width: 1400px;  
  margin: 0 auto;
  padding: 20px;       
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.story-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.story-graphic {
  position: sticky;
  top: 80px;   /* push down below the navbar */
  align-self: start;   /* prevent vertical centering */
  height: 60vh;        /* or whatever you like */
}

.story-text {
  position: relative;
}

.story-text p {
  background-color: #f0f8ff; /* light blue background for paragraphs */
  color: #003b70;         /* dark blue text */
  padding: 0.75rem;
  border-radius: 8px;

}

.step-content {
  position: sticky;
  top: 80px;
  border-radius: 8px;
  opacity: 0;
  transition: transform 1s ease;
}
.step.is-active .step-content {
  position: sticky;
  opacity: 1;
  transform: translateY(0);
}

/* This handles the slow fade out */
.step.was-active .step-content {
  opacity: 0;
  transform: translateY(-30px); /* drifts upward as it fades */
  transition: opacity 4s ease, transform 1.5s ease-in;
}

.step {
  min-height: 100vh;
  position: relative;
}

.pill {
  display: inline-block;
  background-color: #dbeaf4;  
  border-radius: 9999px;      /* maximum rounding for a capsule shape */
  padding: 0.2em 0.6em;       /* vertical and horizontal padding */
  font-size: 0.9em;           /* slightly smaller than body text */
  font-weight: 500;           /* medium weight for emphasis */
  line-height: 1;             /* ensure vertical centering */
  margin: 0 0.2em;            /* small horizontal gap if multiple pills */
}

.pill:hover {
  background-color: #d2e3fc;  /* subtly darker on hover */
  color: #174ea6;             /* deeper blue text on hover */
}

</style>
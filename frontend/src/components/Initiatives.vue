<template>
  <AppLayout>
    <main class="main-content">
      <div class="start">
      <div class="quote-container">
        <blockquote>
          “We commit to going carbon neutral by 2035; mobilize more resources for action-oriented climate change research and skills creation; and increase the delivery of environmental and sustainability education across curricula, campus and community outreach programs.”
        </blockquote>
        <cite>— President Harris</cite>
      </div>
    </div>
      <section class="story-block">
        <!-- scrollable text column -->
        <div class="story-text">
          <article
            v-for="(blurb, i) in blurbs"
            :key="i"
            class="step"
            :data-chart-index="blurb.chart">
            <p v-html="blurb.text"></p>
          </article>
        </div>
        <!-- sticky chart column -->
        <div class="story-chart">
          <!-- only the chart matching activeStep is rendered -->
          <component
            :is="chartComponents[activeStep]"
            :step="activeStep"
            class="chart-instance"
          />
        </div>
      </section>
    </main>
  </AppLayout> 
</template>

<script setup>
import AppLayout from './AppLayout.vue';
import { ref,onMounted } from 'vue';
import EmissionsChart from './EmissionsChart.vue';
import WaterUsageChart from './WaterUsageChart.vue';
import WasteChart from './WasteChart.vue';
import VehicleGraph from './VehicleGraph.vue';

// Array of chart components
const chartComponents = [
  EmissionsChart,
  WaterUsageChart,
  WasteChart,
  VehicleGraph
]

// Text blurbs to acompany charts
// blurbs, each tagged with the chart index they belong to
const blurbs = [
// — Chart 0 (EmissionsChart) —
{ text: "In response to increasing demand from students, faculty, and staff, sustainability became a <span class='pill'>key initiative</span> within USD's strategic direction starting in <span class='pill'>Fall 2007</span>. This marked the inception of USD's strategic commitment to sustainability practices.", chart: 0 },

{ text: "By 2010, USD established clear <span class='pill'>emissions reduction goals</span> aligned with the City of San Diego's Climate Action Plan, setting targets of 15% reduction by 2020, 40% by 2030, and <span class='pill'>50% by 2035</span>.", chart: 0 },

{ text: "The university's emissions primarily stem from energy usage, commuting habits, air travel, vehicle fleet, waste generation, and <span class='pill'>water consumption</span>, all of which became focal points for targeted reduction strategies.", chart: 0 },

// — Chart 1 (WaterUsageChart) —
{ text: "Alongside emissions, USD significantly addressed water usage, reducing annual consumption by over <span class='pill'>38 million gallons since 2006</span>. By 2021, water usage reached the lowest levels in more than 25 years.", chart: 1 },

{ text: "USD achieved this reduction through <span class='pill'>extensive retrofits</span> like low-flow aerators, water-efficient toilets, and weather-based irrigation systems, alongside a shift toward <span class='pill'>drought-tolerant landscaping</span> across campus.", chart: 1 },

{ text: "Campus engagement programs, such as the <span class='pill'>Eco-Resident Certification</span>, further encouraged students to adopt <span class='pill'>water-saving practices</span>, amplifying conservation outcomes.", chart: 1 },

// — Chart 2 (WasteChart) —
{ text: "To further its sustainability mission, USD pursued ambitious <span class='pill'>Zero Waste goals</span>, significantly bolstered by the implementation of single-stream recycling and composting initiatives within dining and community spaces.", chart: 2 },

{ text: "Innovative programs like the <span class='pill'>Sustain-A-Bottle initiative</span> actively promoted the reduction of <span class='pill'>single-use items</span>, effectively lowering campus-wide waste generation.", chart: 2 },

{ text: "USD also pioneered electronic waste management through its <span class='pill'>Electronics Recycling Center</span>, the first facility of its kind on a college campus in San Diego, diverting over <span class='pill'>2.7 million pounds of e-waste</span> since its opening in 2011.", chart: 2 },

{ text: "Despite waste being a relatively small part of the university's environmental footprint, its visibility makes <span class='pill'>Zero Waste efforts</span> a crucial educational and engagement tool, clearly demonstrating USD’s sustainability commitment.", chart: 2 },

// — Chart 3 (VehicleGraph) —
{ text: "Recognizing <span class='pill'>commuting</span> as a significant contributor (27%) to its <span class='pill'>carbon footprint</span>, USD set out to enhance campus mobility and reduce emissions through improved pedestrian pathways, bicycle facilities, and increased connectivity to public transportation options.", chart: 3 },

{ text: "Additionally, USD addressed emissions from its vehicle fleet by prioritizing <span class='pill'>hybrid and electric vehicles</span>, optimizing fuel efficiency, and implementing more frequent <span class='pill'>fleet turnover</span>. These actions aim to considerably lower the fleet’s environmental impact.", chart: 3 },

{ text: "Through <span class='pill'>comprehensive planning</span>, USD envisions a fully integrated, multimodal campus, further supporting its broader sustainability and emissions reduction goals, and enhancing the overall campus experience.", chart: 3 }
]

const activeStep = ref(0)

onMounted(() => {
  const io = new IntersectionObserver(
    entries => {
      for (const e of entries) {
        if (e.isIntersecting)
          activeStep.value = Number(e.target.dataset.chartIndex)
      }
    },
    { threshold: 0.6 }
  )
  document
    .querySelectorAll('.step')
    .forEach(el => io.observe(el))
})
</script>

<style scoped>
/* Reset styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.start {
  background-image: -webkit-linear-gradient(right, #003b70, #0074c8);
  background-image: linear-gradient(to top, #003b70, #3d9970);
  opacity: 0.95;
  height: 60vh;
  padding: 2rem 0;
  margin: 0 auto 0rem auto;
}
.quote-container {
  background-color: rgba(255, 255, 255, 0.9);
  max-width: 800px;
  font-family: 'Georgia', serif;
  font-size: 1.3em;
  line-height: 1.7;
  color: #003b70;
  border-left: 4px solid #003b70;
  padding: 30px;
  margin: 30px auto;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  border-radius: 5px;
}

.quote-container blockquote {
  margin: 0;
}

.quote-container cite {
  display: block;
  text-align: right;
  font-style: normal;
  font-weight: 600;
  font-size: 1rem;
  margin-top: 15px;
  color: #003b70;
}

.main-content {
  background-color: #ffffff;
}

.story-block {
  display: grid;
  grid-template-columns: minmax(250px,45%) 1fr;
  gap: 2rem;
}

.story-chart {
  position: sticky;
  top: 1rem;
  padding: 4rem;
  height: calc(100vh - 2rem);
  background-color: #d2e3fc;
  display: flex;
  align-items: center;
  justify-content: center;
}
.chart-instance {
  width: 100%;
  height: 100%;
}

.story-text .step {
  min-height: 80vh;
  display: flex;
  align-items: center;
  color: #003b70;
}
.story-text p {
  max-width: 60ch;
  margin: 0 auto;
  padding: 1.5rem;
  background: #fff;
  border-radius: 8px;
  font-size: clamp(1.1rem,2.4vw,1.8rem);
  line-height: 1.4;
  font-weight:600;
}
.story-text :deep(.pill) {
  display: inline-block;
  background-color: #0d3753;
  color: #ffffff; /* ensures text visibility */
  border-radius: 9999px;
  padding: 0.15em 0.6em;
}

.story-text :deep(.pill:hover) {
  background-color: #d2e3fc;
  color: #174ea6;
}
</style>
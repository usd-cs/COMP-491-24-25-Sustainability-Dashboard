<!-- TreeChartExpand.vue  (a.k.a. pictorial “battery‑fill” chart) -->
<template>
    <div class="chart-with-details">
      <!-- ⬅ / ✖ button -->
      <button class="close-btn" @click="navigateBack">X</button>
  
      <!-- period selector -->
      <div class="controls" @click.stop>
        <label for="periodSelect" class="period-label">Select Timeframe:</label>
        <select
          id="periodSelect"
          v-model="selectedPeriod"
          @change="fetchData"
          @click.stop
          class="period-select"
        >
          <option value="1 week">1 Week</option>
          <option value="1 month">1 Month</option>
          <option value="3 months">3 Months</option>
          <option value="6 months">6 Months</option>
          <option value="1 year">1 Year</option>
          <option value="lifetime">Lifetime</option>
        </select>
      </div>
  
      <!-- chart -->
      <div ref="chartContainer" class="chart-container">
        <div v-if="loading" class="loading">Loading…</div>
        <div v-if="error"   class="error">{{ error }}</div>
      </div>
  
      <!-- 1 · Data Sources -->
      <div class="accordion">
        <details>
          <summary>Data Sources</summary>
          <div class="accordion-content">
            <p>
              Readings come from two live feeds merged into one campus database:
            </p>
            <ul>
              <li><strong>Fuel‑cell log</strong> – daily electricity totals (kWh).</li>
              <li><strong>Solar‑meter log</strong> – hourly solar output (kWh).</li>
            </ul>
            <p>
              The API sums every record in those tables to give a
              <em>lifetime‑to‑date</em> total and another sum for the timeframe
              you pick in the drop‑down above.
            </p>
          </div>
        </details>
      </div>
  
      <!-- 2 · What the Chart Shows & How to Read It -->
      <div class="accordion">
        <details>
          <summary>What the Chart Shows & How to Read It</summary>
          <div class="accordion-content">
            <p>
              The icon stack works like a battery gauge:
              the <strong>faded icons</strong> show lifetime renewable energy
              (100&nbsp;%), while the <strong>bright icons</strong> fill up to
              the share produced in the selected period.
            </p>
            <ul>
              <li>
                <strong>Sub‑title</strong> (above the chart) lists the exact
                lifetime kWh and the kWh for the chosen period.
              </li>
              <li>
                <strong>% label</strong> at the end of the bar tells what share of
                lifetime production occurred in that timeframe.
              </li>
              <li>
                Change the selector to see how fast the total has grown over
                weeks, months, or years.
              </li>
            </ul>
          </div>
        </details>
      </div>
  
      <!-- 3 · Axes & Icons -->
      <div class="accordion">
        <details>
          <summary>Axes & Icons</summary>
          <div class="accordion-content">
            <ul>
              <li>
                <strong>X‑axis</strong> – linear scale from 0 kWh to lifetime
                renewable output.
              </li>
              <li>
                <strong>Y‑axis</strong> – single “Campus” category
                (icons are drawn horizontally).
              </li>
              <li>
                <strong>Icons</strong> – each one represents the same kWh slice
                (E‑charts <code>symbolRepeat:'fixed'</code>).
              </li>
            </ul>
            <p>
              The filled series is clipped so only the icons that fit inside the
              period total are opaque.
            </p>
          </div>
        </details>
      </div>
  
      <!-- 4 · Hover Tool‑Tip -->
      <div class="accordion">
        <details>
          <summary>Hover Tool‑Tip</summary>
          <div class="accordion-content">
            <p>
              Hover anywhere on the bar to see a formatted read‑out of the kWh
              produced in the selected period.
            </p>
            <p>
              The tooltip helps verify that the visual “fill” matches the exact
              numbers in the title.
            </p>
          </div>
        </details>
      </div>
  
      <!-- 5 · More Info -->
      <div class="accordion">
        <details>
          <summary>More Info</summary>
          <div class="accordion-content">
            <ul>
              <li>
                Lifetime renewable output offsets roughly
                <strong>{{ lifetimeCo2 }}</strong> tons of CO₂ versus grid power
                (calculated with 0.92 lb CO₂ / kWh).
              </li>
              <li>
                The one‑year slice helps planners check whether production is on
                track with sustainability targets.
              </li>
              <li>
                A rising “fill rate” year‑on‑year signals successful expansion of
                on‑site renewables.
              </li>
            </ul>
          </div>
        </details>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import * as echarts from 'echarts';
  import axios from 'axios';
  import outputIcon from '@/assets/output-onlinepngtools.png';
  
  const pictorialIcon = 'image://' + outputIcon;
  
  const chartContainer = ref(null);
  const loading = ref(true);
  const error   = ref(null);
  const selectedPeriod = ref('1 month');
  
  let chart = null;
  let lifetimeEnergy = 0;
  let periodEnergy   = 0;
  
  const lifetimeCo2 = ref('‑');   // shown in “More Info” (simple calc)
  
  /* fetch data ------------------------------------------------------------ */
  async function fetchData(){
    try{
      loading.value = true;
      error.value   = null;
      const { data } = await axios.get(
        `http://localhost:3000/api/tables/gettreedata?period=${encodeURIComponent(selectedPeriod.value)}`
      );
      const row = data[0] || {};
      lifetimeEnergy = +row.lifetime_energy || 0;
      periodEnergy   = +row.period_energy   || 0;
  
      // CO₂ avoidance (0.92 lb CO₂ / kWh  →  divide by 2000 lb/ton)
      lifetimeCo2.value = (lifetimeEnergy * 0.92 / 2000).toFixed(0);
  
      updateChart();
    }catch(e){
      console.error(e);
      error.value = e.message || 'Failed to load energy data';
    }finally{
      loading.value = false;
    }
  }
  
  /* build / refresh chart ------------------------------------------------- */
  function updateChart(){
    if(!lifetimeEnergy) return;
    const option = {
      title:{
        text:'Campus Renewable Energy Output',
        subtext:`Lifetime: ${lifetimeEnergy.toLocaleString()} kWh   |   ${selectedPeriod.value}: ${periodEnergy.toLocaleString()} kWh`,
        left:'center',
        textStyle:{fontSize:24,color:'#333'},
        subtextStyle:{fontSize:16,color:'#444',lineHeight:24}
      },
      tooltip:{
        trigger:'axis',
        formatter:`{b}: {c} kWh`,
        textStyle:{color:'#333'}
      },
      backgroundColor:'#f9f9f9',  // Change this from '#fff' to '#f9f9f9'
      xAxis:{
        max:lifetimeEnergy,
        splitLine:{show:false},
        axisLine:{lineStyle:{color:'#333'}},
        axisLabel:{color:'#333',margin:10}
      },
      yAxis:{
        data:['Campus'],
        inverse:true,axisTick:{show:false},axisLine:{show:false},
        axisLabel:{color:'#333',fontSize:16,margin:10}
      },
      grid:{
        left:100,
        right:100,  // Increased from 70 to 100
        top:90,
        bottom:50
      },
      series:[
        {
          type:'pictorialBar',
          symbol:pictorialIcon,
          symbolRepeat:'fixed',
          symbolMargin:'5%',
          symbolSize:40,
          symbolClip:true,
          symbolBoundingData:lifetimeEnergy,
          data:[periodEnergy],
          z:10
        },
        {
          type:'pictorialBar',
          symbol:pictorialIcon,
          symbolRepeat:'fixed',
          symbolMargin:'5%',
          symbolSize:40,
          itemStyle:{opacity:0.2},
          symbolBoundingData:lifetimeEnergy,
          data:[lifetimeEnergy],
          animationDuration:0,
          z:5,
          label:{
            show:true,
            position:'right',
            offset:[15,0],  // Increased x-offset from 10 to 15
            color:'#333',
            fontSize:18,
            formatter:()=>(periodEnergy/lifetimeEnergy*100).toFixed(1)+' %'
          }
        }
      ]
    };
    if(chart){ chart.setOption(option); }
    else if(chartContainer.value){
      chart = echarts.init(chartContainer.value);
      chart.setOption(option);
      window.addEventListener('resize', handleResize);
    }
  }
  
  /* utils ----------------------------------------------------------------- */
  function handleResize(){ chart && chart.resize(); }
  function navigateBack(){ history.length ? history.back() : window.location.href = '/'; }
  
  onMounted(fetchData);
  onUnmounted(()=>{
    window.removeEventListener('resize', handleResize);
    chart && chart.dispose();
  });
  </script>
  
  <style scoped>
  /* -------- page shell ---------- */
  html, body, .chart-with-details {
    height: 100%;
    margin: 0;
    background: #ffffff;  /* Set base white background */
  }

  .chart-with-details {
    padding: 20px;
    background: #f9f9f9;
    border-radius: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
    min-height: 100vh;
    overflow-y: auto;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  
  /* -------- close btn ------------ */
  .close-btn{
    position:absolute;top:10px;right:10px;
    width:36px;height:36px;line-height:36px;
    background:#FF6B6B;color:#fff;border:none;border-radius:50%;
    cursor:pointer;z-index:1000;
  }
  .close-btn:hover{background:#FF2C2C;}
  
  /* -------- controls ------------- */
  .controls{
    display:flex;justify-content:center;gap:10px;margin-bottom:10px;
  }
  .period-label{font:400 14px/1.4 Inter,sans-serif;color:#333;}
  .period-select{
    font:400 14px/1.4 Inter,sans-serif;color:#333;
    background:transparent;border:1px solid #333;
    padding:4px 10px;border-radius:4px;cursor:pointer;
  }
  .period-select:hover{background:#f1f1f1;}
  
  /* -------- chart area ----------- */
  .chart-container {
    width: 100%;
    height: 420px;
    position: relative;
    border-radius: 8px;
  }
  .loading,.error{
    position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
    font-size:1.1rem;color:#666;
  }
  .error{color:#dc3545;}
  
  /* -------- accordions ----------- */
  .accordion{
    width:100%;margin-top:20px;padding:12px;
    background:#fff;border:1px solid #ddd;border-radius:8px;color:#003b70;
  }
  .accordion-content{margin-top:10px;padding-left:10px;background:#fff;}
  .accordion-content strong{font-weight:700;}
  </style>

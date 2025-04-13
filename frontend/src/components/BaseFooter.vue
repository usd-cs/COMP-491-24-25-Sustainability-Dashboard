<template>
  <footer class="footer-base">
      <div class="footer-container">
        <div class="footer-strip" @click="toggleFooter">
          <h3>USD Sustainability</h3>
          <i :class="['material-icons', 'arrow-icon', { rotated: isExpanded }]">expand_less</i>
        </div>
        <transition name="slide-fade">
          <div v-show="isExpanded" class="footer-content">
            <!-- Contact Info -->
            <section class="footer-contactInfo">
              <div class="contactInfo__title">
                <h3>USD Office of Sustainability</h3>
              </div>
              <div class="contactInfo__Addr">
                <span>
                  <i class="material-icons icon-style" style="vertical-align: middle; margin-right: 0.1rem;">location_on</i>
                  Facilities Management Offices 134A<br>5998 Alcalá Park<br>San Diego, CA 92110<br>
                  <a href="https://www.instagram.com/usdsustain/" target="_blank">
                    <i class="fab fa-instagram icon-style"></i>
                  </a>
                  <a href="mailto:sustainability@sandiego.edu">
                    <i class="material-icons icon-style">email</i>
                  </a>
                </span><br>
              </div>
            </section>
          </div>
        </transition>
        <div class="footer-gradient-box">
            <div class="footer-copy">
              <p>&copy; 2025 University of San Diego. All rights reserved.</p>
            </div>
            <div class="footer-legal">
                <a type="link" href="https://www.sandiego.edu/its/about/policies/#accordion-panel3">Web Privacy</a>
                <a type="link" href="https://www.sandiego.edu/legal/policies/community/institutional/discrimination%20and%20harassment.pdf">Non-Discrimination</a>
                <a type="link" href="https://www.sandiego.edu/its/about/policies/#accordion-panel25">Accessibility</a>
                <a type="link" href="https://www.sandiego.edu/feedback.php">Feedback</a>
                <a type="link" href="https://www.sandiego.edu/emergency/">Emergency</a>
            </div>
        </div>
      </div>
  </footer>
</template>

<script setup>

import { ref } from 'vue';

const isExpanded = ref(false); // State to track if the footer is expanded
const toggleFooter = () => {
  isExpanded.value = !isExpanded.value; // Toggle the expanded state
};
</script>

<style>
.footer-base {
  display: flex; /* Enable flexbox */
  justify-content: space-between; /* Space out the items */
  align-items: center; /* Align items vertically */
}

.footer-strip {
  background-color: 	#011122;
  color: white;
  width: 100%;
  padding: 0.25rem 2rem 0.1rem 4rem; /* Add padding for spacing */
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  border-top: #296590 1.1px solid;
}
.footer-strip h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: bold;
  flex-grow: 1;
}

.arrow-icon {
  margin-right: 1rem;
  transition: transform 0.3s ease;
}

.arrow-icon.rotated {
  transform: rotate(180deg);
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}
.footer-container {
  display: flex; /* Enable flexbox */
  flex-direction: column; /* Stack children vertically */
  justify-content: space-between;
  background-color: #002147;
  width: 100%;
  font-family: sans-serif;
  box-sizing: border-box;
}
.footer-content {
  display: flex; /* Enable flexbox */
  flex-direction: column; /* Stack children vertically */
  justify-content: flex-start; /* Align items at the top */
  width: 100%;
  margin: 0 auto;
  font-family: sans-serif;
  padding-left: 5rem; /* Add padding for spacing */
  padding-top: 1rem;
  box-sizing: border-box;
}

.footer-contactInfo {
  margin-bottom: 1rem; /* Add spacing below contact info */
  color: #ffffff;
  font-size: 0.75rem;
}

.footer-contactInfo h3 {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.icon-style {
  font-size: 1rem;
  color: white;             
  margin-right: 0.5rem;     /* Add space between icons */
  vertical-align: middle;   
}

.footer-gradient-box {
  display: flex; /* Enable flexbox */
  justify-content: space-between; /* Space out the items */
  align-items: center; /* Align items vertically */
  width: 100%;
  padding-left: 2rem;
  padding-right: 2rem;
  padding-top: .5rem;
  padding-bottom: .25rem;
  color: #ffffff;
  background-image: -webkit-linear-gradient(left, #003b70, #0074c8);
  background-image: linear-gradient(right, #003b70, #0074c8);
  box-sizing: border-box;
}

.footer-copy p {
  margin: 0; 
  padding: 0; 
  text-align: left; /* Align text to the left */
  font-size: 0.65rem; /* Increase font size */
  font-weight: 500;
  color: #ffffff;
  font-family: myriad-pro, Arial, sans-serif;
  text-transform: uppercase;
  letter-spacing: .1rem;
  line-height: 1;
}

.footer-legal {
  display: flex; /* Ensure links are aligned properly */
  align-items: center; /* Align links vertically */
  text-align: right;
}
.footer-legal a {
  margin-left: 1rem; /* Add spacing between links */
  color: #ffffff;
  font-size: .6rem;
  font-family: myriad-pro, Arial, sans-serif;
  font-weight: 600;
  text-decoration: none;
  line-height: 1;
  margin-bottom: .28rem;
}

.footer-legal a:hover {
  color: #003b70;
  background-color: #ffffff;
}

</style>

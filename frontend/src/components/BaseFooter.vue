<template>
  <footer class="footer-base">
      <div class="footer-container">
        <div class="footer-strip">
        </div>
          <div class="footer-content">
            <section class="footer-contactInfo">
              
              <div class="contactInfo__Addr">
                <span>
                  <h3 style="font-weight: 600;">USD Office of Sustainability</h3>
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
              <div class="footer-image">
                <img src="https://www.sandiego.edu/brand/images/logos/spirit-mark/usd-logo-spirit-primary-reversed.png" alt="USD Logo" />
              </div>
              <div class="footer-adv">
                <h3 style="font-weight: 520; color: #75bee9; text-transform: uppercase;">helpful links</h3>
                <a type="link" href="https://www.sandiego.edu/sustainability/">Sustainability Events</a>
                <a type="link" href="https://www.sandiego.edu/sustainability/energy-projects-programs.php">Energy Projects</a>
                <a type="link" href="https://www.sandiego.edu/epic/">Energy Policy</a>
                <a type="link" href="https://www.sandiego.edu/epic/students/">Courses</a>
                <a type="link" href="https://www.sandiego.edu/epic/our-work/">Impact</a>
            </div>
            </section>
          </div>
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
  height: 1.2rem;
  width: 100%;
  border-top: #296590 1.1px solid;
}

.footer-container {
  display: flex; /* Enable flexbox */
  flex-direction: column; /* Stack children vertically */
  justify-content: space-between;
  background-color: #003b70;
  width: 100%;
  box-sizing: border-box;
}
.footer-content {
  width: 100%;
  margin: 0 auto;
  padding: 1rem 5rem;
  box-sizing: border-box;
}

.footer-contactInfo {
  display: flex; /* Enable flexbox */
  flex-direction: row; /* Stack children vertically */
  justify-content: center; /* Push items to the edges */
  align-items: center;/* Align items at the top */
  color: #ffffff;
  width: 100%;
  gap: 10rem;
}

.contactInfo__Addr {
  text-align: left; /* Align text to the left */
  flex-shrink: 0;
  font-size: .77rem; /* Increase font size */
}

.footer-image {
  display: flex;
  justify-content: center; /* Align image to the far right */
  align-items: center; /* Center vertically */
  flex-shrink: 0;
}

.footer-adv {
  display: flex; /* Enable flexbox */
  flex-direction: column; /* Stack children vertically */
  justify-content: center; /* Push items to the edges */
  align-items: flex-start;/* Align items at the top */
}

.footer-adv a {
  margin-left: 1rem; /* Add spacing between links */
  color: #ffffff;
  font-size: .6rem;
  font-family: myriad-pro, Arial, sans-serif;
  font-weight: 600;
  text-decoration: none;
  line-height: 1;
  margin-bottom: .28rem;
}

.footer-image img {
  max-width: 150px; /* Limit the image width */
  height: auto; /* Maintain aspect ratio */
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

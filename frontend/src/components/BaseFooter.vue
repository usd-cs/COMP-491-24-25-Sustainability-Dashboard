<template>
  <footer class="footer-base">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-gradient-box">
          <div class="footer-copy">
            <p>&copy; 2023 Your Company. All rights reserved.</p>
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
    </div>
  </footer>
</template>

<style>
.footer-base {
  display: flex; /* Enable flexbox */
  justify-content: space-between; /* Space out the items */
  align-items: center; /* Align items vertically */
}
.footer-container {
  display: flex; /* Enable flexbox */
  flex-direction: column; /* Stack children vertically */
  justify-content: flex-end;
  background-color: #002147;
  width: 100%;
  height: 100px;
  font-family: sans-serif;
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

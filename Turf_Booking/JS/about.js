// Trigger animation when section is in view
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      counters.forEach(counter => animateCounter(counter));
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
  observer.observe(statsSection);
}

// Counter animation
const counters = document.querySelectorAll('.counter');

const animateCounter = (counter) => {
  const target = parseInt(counter.getAttribute('data-target'));
  const duration = 1500; // 2 seconds
  const increment = target / (duration / 16); // 60fps
  let current = 0;
  
  const updateCounter = () => {
    current += increment;
    if (current < target) {
      counter.textContent = Math.floor(current);
      requestAnimationFrame(updateCounter);
    } else {
      counter.textContent = target;
    }
  };
  
  updateCounter();
};

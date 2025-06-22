document.addEventListener('DOMContentLoaded', function() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question'); // Whole question div
    const btn = item.querySelector('.toggle-btn'); // Plus button
    const answer = item.querySelector('.faq-answer');

    // Click handler for the ENTIRE question
    question.addEventListener('click', (e) => {
      // Ignore clicks if they’re directly on the button (to avoid double-trigger)
      if (e.target === btn) return;
      
      toggleFAQ(answer, btn);
    });

    // Click handler for the PLUS BUTTON (optional, if you want both to work)
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent the question click from also triggering
      toggleFAQ(answer, btn);
    });
  });

  // Reusable toggle function
  function toggleFAQ(answer, btn) {
    answer.classList.toggle('show');
    const isExpanded = answer.classList.contains('show');
    btn.setAttribute('aria-expanded', isExpanded);
    btn.textContent = isExpanded ? '−' : '+';
  }
});
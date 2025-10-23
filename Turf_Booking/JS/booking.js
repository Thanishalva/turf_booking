document.addEventListener("DOMContentLoaded", function () {
  // --- Price Database ---
  const turfPrices = {
    "cricket": 1500,
    "tennis": 2000,
    "football": 4000,
    "badmintion": 750,
    "softball":1000,
    "baseball":1800
  };

  // --- Form Elements ---
  const form = document.getElementById("bookingForm");
  const turfTypeSelect = document.getElementById("turfType");
  const turfPriceDisplay = document.getElementById("turfPriceDisplay");
  const bookingDetails = document.getElementById("booking-details"); // The fieldset
  
  const fullName = document.getElementById("name");
  const contact = document.getElementById("phone");
  const date = document.getElementById("date");
  const msg = document.getElementById("msg");
  const slotsContainer = document.getElementById("slotsContainer");

  // --- Regex & Slot Data ---
  const nameRegex = /^[A-Z][a-zA-Z\s]*$/;
  const phoneRegex = /^\d{10}$/;
  const timeSlots = [
    "6-7 AM", "7-8 AM", "8-9 AM",
    "5-6 PM", "6-7 PM", "7-8 PM"
  ];
  let selectedSlot = null;
  let selectedTurfPrice = 0;

  // --- NEW: Event Listener for Turf Selection ---
  turfTypeSelect.addEventListener("change", function() {
    const selectedTurf = this.value;
    
    if (selectedTurf && turfPrices[selectedTurf]) {
      // 1. Get price and update display
      selectedTurfPrice = turfPrices[selectedTurf];
      turfPriceDisplay.innerHTML = `Price: <strong>₹${selectedTurfPrice}</strong> per hour`;
      turfPriceDisplay.classList.remove("hidden");
      
      // 2. Show the rest of the form
      bookingDetails.classList.remove("hidden");
      clearError(turfTypeSelect);
    } else {
      // 3. Hide everything if they deselect
      turfPriceDisplay.classList.add("hidden");
      bookingDetails.classList.add("hidden");
      selectedTurfPrice = 0;
    }
  });

  // --- Reusable Validation Functions ---
  function showError(input, message) {
    const errorSpan = document.getElementById(input.id + "Error");
    if (errorSpan) errorSpan.textContent = message;
    input.setAttribute("aria-invalid", "true");
  }

  function clearError(input) {
    const errorSpan = document.getElementById(input.id + "Error");
    if (errorSpan) errorSpan.textContent = "";
    input.setAttribute("aria-invalid", "false");
  }

  // --- Specific Field Validation ---
  function validateTurfType() {
    if (turfTypeSelect.value === "") {
      showError(turfTypeSelect, "Please select a turf type.");
      return false;
    }
    clearError(turfTypeSelect);
    return true;
  }
  
  function validateFullName() {
    const value = fullName.value.trim();
    if (value.length < 3) {
      showError(fullName, "Full name must be at least 3 characters long");
      return false;
    }
    if (!nameRegex.test(value)) {
      showError(
        fullName,
        "Must start with a capital letter and only contain letters and spaces."
      );
      return false;
    }
    clearError(fullName);
    return true;
  }

  function validateContact() {
    const value = contact.value.trim();
    if (!phoneRegex.test(value)) {
      showError(contact, "Contact must be a 10-digit number");
      return false;
    }
    clearError(contact);
    return true;
  }

  function validateDate() {
    if (date.value === "") {
      showError(date, "Please select a date");
      return false;
    }
    const selectedDate = new Date(date.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      showError(date, "Please select a date in the future");
      return false;
    }
    clearError(date);
    return true;
  }

  function validateSlotSelection() {
    if (!selectedSlot) {
      showError(slotsContainer, "Please select an available time slot.");
      return false;
    }
    clearError(slotsContainer);
    return true;
  }

  // --- Slot Logic Functions ---
  // ... (Your existing showSlots and selectSlot functions are perfect) ...
  function showSlots() {
    const dateValue = date.value;
    slotsContainer.innerHTML = "";
    selectedSlot = null;
    clearError(slotsContainer);

    if (!dateValue) return;

    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const bookedSlots = bookings
      .filter(b => b.date === dateValue)
      .map(b => b.timeSlot);

    timeSlots.forEach(slot => {
      const div = document.createElement('div');
      div.classList.add('slot');
      div.textContent = slot;
      div.setAttribute('role', 'radio');
      div.setAttribute('aria-checked', 'false');
      div.setAttribute('tabindex', '-1');

      if (bookedSlots.includes(slot)) {
        div.classList.add('booked');
        div.setAttribute('aria-disabled', 'true');
      } else {
        div.setAttribute('tabindex', '0');
        div.addEventListener('click', () => selectSlot(div, slot));
        div.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectSlot(div, slot);
          }
        });
      }
      slotsContainer.appendChild(div);
    });
  }

  function selectSlot(div, slot) {
    document.querySelectorAll('.slot[role="radio"]').forEach(el => {
      el.classList.remove('selected');
      el.setAttribute('aria-checked', 'false');
      if (!el.classList.contains('booked')) {
        el.setAttribute('tabindex', '-1');
      }
    });

    div.classList.add('selected');
    div.setAttribute('aria-checked', 'true');
    div.setAttribute('tabindex', '0');
    selectedSlot = slot;
    clearError(slotsContainer);
  }

  // --- Event Listeners ---
  fullName.addEventListener("input", validateFullName);
  contact.addEventListener("input", validateContact);
  date.addEventListener("change", () => {
    validateDate();
    showSlots();
  });

  // --- Updated Submit Function ---
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    msg.textContent = "";
    msg.className = "confirmation";

    // Run all validations
    const isTurfValid = validateTurfType();
    const isFullNameValid = validateFullName();
    const isContactValid = validateContact();
    const isDateValid = validateDate();
    const isSlotValid = validateSlotSelection();

    if (isTurfValid && isFullNameValid && isEmailValid && isContactValid && isDateValid && isSlotValid) {
      
      let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
      const dateValue = date.value;

      const exists = bookings.some(b => b.date === dateValue && b.timeSlot === selectedSlot);
      if (exists) {
        msg.textContent = "Sorry, this slot just got booked! Please select another.";
        msg.classList.add("error");
        showSlots();
        return;
      }

      // Add the new turf info to the booking
      bookings.push({
        turf: turfTypeSelect.value,
        price: selectedTurfPrice,
        name: fullName.value.trim(),
        email: email.value.trim(),
        phone: contact.value.trim(),
        date: dateValue,
        timeSlot: selectedSlot
      });
      localStorage.setItem('bookings', JSON.stringify(bookings));

      // --- SUCCESS ---
      msg.textContent = `Booking confirmed for ${turfTypeSelect.value} turf! Total: ₹${selectedTurfPrice}`;
      msg.classList.add("success");

      form.reset();
      clearError(turfTypeSelect);
      clearError(fullName);
      clearError(email);
      clearError(contact);
      clearError(date);
      clearError(slotsContainer);
      slotsContainer.innerHTML = "";
      selectedSlot = null;
      turfPriceDisplay.classList.add("hidden");
      bookingDetails.classList.add("hidden");

    } else {
      // --- ERROR ---
      msg.textContent = "Please correct the errors above and try again.";
      msg.classList.add("error");

      // Focus on the first invalid field
      const firstInvalidField = form.querySelector('[aria-invalid="true"]');
      if (firstInvalidField) {
         if (firstInvalidField.id === 'slotsContainer') {
            firstInvalidField.querySelector('.slot:not(.booked)').focus();
         } else {
            firstInvalidField.focus();
         }
      }
    }
  });
});
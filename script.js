// =====================================================
// SEVA SATHI - COMPLETE JAVASCRIPT
// =====================================================
// =====================================================
// FIREBASE CONNECTION
// =====================================================

// =====================================================
// SEVA SATHI - COMPLETE JAVASCRIPT
// =====================================================

const firebaseConfig = {
  apiKey: "AIzaSyC8lHzKcXM9YSfs_hbRLD57tuXV4mQWuM8",
  authDomain: "seva-sathi-8023e.firebaseapp.com",
  projectId: "seva-sathi-8023e",
  storageBucket: "seva-sathi-8023e.firebasestorage.app",
  messagingSenderId: "936154213437",
  appId: "1:936154213437:web:d4e0898ec00ae78aae4e54"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

console.log("✅ Firebase Connected");
const APP_NAME = "SEVA SATHI";
const PHONEPE_NUMBER = "9928884930";
const PHONEPE_UPI_ID = "9928884930@ybl";
const WHATSAPP_NUMBER = "919460340129";

const menuBtn = document.getElementById("menuBtn");
const navbar = document.getElementById("navbar");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");

// =====================================================
// MOBILE MENU
// =====================================================

if (menuBtn && navbar) {
  menuBtn.addEventListener("click", () => {
    navbar.classList.toggle("open");
    menuBtn.textContent =
      navbar.classList.contains("open") ? "✕" : "☰";
  });
}

document.querySelectorAll(".navbar a").forEach(link => {
  link.addEventListener("click", () => {
    navbar?.classList.remove("open");
    if (menuBtn) menuBtn.textContent = "☰";
  });
});

// =====================================================
// MODAL
// =====================================================

function openModal(content) {
  if (!modal || !modalContent) return;

  modalContent.innerHTML = content;
  modal.classList.add("show");
}

function closeModal() {
  modal?.classList.remove("show");
}

if (modal) {
  modal.addEventListener("click", e => {
    if (e.target === modal) closeModal();
  });
}

// =====================================================
// DATA
// =====================================================

let currentUser =
  JSON.parse(localStorage.getItem("sevaSathiUser")) || null;

let bookings =
  JSON.parse(localStorage.getItem("sevaSathiBookings")) || [];

const services = [
  ["Elderly Care", "बुजुर्गों की देखभाल", 500],
  ["Mother & Baby Care", "माँ एवं शिशु देखभाल", 400],
  ["Injection / Dressing", "Injection / Dressing", 210],
  ["Post Hospital Care", "Post Hospital Care", 600],
  ["Medicine Management", "Medicine Management", 250],
  ["Vital Monitoring", "Vital Monitoring", 200]
];

const durations = [
  "30 Minutes",
  "1 Hour",
  "1 Hour 30 Minutes",
  "2 Hours",
  "2 Hours 30 Minutes",
  "3 Hours",
  "6 Hours"
];

// =====================================================
// LOGIN
// =====================================================

// =====================================================
// SEVA SATHI - PATIENT SESSION
// =====================================================

// Patient Login/Register की जरूरत नहीं है
// Booking बिना Login/Register के होगी

let currentPatient = {
  name: localStorage.getItem("lastPatientName") || "",
  mobile: localStorage.getItem("lastPatientMobile") || ""
};

// =====================================================
// PATIENT DASHBOARD
// =====================================================

async function openPatientDashboard() {

  let patientBookings = [];

  if (currentPatient.mobile) {

    const snapshot =
      await db.collection("bookings").get();

    patientBookings =
      snapshot.docs
        .map(doc => doc.data())
        .filter(b => {

          const bookingMobile =
            b.patientMobile ||
            b.userMobile ||
            "";

          return (
            bookingMobile.replace(/\D/g, "") ===
            currentPatient.mobile.replace(/\D/g, "")
          );

        });
  }

  const currentBookings =
    patientBookings.filter(b =>
      b.status !== "Completed" &&
      b.status !== "Cancelled"
    );

  const previousBookings =
    patientBookings.filter(b =>
      b.status === "Completed" ||
      b.status === "Cancelled"
    );

  openModal(`

    <div>

      <div style="
        background:linear-gradient(135deg,#0878d1,#16bd70);
        color:white;
        padding:20px;
        border-radius:16px;
      ">

        <div style="font-size:40px;">👤</div>

        <h2 style="margin:5px 0;color:white;">
          Patient Dashboard
        </h2>

        <p style="margin:0;opacity:.9;">
          अपनी Nursing Services manage करें
        </p>

      </div>

      <button
        onclick="openBookingForm()"
        style="
          width:100%;
          margin-top:15px;
          padding:15px;
          background:#0878d1;
          color:white;
          border:0;
          border-radius:11px;
          font-size:15px;
          font-weight:bold;
        "
      >
        📅 New Patient Booking
      </button>

      <h3 style="margin-top:25px;">
        📋 Current Booking Details
      </h3>

      ${
        currentBookings.length > 0

        ? currentBookings.map(b => `

          <div style="
            background:#f8fbfd;
            border:1px solid #dfe7ee;
            border-radius:13px;
            padding:15px;
            margin-top:10px;
          ">

            <p>
              <strong>📋 Booking ID:</strong>
              ${b.bookingId}
            </p>

            <p>
              🩺 <strong>Service:</strong>
              ${b.service || "-"}
            </p>

            <p>
              👤 <strong>Patient:</strong>
              ${b.patientName || "-"}
            </p>

            <p>
              📅 <strong>Date:</strong>
              ${b.bookingDate || "-"}
            </p>

            <p>
              ⏰ <strong>Time:</strong>
              ${b.bookingTime || "-"}
            </p>

            <p>
              👩‍⚕️ <strong>Assigned Nurse:</strong>
              ${b.assignedNurse || "Not Assigned"}
            </p>

            <p>
              💰 <strong>Payment:</strong>
              ${b.paymentStatus || "Pending"}
            </p>

            <p>
              🔄 <strong>Status:</strong>
              ${b.status || "Pending"}
            </p>

            <button
              onclick="patientViewBooking('${b.bookingId}')"
              style="
                width:100%;
                margin-top:8px;
                padding:11px;
                background:#eef6ff;
                color:#0878d1;
                border:0;
                border-radius:9px;
                font-weight:bold;
              "
            >
              👁️ View Booking
            </button>

            <button
              onclick="trackBooking('${b.bookingId}')"
              style="
                width:100%;
                margin-top:8px;
                padding:11px;
                background:#eaf8ef;
                color:#16834b;
                border:0;
                border-radius:9px;
                font-weight:bold;
              "
            >
              📍 Nurse Tracking
            </button>

            <button
              onclick="showPaymentQR('${b.bookingId}')"
              style="
                width:100%;
                margin-top:8px;
                padding:11px;
                background:#fff4e5;
                color:#c76a00;
                border:0;
                border-radius:9px;
                font-weight:bold;
              "
            >
              💰 Payment Details
            </button>

          </div>

        `).join("")

        : `

          <div style="
            text-align:center;
            padding:25px 15px;
            background:#f8fbfd;
            border-radius:13px;
            margin-top:10px;
          ">

            <div style="font-size:45px;">📅</div>

            <h3>
              कोई Current Booking नहीं है
            </h3>

            <p style="color:#667085;">
              अपनी nursing service book करें।
            </p>

          </div>

        `
      }

      <h3 style="margin-top:25px;">
        🕘 Previous Booking History
      </h3>

      ${
        previousBookings.length > 0

        ? previousBookings.map(b => `

          <div style="
            background:white;
            border:1px solid #e1e8ee;
            border-radius:12px;
            padding:13px;
            margin-top:9px;
          ">

            <strong>
              📋 ${b.bookingId}
            </strong>

            <p>
              🩺 ${b.service || "-"}
            </p>

            <p>
              👤 ${b.patientName || "-"}
            </p>

            <p>
              📅 ${b.bookingDate || "-"}
            </p>

            <p>
              🔄 ${b.status || "-"}
            </p>

            <p>
              💰 ₹${b.charges?.total || 0}
            </p>

          </div>

        `).join("")

        : `

          <div style="
            text-align:center;
            padding:20px;
            color:#667085;
          ">
            अभी कोई previous booking नहीं है।
          </div>

        `
      }

      <button
        onclick="closeModal()"
        style="
          width:100%;
          margin-top:20px;
          padding:13px;
          background:#555;
          color:white;
          border:0;
          border-radius:10px;
          font-weight:bold;
        "
      >
        ✕ Close Dashboard
      </button>

    </div>

  `);
}

// =====================================================
// OLD USER DASHBOARD NAME
// =====================================================

// अगर आपके पुराने HTML/JS में
// openUserDashboard() लिखा हुआ है,
// तो वह भी Patient Dashboard खोलेगा.

function openUserDashboard() {
  openPatientDashboard();
}
// =====================================================
// OLD PATIENT BUTTON COMPATIBILITY
// =====================================================

function openLogin() {
  openPatientDashboard();
}

function openRegister() {
  openPatientDashboard();
}
// =====================================================
// BOOK SERVICE
// =====================================================
function bookService() {
  openBookingForm();
}


// =====================================================
// SELECT SERVICE
// =====================================================

function selectService(service) {
  openBookingForm(service);
}
// =====================================================
// BOOKING FORM
// =====================================================

function openBookingForm(selectedService = "") {

  const serviceOptions = services.map(item => `
    <option value="${item[0]}"
      ${selectedService === item[0] ? "selected" : ""}>
      ${item[1]}
    </option>
  `).join("");

  const durationOptions = durations.map(item => `
    <option value="${item}">${item}</option>
  `).join("");

  openModal(`
    <h2>📅 Nursing Service Booking</h2>

    <p>
    
    Welcome ${currentPatient?.name || ""}
    </p>

    <div style="margin-top:20px">

      <h3>👤 Patient Details</h3>

      <input id="patientName"
        placeholder="Patient Name *">

      <input id="patientAge"
        type="number"
        min="0"
        max="120"
        placeholder="Patient Age">

      <select id="patientGender">
        <option value="">Gender Select करें</option>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>

      <input id="patientMobile"
        type="tel"
        maxlength="10"
        inputmode="numeric"
        placeholder="Patient Mobile Number">

      <select id="relationship">
        <option value="">Relationship Select करें</option>
        <option>Self</option>
        <option>Father</option>
        <option>Mother</option>
        <option>Husband</option>
        <option>Wife</option>
        <option>Son</option>
        <option>Daughter</option>
        <option>Other</option>
      </select>

      <textarea id="medicalCondition"
        placeholder="Medical Condition / Care की जरूरत"></textarea>

      <textarea id="specialInstructions"
        placeholder="Special Instructions"></textarea>


      <h3 style="margin-top:20px">🏠 Address</h3>

      <input id="house"
        placeholder="House / Flat No.">

      <input id="area"
        placeholder="Area / Village">

      <input id="city"
        placeholder="City">

      <select
  id="district"
  required
  style="
    width:100%;
    padding:12px;
    border:1px solid #d0d5dd;
    border-radius:9px;
    box-sizing:border-box;
  "
>
  <option value="">-- Select District --</option>
  <option value="Barmer">Barmer</option>
</select>

      <input id="state"
        value="Rajasthan"
        placeholder="State">

      <input id="pincode"
        maxlength="6"
        inputmode="numeric"
        placeholder="PIN Code">

      <input id="landmark"
        placeholder="Landmark">


      <h3 style="margin-top:20px">🩺 Service Details</h3>

     <select id="bookingService" onchange="setServiceCharge(this.value)">
  <option value="">Select Service *</option>
  ${serviceOptions}
</select>

      <input id="bookingDate"
        type="date">

      <input id="bookingTime"
        type="time">

      <select
  id="serviceDuration"
  onchange="setServiceCharge(document.getElementById('bookingService').value)"
>
        <option value="">Select Service Duration *</option>
        ${durationOptions}
      </select>

      <textarea id="additionalRequirements"
        placeholder="Additional Requirements"></textarea>
        <div style="margin-top:15px;">
  <label><strong>💰 Service Charge</strong></label>

  <input id="serviceCharge"
    type="number"
    min="0"
    placeholder="Service Charge ₹"
    readonly>

  <div id="totalPreview"
    style="
      margin-top:10px;
      padding:15px;
      background:#f5f5f5;
      border-radius:10px;
      font-weight:bold;
    ">
    💰 Service Charge: ₹0
  </div>
</div>


      

      

      <div id="totalPreview"
        style="display:none;margin-top:15px;padding:15px;background:#f5f5f5;border-radius:10px">
      </div>

      <button onclick="createBooking()"
        style="width:100%;margin-top:15px;padding:14px;background:#16bd70;color:white;border:0;border-radius:10px;font-weight:bold">
        ✅ Confirm Booking
      </button>

    </div>
  `);
}
function setServiceCharge(serviceName) {

  const service =
    services.find(s => s[0] === serviceName);

  if (!service) return;

  const duration =
    document.getElementById("serviceDuration")?.value || "";

  const durationPrices = {
    "30 Minutes": 500,
    "1 Hour": 750,
    "1 Hour 30 Minutes": 950,
    "2 Hours": 1050,
    "2 Hours 30 Minutes": 1300,
    "3 Hours": 1500,
    "6 Hours": 2900
  };

  const total =
    durationPrices[duration] || 0;

  document.getElementById("serviceCharge").value =
    total;

  calculateBookingTotal();
}
// =====================================================
// TOTAL
// =====================================================

function calculateBookingTotal() {
  const charge =
    Number(document.getElementById("serviceCharge")?.value || 0);

  const preview =
    document.getElementById("totalPreview");

  if (!preview) return;

  preview.style.display = "block";

  preview.innerHTML = `
    <h3>💰 Service Charge</h3>
    <p>Service Charge:
      <strong>₹${charge}</strong>
    </p>

    <hr>

    <p style="font-size:20px">
      Total Amount:
      <strong>₹${charge}</strong>
    </p>
  `;
}

// =====================================================
// CREATE BOOKING
// =====================================================
async function ensurePatientAuth() {
  if (auth.currentUser) {
    return auth.currentUser;
  }

  const result = await auth.signInAnonymously();

  console.log(
    "✅ Patient Anonymous Login:",
    result.user.uid
  );

  return result.user;
}
async function createBooking() {
const patientUser = await ensurePatientAuth();
const patientUID = patientUser.uid;
  const patientName =
    document.getElementById("patientName")?.value.trim();

  const patientMobile =
    document.getElementById("patientMobile")?.value.trim();

  const service =
    document.getElementById("bookingService")?.value;

  const date =
    document.getElementById("bookingDate")?.value;

  const time =
    document.getElementById("bookingTime")?.value;

  const duration =
    document.getElementById("serviceDuration")?.value;

  
  const serviceCharge =
    Number(document.getElementById("serviceCharge")?.value || 0);


  // =========================
  // VALIDATION
  // =========================

  if (!patientName) {
    alert("Patient Name भरना जरूरी है।");
    return;
  }

  if (!patientMobile) {
    alert("Patient Mobile Number भरना जरूरी है।");
    return;
  }

  if (!service) {
    alert("Service Select करें।");
    return;
  }

  if (!date) {
    alert("Booking Date Select करें।");
    return;
  }

  if (!time) {
    alert("Booking Time Select करें।");
    return;
  }

  if (!duration) {
    alert("Service Duration Select करें।");
    return;
  }

  if (serviceCharge <= 0) {
    alert("Service Charge डालें।");
    return;
  }


  // =========================
  // SAVE PATIENT DETAILS
  // =========================

  currentPatient.name = patientName;
  currentPatient.mobile = patientMobile;

  localStorage.setItem(
    "lastPatientName",
    patientName
  );

  localStorage.setItem(
    "lastPatientMobile",
    patientMobile
  );


  // =========================
  // BOOKING ID
  // =========================

  const bookingId =
    "SS" + Date.now().toString().slice(-8);


  // =========================
  // BOOKING OBJECT
  // =========================

 const booking = {
  bookingId,

  patientUID: patientUID,

  userName: patientName,
  userMobile: patientMobile,

    patientName,

    patientAge:
      document.getElementById("patientAge")?.value || "",

    patientGender:
      document.getElementById("patientGender")?.value || "",

    patientMobile,

    relationship:
      document.getElementById("relationship")?.value || "",

    medicalCondition:
      document.getElementById("medicalCondition")?.value || "",

    specialInstructions:
      document.getElementById("specialInstructions")?.value || "",


    // =========================
    // ADDRESS
    // =========================

    address: {

      house:
        document.getElementById("house")?.value || "",

      area:
        document.getElementById("area")?.value || "",

      city:
        document.getElementById("city")?.value || "",

      district:
        document.getElementById("district")?.value || "",

      state:
        document.getElementById("state")?.value || "Rajasthan",

      pincode:
        document.getElementById("pincode")?.value || "",

      landmark:
        document.getElementById("landmark")?.value || ""

    },


    // =========================
    // SERVICE DETAILS
    // =========================

    service,

    bookingDate: date,

    bookingTime: time,

    duration,

    additionalRequirements:
      document.getElementById("additionalRequirements")?.value || "",


    // =========================
    // PAYMENT
    // =========================

    charges: {

  serviceCharge,

  total: serviceCharge

},

paymentStatus: "Pending",

    // =========================
    // NURSE
    // =========================

    assignedNurse: "Not Assigned",

    assignedNurseId: "",


    // =========================
    // BOOKING STATUS
    // =========================

    status: "Pending",

    createdAt:
      new Date().toLocaleString("en-IN")

  };


  // =========================
  // SAVE BOOKING
  // =========================

  bookings.push(booking);
localStorage.setItem("sevaSathiBookings", JSON.stringify(bookings));

db.collection("bookings")
  .doc(booking.bookingId)
  .set(booking)
  .then(() => {
    console.log("✅ Booking Firebase में save हो गई");
    showBookingSuccess(booking);
  })
  .catch(error => {
    console.error("❌ Firebase booking error:", error);
    alert("Booking save नहीं हो पाई। Internet connection check करें।");
  });
}
// =====================================================
// BOOKING SUCCESS
// =====================================================

function showBookingSuccess(booking) {

  openModal(`
    <div style="text-align:center">

      <div style="font-size:55px">✅</div>

      <h2>Booking Successful</h2>

      <p>
        आपकी service request successfully submit हो गई।
      </p>

      <div style="background:#eef8ff;padding:18px;border-radius:12px;margin:20px 0;text-align:left">

        <p><strong>Booking ID:</strong> ${booking.bookingId}</p>

        <p><strong>Patient:</strong> ${booking.patientName}</p>

        <p><strong>Service:</strong> ${booking.service}</p>

        <p><strong>Date:</strong> ${booking.bookingDate}</p>

        <p><strong>Time:</strong> ${booking.bookingTime}</p>

        <p><strong>Duration:</strong> ${booking.duration}</p>

        <p><strong>Total:</strong> ₹${booking.charges.total}</p>

        <p><strong>Status:</strong> ${booking.status}</p>

      </div>

      <button onclick="showPaymentQR('${booking.bookingId}')"
        style="width:100%;padding:13px;background:#0878d1;color:white;border:0;border-radius:10px;font-weight:bold">
        📱 PhonePe Payment
      </button>

      <button onclick="sendBookingWhatsApp('${booking.bookingId}')"
        style="width:100%;margin-top:10px;padding:13px;background:#16bd70;color:white;border:0;border-radius:10px;font-weight:bold">
        💬 Send Booking on WhatsApp
      </button>

      <button onclick="openUserDashboard()"
        style="width:100%;margin-top:10px;padding:13px;background:#555;color:white;border:0;border-radius:10px;font-weight:bold">
        📋 My Dashboard
      </button>

    </div>
  `);
}

// =====================================================
// FIND BOOKING
// =====================================================

function findBooking(id) {
  return bookings.find(b => b.bookingId === id);
}

// =====================================================
// PAYMENT QR
// =====================================================

function showPaymentQR(bookingId) {

  const booking = findBooking(bookingId);

  if (!booking) {
    alert("Booking नहीं मिली।");
    return;
  }

  if (PHONEPE_UPI_ID === "YOUR_PHONEPE_UPI_ID") {

    openModal(`
      <h2>📱 PhonePe Payment</h2>

      <p>
        Payment के लिए PhonePe number:
      </p>

      <h2 style="text-align:center">
        ${PHONEPE_NUMBER}
      </h2>

      <p style="margin-top:15px">
        अभी automatic QR के लिए actual UPI ID add नहीं की गई है।
      </p>

      <button onclick="sendBookingWhatsApp('${bookingId}')"
        style="width:100%;padding:13px;background:#16bd70;color:white;border:0;border-radius:10px;font-weight:bold">
        💬 Payment Details WhatsApp करें
      </button>
    `);

    return;
  }

  const upi =
    `upi://pay?pa=${encodeURIComponent(PHONEPE_UPI_ID)}` +
    `&pn=${encodeURIComponent(APP_NAME)}` +
    `&am=${booking.charges.total}` +
    `&cu=INR` +
    `&tn=${encodeURIComponent("Booking " + bookingId)}`;

  openModal(`
    <h2>📱 PhonePe Payment</h2>

    <div style="text-align:center;margin:20px">

      <div id="qrCode"></div>

      <p style="margin-top:15px">
        Amount:
        <strong>₹${booking.charges.total}</strong>
      </p>

    </div>

    <a href="${upi}"
      style="display:block;text-align:center;padding:13px;background:#0878d1;color:white;border-radius:10px;font-weight:bold">
      📱 Open UPI Payment
    </a>
  `);

  loadQRCode(upi);
}

// =====================================================
// QR CODE
// =====================================================

function loadQRCode(text) {

  const container =
    document.getElementById("qrCode");

  if (!container) return;

  if (typeof QRCode !== "undefined") {
    new QRCode(container, {
      text,
      width: 220,
      height: 220
    });
    return;
  }

  const script =
    document.createElement("script");

  script.src =
    "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";

  script.onload = () => {
    new QRCode(container, {
      text,
      width: 220,
      height: 220
    });
  };

  document.head.appendChild(script);
}

// =====================================================
// WHATSAPP
// =====================================================

function sendBookingWhatsApp(bookingId) {

  const booking = findBooking(bookingId);

  if (!booking) return;

  const message = `
*Seva Sathi - New Booking*

Booking ID: ${booking.bookingId}

Patient: ${booking.patientName}

Service: ${booking.service}

Date: ${booking.bookingDate}

Time: ${booking.bookingTime}

Duration: ${booking.duration}

Total: ₹${booking.charges.total}

Payment Status: ${booking.paymentStatus}

Customer: ${booking.userName}

Mobile: ${booking.userMobile}

Address:
${booking.address.house},
${booking.address.area},
${booking.address.city},
${booking.address.district},
${booking.address.state} - $
  {booking.address.pincode}
`;

  const url =
    "https://wa.me/" +
    WHATSAPP_NUMBER +
    "?text=" +
    encodeURIComponent(message);

  window.open(url, "_blank");
}

// =====================================================
// USER DASHBOARD
// =====================================================

function openUserDashboard() {

  if (!currentUser) {
    openLogin();
    return;
  }

  const userBookings =
  bookings.filter(
    b => b.patientUID === auth.currentUser?.uid
  );
  
  let bookingHTML = "";

  if (userBookings.length === 0) {

    bookingHTML = `
      <div style="padding:25px;background:#f5faff;border-radius:12px;text-align:center">
        <p>अभी कोई booking नहीं है।</p>
      </div>
    `;

  } else {

    bookingHTML = userBookings
      .slice()
      .reverse()
      .map(b => `
        <div style="background:#f8fbfd;border:1px solid #e2ebf2;padding:15px;border-radius:12px;margin-top:12px">

          <p><strong>Booking ID:</strong> ${b.bookingId}</p>

          <p><strong>Patient:</strong> ${b.patientName}</p>

          <p><strong>Service:</strong> ${b.service}</p>

          <p><strong>Date:</strong> ${b.bookingDate}</p>

          <p><strong>Time:</strong> ${b.bookingTime}</p>

          <p><strong>Duration:</strong> ${b.duration}</p>

          <p><strong>Amount:</strong> ₹${b.charges.total}</p>

          <p><strong>Status:</strong> ${b.status}</p>

          <p><strong>Payment:</strong> ${b.paymentStatus}</p>

          <button onclick="showBookingDetails('${b.bookingId}')"
            style="padding:9px 12px;background:#0878d1;color:white;border:0;border-radius:8px">
            View Details
          </button>

        </div>
      `)
      .join("");
  }

  openModal(`
    <h2>👤 My Dashboard</h2>

    <div style="background:#eef8ff;padding:15px;border-radius:12px;margin-top:15px">
      <p><strong>Name:</strong> ${currentUser.name}</p>
      <p><strong>Mobile:</strong> ${currentUser.mobile}</p>
    </div>

    <h3 style="margin-top:20px">
      📋 My Bookings
    </h3>

    ${bookingHTML}

    <button onclick="openBookingForm()"
      style="width:100%;margin-top:20px;padding:13px;background:#16bd70;color:white;border:0;border-radius:10px;font-weight:bold">
      📅 New Booking
    </button>

    <button onclick="logoutUser()"
      style="width:100%;margin-top:10px;padding:13px;background:#555;color:white;border:0;border-radius:10px;font-weight:bold">
      🚪 Logout
    </button>
  `);
}

// =====================================================
// BOOKING DETAILS
// =====================================================

function showBookingDetails(bookingId) {

  const b = findBooking(bookingId);

  if (!b) return;

  openModal(`
    <h2>📋 Booking Details</h2>

    <div style="margin-top:20px">

      <p><strong>Booking ID:</strong> ${b.bookingId}</p>

      <p><strong>Patient:</strong> ${b.patientName}</p>

      <p><strong>Age:</strong> ${b.patientAge || "-"}</p>

      <p><strong>Gender:</strong> ${b.patientGender || "-"}</p>

      <p><strong>Service:</strong> ${b.service}</p>

      <p><strong>Date:</strong> ${b.bookingDate}</p>

      <p><strong>Time:</strong> ${b.bookingTime}</p>

      <p><strong>Duration:</strong> ${b.duration}</p>

      <p><strong>Total:</strong> ₹${b.charges.total}</p>

      <p><strong>Payment:</strong> ${b.paymentStatus}</p>

      <p><strong>Booking Status:</strong> ${b.status}</p>

      <p><strong>Nurse:</strong> ${b.assignedNurse}</p>

    </div>

    <button onclick="trackBooking('${b.bookingId}')"
      style="width:100%;margin-top:20px;padding:13px;background:#0878d1;color:white;border:0;border-radius:10px;font-weight:bold">
      📍 Track Booking
    </button>

    <button onclick="sendBookingWhatsApp('${b.bookingId}')"
      style="width:100%;margin-top:10px;padding:13px;background:#16bd70;color:white;border:0;border-radius:10px;font-weight:bold">
      💬 WhatsApp
    </button>
  `);
}

// =====================================================
// TRACK NURSE
// =====================================================

function trackNurse() {

  openModal(`
    <h2>📍 Nurse Tracking</h2>

    <div style="margin:20px 0;padding:30px;border-radius:15px;background:#e6f6ed;text-align:center;font-size:45px">
      👩‍⚕️

      <br>

      <span style="font-size:15px;color:#16865b">
        Nurse tracking demo
      </span>
    </div>

    <p>
      Nurse assign होने के बाद वास्तविक tracking system जोड़ा जा सकता है।
    </p>
  `);
}

async function trackBooking(bookingId) {

  const b = findBooking(bookingId);

  if (!b) {
    alert("❌ Booking नहीं मिली।");
    return;
  }

  const addressText = [
  b.address?.area,
  b.address?.city,
  b.address?.district,
  b.address?.state,
  "India"
].filter(Boolean).join(", ");
  openModal(`
    <h2>📍 Live Service Tracking</h2>

    <div style="
      background:#eef8ff;
      padding:15px;
      border-radius:12px;
      margin-top:15px;
    ">
      <p><strong>Booking ID:</strong> ${b.bookingId}</p>

      <p><strong>Service:</strong> ${b.service || "-"}</p>

      <div style="margin-top:20px;">

  <div style="
    display:flex;
    justify-content:space-between;
    align-items:center;
    position:relative;
  ">

    <div style="
      position:absolute;
      top:15px;
      left:10%;
      right:10%;
      height:4px;
      background:#ddd;
      z-index:0;
    "></div>

    ${[
      ["Pending", "⏳"],
      ["Nurse Assigned", "👩‍⚕️"],
      ["On the Way", "🚗"],
      ["Reached", "📍"],
      ["Service Started", "🩺"],
      ["Completed", "✅"]
    ].map((item, index) => {

      const active =
        ["Pending", "Nurse Assigned", "On the Way", "Reached", "Service Started", "Completed"]
        .indexOf(b.status || "Pending") >= index;

      return `
        <div style="
          text-align:center;
          position:relative;
          z-index:1;
          width:16%;
        ">

          <div style="
            width:30px;
            height:30px;
            margin:auto;
            border-radius:50%;
            background:${active ? "#0878d1" : "#ddd"};
            color:white;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:15px;
          ">
            ${item[1]}
          </div>

          <div style="
            font-size:10px;
            margin-top:6px;
            color:${active ? "#0878d1" : "#777"};
            font-weight:${active ? "bold" : "normal"};
          ">
            ${item[0]}
          </div>

        </div>
      `;
    }).join("")}

  </div>

</div>
    </div>

    <div id="trackingMap"
      style="
        width:100%;
        height:320px;
        margin-top:15px;
        border-radius:15px;
        overflow:hidden;
        border:1px solid #ddd;
      ">
      <div style="text-align:center;padding-top:120px;">
        📍 Location खोजी जा रही है...
      </div>
    </div>

    <p style="
      text-align:center;
      color:#667085;
      font-size:13px;
      margin-top:10px;
    ">
      📍 Service location
    </p>
  `);

  try {

    const response = await fetch(
      "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=" +
      encodeURIComponent(addressText)
    );

    const data = await response.json();

    if (!data.length) {
      document.getElementById("trackingMap").innerHTML =
        "<div style='text-align:center;padding:120px 10px;'>📍 Location नहीं मिली</div>";
      return;
    }

    const lat = parseFloat(data[0].lat);
    const lon = parseFloat(data[0].lon);

    const map = L.map("trackingMap").setView([lat, lon], 16);

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "&copy; OpenStreetMap contributors"
      }
    ).addTo(map);

    L.marker([lat, lon])
      .addTo(map)
      .bindPopup("📍 Service Location")
      .openPopup();

  } catch (error) {

    console.error(error);

    document.getElementById("trackingMap").innerHTML =
      "<div style='text-align:center;padding:120px 10px;'>⚠️ Map load नहीं हो पाया</div>";
  }
}
// =====================================================
// LOGOUT
// =====================================================

function logoutUser() {

  currentUser = null;

  localStorage.removeItem("sevaSathiUser");

  closeModal();

  alert("आप Logout हो गए हैं।");
}

// =====================================================
// EMERGENCY 108
// =====================================================

function emergencyCall() {
  window.location.href = "tel:108";
}

// =====================================================
// ADMIN DASHBOARD
// DEMO ONLY
// =====================================================

async function openAdminDashboard() {

  const snapshot =
    await db.collection("bookings").get();

  const allBookings =
    snapshot.docs.map(doc => doc.data());

  bookings = allBookings;

  localStorage.setItem(
    "sevaSathiBookings",
    JSON.stringify(bookings)
  );

  const nurseList = [
    "Praveen Kumar",
    "Prabhat",
    "Satyendra",
    "Anurag",
    "Arvind",
    "Jaswant",
    "Anil",
    "Mahendra",
    "Kheteshwar",
    "Rahul",
    "Rajnish",
    "Jagdish",
    "Muskan",
    "Neha",
    "Palak"
  ];

  // =====================================================
  // DASHBOARD COUNTS
  // =====================================================

  const total = allBookings.length;

  const pending =
    allBookings.filter(b => b.status === "Pending").length;

  const confirmed =
    allBookings.filter(b => b.status === "Confirmed").length;

  const completed =
    allBookings.filter(b => b.status === "Completed").length;

  const nurseAssigned =
    allBookings.filter(
      b =>
        b.assignedNurse &&
        b.assignedNurse !== "Not Assigned"
    ).length;

  const paid =
    allBookings.filter(
      b => b.paymentStatus === "Paid"
    ).length;

  const unpaid =
    allBookings.filter(
      b =>
        !b.paymentStatus ||
        b.paymentStatus === "Pending"
    ).length;

  // =====================================================
  // BOOKING CARDS
  // =====================================================

  let html = "";

  if (!allBookings.length) {

    html = `
      <div style="
        text-align:center;
        padding:35px 20px;
        background:#f5faff;
        border-radius:16px;
        margin-top:15px;
        border:1px solid #e3edf5;
      ">
        <div style="font-size:45px">📭</div>

        <h3 style="margin:10px 0">
          अभी कोई Booking नहीं है
        </h3>

        <p>
          नई booking आने पर यहाँ दिखाई देगी।
        </p>
      </div>
    `;

  } else {

    html = allBookings
      .slice()
      .reverse()
      .map(b => {

        const nurseOptions = nurseList.map(nurse => `
          <option value="${nurse}"
            ${b.assignedNurse === nurse ? "selected" : ""}>
            ${nurse}
          </option>
        `).join("");

        const paymentColor =
          b.paymentStatus === "Paid"
            ? "#16bd70"
            : "#f59e0b";

        const statusColor =
          b.status === "Completed"
            ? "#16bd70"
            : b.status === "Cancelled"
            ? "#dc3545"
            : "#0878d1";

        return `
          <div style="
            background:white;
            border:1px solid #e1e8ee;
            padding:18px;
            border-radius:16px;
            margin-top:16px;
            box-shadow:0 5px 18px rgba(0,0,0,0.05);
          ">

            <!-- BOOKING HEADER -->

            <div style="
              display:flex;
              justify-content:space-between;
              align-items:center;
              gap:10px;
              flex-wrap:wrap;
            ">

              <div>
                <div style="
                  font-size:12px;
                  color:#667085;
                ">
                  BOOKING ID
                </div>

                <strong style="
                  font-size:18px;
                  color:#16324f;
                ">
                  📋 ${b.bookingId}
                </strong>
              </div>

              <span style="
                background:${statusColor};
                color:white;
                padding:6px 10px;
                border-radius:20px;
                font-size:12px;
                font-weight:bold;
              ">
                ${b.status || "Pending"}
              </span>

            </div>

            <hr style="
              border:0;
              border-top:1px solid #edf1f4;
              margin:15px 0;
            ">

            <!-- PATIENT -->

            <div style="
              background:#f8fbfd;
              padding:13px;
              border-radius:12px;
            ">

              <h4 style="
                margin:0 0 10px;
                color:#16324f;
              ">
                👤 Patient Details
              </h4>

              <p>
                <strong>Patient:</strong>
                ${b.patientName || "-"}
              </p>

              <p>
                <strong>Age:</strong>
                ${b.patientAge || "-"}
              </p>

              <p>
                <strong>Gender:</strong>
                ${b.patientGender || "-"}
              </p>

              <p>
                <strong>Patient Mobile:</strong>
                ${b.patientMobile || "-"}
              </p>

              <p>
                <strong>Medical Condition:</strong>
                ${b.medicalCondition || "-"}
              </p>

            </div>

            <!-- CUSTOMER -->

            <div style="
              background:#f8fbfd;
              padding:13px;
              border-radius:12px;
              margin-top:12px;
            ">

              <h4 style="
                margin:0 0 10px;
                color:#16324f;
              ">
                👤 Customer Details
              </h4>

              <p>
                <strong>Name:</strong>
                ${b.userName || "-"}
              </p>

              <p>
                <strong>Mobile:</strong>
                ${b.userMobile || "-"}
              </p>

            </div>

            <!-- SERVICE -->

            <div style="
              background:#eef8ff;
              padding:13px;
              border-radius:12px;
              margin-top:12px;
            ">

              <h4 style="
                margin:0 0 10px;
                color:#0878d1;
              ">
                🩺 Service Details
              </h4>

              <p>
                <strong>Service:</strong>
                ${b.service || "-"}
              </p>

              <p>
                <strong>📅 Date:</strong>
                ${b.bookingDate || "-"}
              </p>

              <p>
                <strong>⏰ Time:</strong>
                ${b.bookingTime || "-"}
              </p>

              <p>
                <strong>Duration:</strong>
                ${b.duration || "-"}
              </p>

              <p style="
                font-size:18px;
                margin-bottom:0;
              ">
                <strong>💰 Amount:</strong>
                ₹${b.charges?.total || 0}
              </p>

            </div>

            <!-- ADDRESS -->

            <details style="margin-top:12px">

              <summary style="
                cursor:pointer;
                background:#f5f7f9;
                padding:12px;
                border-radius:10px;
                font-weight:bold;
                color:#16324f;
              ">
                🏠 View Address
              </summary>

              <div style="
                padding:12px;
                background:#fafafa;
                margin-top:5px;
                border-radius:10px;
              ">

                <p>
                  ${b.address?.house || ""}
                  ${b.address?.area || ""}
                </p>

                <p>
                  ${b.address?.city || ""}
                  ${b.address?.district || ""}
                </p>

                <p>
                  ${b.address?.state || ""}
                  - ${b.address?.pincode || ""}
                </p>

                <p>
                  <strong>Landmark:</strong>
                  ${b.address?.landmark || "-"}
                </p>

              </div>

            </details>

            <!-- NURSE -->

            <div style="margin-top:16px">

              <label>
                <strong>👩‍⚕️ Assign Nurse</strong>
              </label>

              <!-- NURSE SERVICE ASSIGNMENT -->

<div style="
  margin-top:15px;
  padding:14px;
  background:#f8fbfd;
  border:1px solid #dfe7ee;
  border-radius:13px;
">

  <h4 style="
    margin:0 0 10px 0;
    color:#0878d1;
  ">
    👩‍⚕️ Assign Service to Nurse
  </h4>

  <p style="
    margin:5px 0 10px;
    font-size:13px;
    color:#667085;
  ">
    Admin केवल selected Nurse को यह service assign करेगा।
  </p>

  <select
    id="nurseAssign_${b.bookingId}"
    style="
      width:100%;
      padding:12px;
      border:1px solid #d0d5dd;
      border-radius:9px;
      background:white;
      box-sizing:border-box;
    "
  >

    <option value="">
      -- Select Nurse --
    </option>

    ${nurseAccounts.map(nurse => `
      <option
        value="${nurse.id}"
        ${b.assignedNurseId === nurse.id ? "selected" : ""}
      >
        ${nurse.id} - ${nurse.name}
      </option>
    `).join("")}

  </select>


  <button
    onclick="
      assignNurse(
        '${b.bookingId}',
        document.getElementById('nurseAssign_${b.bookingId}').value
      )
    "
    style="
      width:100%;
      margin-top:10px;
      padding:12px;
      background:#0878d1;
      color:white;
      border:0;
      border-radius:9px;
      font-weight:bold;
    "
  >
    ✅ Assign Service
  </button>


  <div style="
    margin-top:10px;
    padding:9px;
    background:#eef6ff;
    border-radius:8px;
    font-size:13px;
  ">

    Current Nurse:
    <strong>
      ${b.assignedNurse || "Not Assigned"}
    </strong>

    ${
      b.assignedNurseId
        ? `<br>Nurse ID: <strong>${b.assignedNurseId}</strong>`
        : ""
    }

  </div>

</div>

              <p style="
                margin-top:10px;
                background:#f5faff;
                padding:10px;
                border-radius:8px;
              ">
                👩‍⚕️ <strong>Current Nurse:</strong>
                ${b.assignedNurse || "Not Assigned"}
              </p>

            </div>

            <!-- BOOKING STATUS -->

            <div style="margin-top:15px">

              <label>
                <strong>🔄 Booking Status</strong>
              </label>

              <select
                onchange="updateBookingStatus('${b.bookingId}', this.value)"
                style="
                  width:100%;
                  padding:12px;
                  margin-top:8px;
                  border:1px solid #d8e1e9;
                  border-radius:10px;
                  background:white;
                "
              >

                <option value="Pending"
                  ${b.status === "Pending" ? "selected" : ""}>
                  ⏳ Pending
                </option>

                <option value="Confirmed"
                  ${b.status === "Confirmed" ? "selected" : ""}>
                  ✅ Confirmed
                </option>

                <option value="Nurse Assigned"
                  ${b.status === "Nurse Assigned" ? "selected" : ""}>
                  👩‍⚕️ Nurse Assigned
                </option>

                <option value="Completed"
                  ${b.status === "Completed" ? "selected" : ""}>
                  ✔️ Completed
                </option>

                <option value="Cancelled"
                  ${b.status === "Cancelled" ? "selected" : ""}>
                  ❌ Cancelled
                </option>

              </select>

            </div>

            <!-- PAYMENT STATUS -->

            <div style="margin-top:15px">

              <label>
                <strong>💰 Payment Status</strong>
              </label>

              <select
                onchange="updatePaymentStatus('${b.bookingId}', this.value)"
                style="
                  width:100%;
                  padding:12px;
                  margin-top:8px;
                  border:1px solid #d8e1e9;
                  border-radius:10px;
                  background:white;
                "
              >

                <option value="Pending"
                  ${b.paymentStatus === "Pending" ? "selected" : ""}>
                  ⏳ Pending
                </option>

                <option value="Paid"
                  ${b.paymentStatus === "Paid" ? "selected" : ""}>
                  ✅ Paid
                </option>

                <option value="Refunded"
                  ${b.paymentStatus === "Refunded" ? "selected" : ""}>
                  ↩️ Refunded
                </option>

              </select>

              <div style="
                margin-top:8px;
                color:${paymentColor};
                font-weight:bold;
              ">
                ${b.paymentStatus === "Paid"
                  ? "✅ Payment Received"
                  : "⏳ Payment Pending"}
              </div>

            </div>

            <!-- WHATSAPP -->

            <button
              onclick="sendBookingWhatsApp('${b.bookingId}')"
              style="
                width:100%;
                margin-top:16px;
                padding:13px;
                background:#16bd70;
                color:white;
                border:0;
                border-radius:10px;
                font-weight:bold;
                cursor:pointer;
              "
            >
              💬 Contact Customer on WhatsApp
            </button>

          </div>
        `;
      })
      .join("");
  }

  // =====================================================
  // ADMIN DASHBOARD
  // =====================================================

  openModal(`

    <div>

      <!-- HEADER -->

      <div style="
        background:linear-gradient(135deg,#0878d1,#16a86b);
        color:white;
        padding:20px;
        border-radius:16px;
      ">

        <div style="
          font-size:13px;
          opacity:.9;
        ">
          SEVA SATHI
        </div>

        <h2 style="
          color:white;
          margin:5px 0;
        ">
          🛠️ Admin Dashboard
        </h2>

        <p style="
          color:white;
          margin:0;
          opacity:.9;
        ">
          Booking और service management
        </p>

      </div>


      <!-- STATS -->

      <div style="
        display:grid;
        grid-template-columns:repeat(2,1fr);
        gap:10px;
        margin-top:15px;
      ">

        <div style="
          background:#eef8ff;
          padding:15px;
          border-radius:13px;
          text-align:center;
        ">
          <div style="font-size:25px">📊</div>
          <strong style="font-size:24px">
            ${total}
          </strong>
          <div>Total Bookings</div>
        </div>


        <div style="
          background:#fff7e6;
          padding:15px;
          border-radius:13px;
          text-align:center;
        ">
          <div style="font-size:25px">⏳</div>
          <strong style="font-size:24px">
            ${pending}
          </strong>
          <div>Pending</div>
        </div>


        <div style="
          background:#eefaf4;
          padding:15px;
          border-radius:13px;
          text-align:center;
        ">
          <div style="font-size:25px">✅</div>
          <strong style="font-size:24px">
            ${confirmed}
          </strong>
          <div>Confirmed</div>
        </div>


        <div style="
          background:#f0f8ff;
          padding:15px;
          border-radius:13px;
          text-align:center;
        ">
          <div style="font-size:25px">👩‍⚕️</div>
          <strong style="font-size:24px">
            ${nurseAssigned}
          </strong>
          <div>Nurse Assigned</div>
        </div>


        <div style="
          background:#eefaf4;
          padding:15px;
          border-radius:13px;
          text-align:center;
        ">
          <div style="font-size:25px">✔️</div>
          <strong style="font-size:24px">
            ${completed}
          </strong>
          <div>Completed</div>
        </div>


        <div style="
          background:#eefaf4;
          padding:15px;
          border-radius:13px;
          text-align:center;
        ">
          <div style="font-size:25px">💰</div>
          <strong style="font-size:24px">
            ${paid}
          </strong>
          <div>Paid</div>
        </div>


        <div style="
          background:#fff7e6;
          padding:15px;
          border-radius:13px;
          text-align:center;
          grid-column:1 / -1;
        ">
          <div style="font-size:25px">💸</div>
          <strong style="font-size:24px">
            ${unpaid}
          </strong>
          <div>Payment Pending</div>
        </div>

      </div>


      <!-- NURSE SUMMARY -->

      <div style="
        margin-top:18px;
        padding:15px;
        background:#f8fbfd;
        border:1px solid #e1e8ee;
        border-radius:14px;
      ">

        <h3 style="margin-bottom:5px">
          👩‍⚕️ Nurse Team
        </h3>

        <p>
          Total Registered Nurses:
          <strong>${nurseList.length}</strong>
        </p>

        <p style="margin-bottom:0">
          Assigned Bookings:
          <strong>${nurseAssigned}</strong>
        </p>

      </div>


      <!-- BOOKINGS -->

      <h3 style="margin-top:22px">
        📋 All Bookings
      </h3>

      ${html}

    </div>

  `);
}
  
// =====================================================
// ADMIN - ASSIGN SERVICE TO NURSE
// =====================================================

async function assignNurse(bookingId, nurseId) {

  const index =
    bookings.findIndex(
      b => b.bookingId === bookingId
    );

  if (index === -1) {
    alert("❌ Booking नहीं मिली।");
    return;
  }

  // Nurse Assignment हटाना
  if (!nurseId) {

    bookings[index].assignedNurse = "Not Assigned";
    bookings[index].assignedNurseId = "";

    localStorage.setItem(
      "sevaSathiBookings",
      JSON.stringify(bookings)
    );

    try {
      await db.collection("bookings")
        .doc(bookingId)
        .update({
          assignedNurse: "Not Assigned",
          assignedNurseId: ""
        });

      alert("✅ Nurse Assignment हटा दिया गया।");

      openAdminDashboard();

    } catch (error) {
      console.error("Firebase Error:", error);
      alert("❌ Firebase में update नहीं हो पाया।");
    }

    return;
  }

  // Nurse खोजें
  const nurse =
    nurseAccounts.find(
      n => n.id === nurseId
    );

  if (!nurse) {
    alert("❌ Nurse ID नहीं मिली।");
    return;
  }

  // Local data update
  bookings[index].assignedNurse =
    nurse.name;

  bookings[index].assignedNurseId =
    nurse.id;

  bookings[index].status =
    "Nurse Assigned";

  localStorage.setItem(
    "sevaSathiBookings",
    JSON.stringify(bookings)
  );

  // Firebase update
  try {

    await db.collection("bookings")
      .doc(bookingId)
      .update({
        assignedNurse: nurse.name,
        assignedNurseId: nurse.id,
        status: "Nurse Assigned"
      });

    alert(
      "✅ Service Successfully Assigned!\n\n" +
      "Nurse: " + nurse.name +
      "\nNurse ID: " + nurse.id
    );

    openAdminDashboard();

  } catch (error) {

    console.error("Firebase Error:", error);

    alert(
      "❌ Nurse assignment Firebase में save नहीं हुआ।"
    );
  }
}

  
// =====================================================
// UPDATE BOOKING STATUS
// =====================================================

async function updateBookingStatus(id, status) {

  try {

    const index =
      bookings.findIndex(b => b.bookingId === id);

    if (index !== -1) {

      bookings[index].status = status;

      localStorage.setItem(
        "sevaSathiBookings",
        JSON.stringify(bookings)
      );
    }

    // Firebase में Status Update
    await db.collection("bookings")
      .doc(id)
      .update({
        status: status
      });

    alert("✅ Booking Status Updated");

    // Dashboard को तुरंत refresh करें
    openAdminDashboard();

  } catch (error) {

    console.error(
      "Firebase Status Error:",
      error
    );

    alert(
      "❌ Booking Status Firebase में update नहीं हुआ।"
    );
  }
}


async function updatePaymentStatus(id, status) {

  try {

    const index =
      bookings.findIndex(b => b.bookingId === id);

    if (index !== -1) {

      bookings[index].paymentStatus = status;

      localStorage.setItem(
        "sevaSathiBookings",
        JSON.stringify(bookings)
      );
    }

    // Firebase में Payment Status Update
    await db.collection("bookings")
      .doc(id)
      .update({
        paymentStatus: status
      });

    alert("✅ Payment Status Updated");

    openAdminDashboard();

  } catch (error) {

    console.error(
      "Firebase Payment Error:",
      error
    );

    alert(
      "❌ Payment Status Firebase में update नहीं हुआ।"
    );
  }
}
// =====================================================
// NURSE PANEL
// =====================================================

const nurseList = [
  "Praveen Kumar",
  "Prabhat",
  "Satyendra",
  "Anurag",
  "Arvind",
  "Jaswant",
  "Anil",
  "Mahendra",
  "Kheteshwar",
  "Rahul",
  "Rajnish",
  "Jagdish",
  "Muskan",
  "Neha",
  "Palak"
];

let currentNurse = null;


// =====================================================
// NURSE LOGIN
// =====================================================

function openNurseLogin() {

  openModal(`
    <div style="text-align:center">

      <div style="font-size:55px">👩‍⚕️</div>

      <h2>👩‍⚕️ Nurse Login</h2>

      <p style="color:#667085">
        Seva Sathi Nurse Panel
      </p>

      <input
        id="nurseLoginId"
        type="text"
        placeholder="Nurse ID"
        autocomplete="username"
        style="
          width:100%;
          padding:13px;
          margin-top:15px;
          border:1px solid #ddd;
          border-radius:10px;
          box-sizing:border-box;
        "
      >

      <input
        id="nurseLoginPassword"
        type="password"
        placeholder="Password"
        autocomplete="current-password"
        style="
          width:100%;
          padding:13px;
          margin-top:10px;
          border:1px solid #ddd;
          border-radius:10px;
          box-sizing:border-box;
        "
      >

      <button
        onclick="nurseLogin()"
        style="
          width:100%;
          margin-top:15px;
          padding:14px;
          background:#0878d1;
          color:white;
          border:0;
          border-radius:10px;
          font-weight:bold;
          font-size:15px;
        ">
        🔐 Login as Nurse
      </button>

    </div>
  `);
}


// =====================================================
// NURSE LOGIN CHECK
// =====================================================

// =====================================================
// NURSE LOGIN - ID + PASSWORD
// =====================================================

const nurseAccounts = [
  { id: "NUR110", password: "Nurse@201", name: "Praveen Kumar" },
  { id: "NUR123", password: "Nurse@052", name: "Prabhat" },
  { id: "NUR134", password: "Nurse@103", name: "Satyendra" },
  { id: "NUR034", password: "Nurse@044", name: "Anurag" },
  { id: "NUR105", password: "Nurse@705", name: "Arvind" },
  { id: "NUR096", password: "Nurse@007", name: "Jaswant" },
  { id: "NUR807", password: "Nurse@077", name: "Anil" },
  { id: "NUR008", password: "Nurse@044", name: "Mahendra" },
  { id: "NUR309", password: "Nurse@179", name: "Kheteshwar" },
  { id: "NUR310", password: "Nurse@030", name: "Rahul" },
  { id: "NUR911", password: "Nurse@171", name: "Rajnish" },
  { id: "NUR412", password: "Nurse@712", name: "Jagdish" },
  { id: "NUR713", password: "Nurse@813", name: "Muskan" },
  { id: "NUR914", password: "Nurse@074", name: "Neha" },
  { id: "NUR015", password: "Nurse@915", name: "Palak" }
];


// =====================================================
// NURSE LOGIN - FIREBASE + EXISTING NURSE ACCOUNTS
// =====================================================

async function nurseLogin() {

  const nurseId =
    document.getElementById("nurseLoginId")?.value
      .trim()
      .toUpperCase();

  const password =
    document.getElementById("nurseLoginPassword")?.value;

  if (!nurseId || !password) {
    alert("❌ Nurse ID और Password दोनों भरें।");
    return;
  }

  // Nurse ID check
  const nurse =
    nurseAccounts.find(
      n => n.id === nurseId
    );

  if (!nurse) {
    alert("❌ Nurse ID गलत है।");
    return;
  }

  // ===================================================
  // NUR110 → FIREBASE AUTHENTICATION
  // ===================================================

  if (nurseId === "NUR110") {

    try {

      const result =
        await auth.signInWithEmailAndPassword(
          "praveenbishnoi740@gmail.com",
          password
        );

      currentNurse = {
        id: "NUR110",
        name: nurse.name,
        uid: result.user.uid
      };

      localStorage.setItem(
        "sevaSathiNurse",
        JSON.stringify(currentNurse)
      );

      alert(
        "✅ Firebase Nurse Login Successful!\n\n" +
        "Welcome " + nurse.name
      );

      closeModal();

      openNurseDashboard();

    } catch (error) {

      console.error(
        "❌ Firebase Nurse Login Error:",
        error.code,
        error.message
      );

      alert(
        "❌ Firebase Nurse Login Failed\n\n" +
        "Nurse ID या Password गलत है।"
      );
    }

    return;
  }

  // ===================================================
  // बाकी NURSES → अभी OLD LOGIN
  // ===================================================

  if (nurse.password !== password) {

    alert(
      "❌ Nurse ID या Password गलत है।"
    );

    return;
  }

  currentNurse = {
    id: nurse.id,
    name: nurse.name
  };

  localStorage.setItem(
    "sevaSathiNurse",
    JSON.stringify(currentNurse)
  );

  alert(
    "✅ Login Successful!\n\n" +
    "Welcome " + nurse.name
  );

  closeModal();

  openNurseDashboard();
}
// =====================================================
// NURSE DASHBOARD
// =====================================================

// =====================================================
// NURSE DASHBOARD - SERVICE PLAN
// =====================================================

async function openNurseDashboard() {

  const savedNurse =
    JSON.parse(
      localStorage.getItem("sevaSathiNurse")
    );

  if (!currentNurse && savedNurse) {
    currentNurse = savedNurse;
  }

  if (!currentNurse) {
    openNurseLogin();
    return;
  }

  // Firebase से इस Nurse की assigned services लाएँ
  const snapshot =
    await db.collection("bookings")
      .where("assignedNurseId", "==", currentNurse.id)
      .get();

  const myBookings =
    snapshot.docs.map(doc => doc.data());

  // Local data भी update करें
  bookings = myBookings;

  // Today's date
  const today =
    new Date().toLocaleDateString("en-IN");

  // Today's services
  const todayBookings =
    myBookings
      .filter(b => b.bookingDate === today)
      .sort((a, b) =>
        (a.bookingTime || "")
          .localeCompare(b.bookingTime || "")
      );

  // Counts
  const pending =
    myBookings.filter(
      b => b.status !== "Completed"
    ).length;

  const completed =
    myBookings.filter(
      b => b.status === "Completed"
    ).length;


  // ===================================================
  // TODAY'S SCHEDULE
  // ===================================================

  const todayHtml =
    todayBookings.length
      ? todayBookings.map(b => {

          return `
            <div style="
              background:white;
              border:1px solid #dfe7ee;
              border-left:5px solid #0878d1;
              border-radius:14px;
              padding:15px;
              margin-top:12px;
              box-shadow:0 3px 10px rgba(0,0,0,.06);
            ">

              <div style="
                display:flex;
                justify-content:space-between;
                gap:8px;
              ">

                <strong>
                  🕐 ${b.bookingTime || "Time not set"}
                </strong>

                <span style="
                  background:#eef6ff;
                  color:#0878d1;
                  padding:5px 8px;
                  border-radius:20px;
                  font-size:11px;
                  font-weight:bold;
                ">
                  ${b.status || "Pending"}
                </span>

              </div>

              <hr style="
                border:0;
                border-top:1px solid #eee;
                margin:10px 0;
              ">

              <p>
                📋 <strong>Booking:</strong>
                ${b.bookingId}
              </p>

              <p>
                🩺 <strong>Service:</strong>
                ${b.service || "-"}
              </p>

              <p>
                👤 <strong>Patient:</strong>
                ${b.patientName || "-"}
              </p>

              <p>
                ⏱️ <strong>Duration:</strong>
                ${b.duration || "-"}
              </p>

              <p>
                📍 <strong>Location:</strong><br>
                ${b.address?.area || ""},
                ${b.address?.city || ""},
                ${b.address?.district || ""}
              </p>

              <div style="
                display:grid;
                grid-template-columns:1fr 1fr;
                gap:8px;
                margin-top:12px;
              ">

                <button
                  onclick="nurseViewBooking('${b.bookingId}')"
                  style="
                    padding:10px;
                    border:0;
                    border-radius:9px;
                    background:#eef6ff;
                    color:#0878d1;
                    font-weight:bold;
                  ">
                  👁️ Details
                </button>

<select
  ${b.status === "Completed" || b.status === "Cancelled" ? "disabled" : ""}
  onchange="
    nurseChangeStatus(
      '${b.bookingId}',
      this.value
    )
  "
  style="
    width:100%;
    margin-top:10px;
    padding:11px;
    border:1px solid #ddd;
    border-radius:9px;
    box-sizing:border-box;
    font-weight:bold;
  ">

  <option value="">
    📋 Update Service Status
  </option>

  <option value="Pending"
    ${b.status === "Pending" ? "selected" : ""}>
    🕐 Pending
  </option>

  <option value="On the Way"
    ${b.status === "On the Way" ? "selected" : ""}>
    🚗 On the Way
  </option>

  <option value="Reached"
    ${b.status === "Reached" ? "selected" : ""}>
    📍 Reached
  </option>

  <option value="Service Started"
    ${b.status === "Service Started" ? "selected" : ""}>
    🩺 Service Started
  </option>

  <option value="Completed"
    ${b.status === "Completed" ? "selected" : ""}>
    ✅ Completed
  </option>

  <option value="Cancelled"
    ${b.status === "Cancelled" ? "selected" : ""}>
    ❌ Cancelled
  </option>

</select>
                <button
                  onclick="nurseOpenMap('${b.bookingId}')"
                  style="
                    padding:10px;
                    border:0;
                    border-radius:9px;
                    background:#eaf8ef;
                    color:#16834b;
                    font-weight:bold;
                  ">
                  📍 Map
                </button>

                <button
                  onclick="nurseCallPatient('${b.patientMobile || b.userMobile || ""}')"
                  style="
                    padding:10px;
                    border:0;
                    border-radius:9px;
                    background:#fff4e5;
                    color:#c76a00;
                    font-weight:bold;
                  ">
                  📞 Call
                </button>

                <button
                  onclick="nurseWhatsAppPatient('${b.patientMobile || b.userMobile || ""}')"
                  style="
                    padding:10px;
                    border:0;
                    border-radius:9px;
                    background:#eafaf1;
                    color:#16834b;
                    font-weight:bold;
                  ">
                  💬 WhatsApp
                </button>

              </div>

              <select
  onchange="
    nurseChangeStatus(
      '${b.bookingId}',
      this.value
    )
  "
  style="
    width:100%;
    margin-top:10px;
    padding:11px;
    border:1px solid #ddd;
    border-radius:9px;
    box-sizing:border-box;
    font-weight:bold;
  ">

  <option value="">
    📋 Update Service Status
  </option>

  <option value="Pending"
    ${b.status === "Pending" ? "selected" : ""}>
    🕐 Pending
  </option>

  <option value="On the Way"
    ${b.status === "On the Way" ? "selected" : ""}>
    🚗 On the Way
  </option>

  <option value="Reached"
    ${b.status === "Reached" ? "selected" : ""}>
    📍 Reached
  </option>

  <option value="Service Started"
    ${b.status === "Service Started" ? "selected" : ""}>
    🩺 Service Started
  </option>

  <option value="Completed"
    ${b.status === "Completed" ? "selected" : ""}>
    ✅ Completed
  </option>

  <option value="Cancelled"
    ${b.status === "Cancelled" ? "selected" : ""}>
    ❌ Cancelled
  </option>

</select>

            </div>
          `;

        }).join("")

      : `
        <div style="
          text-align:center;
          padding:25px 15px;
          background:#f8fbfd;
          border-radius:14px;
          margin-top:12px;
        ">

          <div style="font-size:45px">
            📅
          </div>

          <h3>
            आज कोई Service नहीं है
          </h3>

          <p style="color:#667085">
            आज के लिए कोई service assigned नहीं है।
          </p>

        </div>
      `;


  // ===================================================
// ALL SERVICES
// ===================================================

const allServicesHtml =
  myBookings.length
    ? myBookings.map(b => {

        return `
          <div style="
            background:white;
            border:1px solid #e1e8ee;
            border-radius:13px;
            padding:14px;
            margin-top:10px;
          ">

            <div style="
              display:flex;
              justify-content:space-between;
              gap:8px;
            ">

              <strong>
                📋 ${b.bookingId}
              </strong>

              <span style="
                font-size:11px;
                background:#eef6ff;
                color:#0878d1;
                padding:5px 8px;
                border-radius:20px;
              ">
                ${b.status || "Pending"}
              </span>

            </div>

            <p>
              🩺 <strong>${b.service || "-"}</strong>
            </p>

            <p>
              👤 ${b.patientName || "-"}
            </p>

            <p>
              📅 ${b.bookingDate || "-"}
              &nbsp; 🕐 ${b.bookingTime || "-"}
            </p>

            <button
              onclick="nurseViewBooking('${b.bookingId}')"
              style="
                width:100%;
                padding:10px;
                background:#eef6ff;
                color:#0878d1;
                border:0;
                border-radius:9px;
                font-weight:bold;
              ">
              👁️ View Details
            </button>

            <!-- STATUS UPDATE -->

            <select
              onchange="
                nurseChangeStatus(
                  '${b.bookingId}',
                  this.value
                )
              "
              style="
                width:100%;
                margin-top:10px;
                padding:11px;
                border:1px solid #ddd;
                border-radius:9px;
                box-sizing:border-box;
                font-weight:bold;
              ">

              <option value="">
                📋 Update Service Status
              </option>

              <option value="Pending"
                ${b.status === "Pending" ? "selected" : ""}>
                🕐 Pending
              </option>

              <option value="On the Way"
                ${b.status === "On the Way" ? "selected" : ""}>
                🚗 On the Way
              </option>

              <option value="Reached"
                ${b.status === "Reached" ? "selected" : ""}>
                📍 Reached
              </option>

              <option value="Service Started"
                ${b.status === "Service Started" ? "selected" : ""}>
                🩺 Service Started
              </option>

              <option value="Completed"
                ${b.status === "Completed" ? "selected" : ""}>
                ✅ Completed
              </option>

              <option value="Cancelled"
                ${b.status === "Cancelled" ? "selected" : ""}>
                ❌ Cancelled
              </option>

            </select>

          </div>
        `;

      }).join("")

    : `
      <div style="
        text-align:center;
        padding:30px 15px;
        background:#f8fbfd;
        border-radius:14px;
        margin-top:10px;
      ">

        <div style="font-size:45px">
          📋
        </div>

        <h3>
          कोई Service Assigned नहीं है
        </h3>

        <p style="color:#667085">
          Admin द्वारा service assign होने के बाद
          यहाँ दिखाई देगी।
        </p>

      </div>
    `;

// ===================================================
// PAYMENT QR - COMPLETED SERVICES
// ===================================================

const paymentQrHtml =
  myBookings.filter(
    b =>
      b.status === "Completed" &&
      b.paymentStatus !== "Paid"
  ).length

    ? myBookings
        .filter(
          b =>
            b.status === "Completed" &&
            b.paymentStatus !== "Paid"
        )
        .map(b => {

          const amount =
            Number(
              b.charges?.total ||
              b.charges?.serviceCharge ||
              0
            );

          const upiLink =
            "upi://pay?" +
            "pa=" + encodeURIComponent(PHONEPE_UPI_ID) +
            "&pn=" + encodeURIComponent("SEVA SATHI") +
            "&am=" + encodeURIComponent(amount) +
            "&cu=INR" +
            "&tn=" + encodeURIComponent(
              "SEVA SATHI " + b.bookingId
            );

          const qrUrl =
            "https://api.qrserver.com/v1/create-qr-code/" +
            "?size=250x250&data=" +
            encodeURIComponent(upiLink);

          return `
            <div style="
              margin-top:20px;
              padding:18px;
              background:#eefaf4;
              border:2px solid #16834b;
              border-radius:15px;
              text-align:center;
            ">

              <h3 style="
                margin-top:0;
                color:#16834b;
              ">
                💰 Payment Required
              </h3>

              <p>
                <strong>Booking ID:</strong>
                ${b.bookingId}
              </p>

              <p>
                👤 ${b.patientName || "-"}
              </p>

              <p style="
                font-size:22px;
                margin:10px 0;
              ">
                💵
                <strong>
                  ₹${amount}
                </strong>
              </p>

              <p style="
                color:#667085;
                font-size:13px;
              ">
                Patient इस QR Code को scan करके payment करें।
              </p>

              <img
                src="${qrUrl}"
                alt="UPI Payment QR"
                style="
                  width:250px;
                  max-width:100%;
                  background:white;
                  padding:10px;
                  border-radius:12px;
                  margin:10px auto;
                "
              >

              <p style="
                font-size:13px;
                color:#667085;
              ">
                UPI ID: ${PHONEPE_UPI_ID}
              </p>

              <button
                onclick="nurseMarkPaymentReceived('${b.bookingId}')"
                style="
                  width:100%;
                  padding:12px;
                  margin-top:10px;
                  background:#16834b;
                  color:white;
                  border:0;
                  border-radius:10px;
                  font-weight:bold;
                  font-size:15px;
                ">
                ✅ Payment Received / Mark Paid
              </button>

            </div>
          `;

        })
        .join("")

    : "";
  // ===================================================
  // NURSE PANEL UI
  // ===================================================

  openModal(`

    <div>

      <!-- HEADER -->

      <div style="
        background:linear-gradient(135deg,#0878d1,#0aa6e8);
        color:white;
        padding:20px;
        border-radius:16px;
      ">

        <div style="font-size:42px">
          👩‍⚕️
        </div>

        <h2 style="margin:5px 0">
          Nurse Panel
        </h2>

        <p style="margin:3px 0">
          Welcome, ${currentNurse.name}
        </p>

        <p style="
          margin:5px 0 0;
          font-size:13px;
          opacity:.9;
        ">
          Nurse ID: ${currentNurse.id}
        </p>

      </div>


      <!-- SUMMARY -->

      <div style="
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:10px;
        margin-top:15px;
      ">

        <div style="
          background:#eef6ff;
          padding:14px;
          border-radius:13px;
          text-align:center;
        ">
          <div style="font-size:25px">📋</div>
          <strong style="font-size:23px">
            ${myBookings.length}
          </strong>
          <div>Total Services</div>
        </div>


        <div style="
          background:#fff7e6;
          padding:14px;
          border-radius:13px;
          text-align:center;
        ">
          <div style="font-size:25px">⏳</div>
          <strong style="font-size:23px">
            ${pending}
          </strong>
          <div>Pending</div>
        </div>


        <div style="
          background:#eefaf4;
          padding:14px;
          border-radius:13px;
          text-align:center;
        ">
          <div style="font-size:25px">✅</div>
          <strong style="font-size:23px">
            ${completed}
          </strong>
          <div>Completed</div>
        </div>


        <div style="
          background:#f4efff;
          padding:14px;
          border-radius:13px;
          text-align:center;
        ">
          <div style="font-size:25px">📅</div>
          <strong style="font-size:23px">
            ${todayBookings.length}
          </strong>
          <div>Today's Services</div>
        </div>

      </div>


      <!-- TODAY'S SCHEDULE -->

      <h3 style="
        margin-top:22px;
        margin-bottom:5px;
      ">
        📅 Today's Schedule
      </h3>

      <p style="
        color:#667085;
        font-size:13px;
        margin-top:5px;
      ">
        आज की assigned services
      </p>

      ${todayHtml}


      <!-- ALL SERVICES -->

      <h3 style="
        margin-top:25px;
        margin-bottom:5px;
      ">
        📋 My Assigned Services
      </h3>

      ${allServicesHtml}


<!-- PAYMENT QR -->

${paymentQrHtml}


<!-- LOGOUT -->

<button
        onclick="nurseLogout()"
        style="
          width:100%;
          margin-top:20px;
          padding:13px;
          background:#fff;
          color:#d92d20;
          border:1px solid #f3b4ae;
          border-radius:10px;
          font-weight:bold;
        ">
        🚪 Nurse Logout
      </button>

    </div>

  `);
}
// =====================================================
// NURSE CHANGE STATUS
// =====================================================

async function nurseChangeStatus(bookingId, status) {

  if (!status) return;

  try {

    const index = bookings.findIndex(
      b => b.bookingId === bookingId
    );

    if (index !== -1) {

      bookings[index].status = status;

      localStorage.setItem(
        "sevaSathiBookings",
        JSON.stringify(bookings)
      );
    }

    // Firebase में Status Update
    await db.collection("bookings")
      .doc(bookingId)
      .update({
        status: status
      });

    if (status === "Completed") {

      alert(
        "✅ Service Completed!\n\n" +
        "अब Payment QR Nurse Panel में दिखाई देगा।"
      );

    } else {

      alert("✅ Service Status Updated");

    }

    openNurseDashboard();

  } catch (error) {

    console.error("Firebase Error:", error);

    alert(
      "❌ Service Status Firebase में update नहीं हुआ।"
    );

  }
}

// =====================================================
// NURSE BOOKING DETAILS
// =====================================================
// =====================================================
// NURSE MARK PAYMENT RECEIVED
// =====================================================

async function nurseMarkPaymentReceived(bookingId) {

  const confirmPayment =
    confirm(
      "क्या आपको payment प्राप्त हो गया है?\n\n" +
      "Booking ID: " + bookingId
    );

  if (!confirmPayment) return;

  try {

    const index = bookings.findIndex(
      b => b.bookingId === bookingId
    );

    // LocalStorage में भी update
    if (index !== -1) {

      bookings[index].paymentStatus = "Paid";

      localStorage.setItem(
        "sevaSathiBookings",
        JSON.stringify(bookings)
      );
    }

    // Firebase में Payment Status update
    await db.collection("bookings")
      .doc(bookingId)
      .update({
        paymentStatus: "Paid"
      });

    alert(
      "✅ Payment Marked as Paid!"
    );

    openNurseDashboard();

  } catch (error) {

    console.error(
      "Firebase Payment Error:",
      error
    );

    alert(
      "❌ Payment Status Firebase में update नहीं हुआ।"
    );

  }
}
function nurseViewBooking(bookingId) {

  const b = findBooking(bookingId);

  if (!b) {
    alert("❌ Booking नहीं मिली।");
    return;
  }

  openModal(`

    <h2>📋 Service Details</h2>

    <div style="
      background:#f8fbfd;
      padding:15px;
      border-radius:12px;
      margin-top:15px;
    ">

      <p>
        <strong>Booking ID:</strong>
        ${b.bookingId}
      </p>

      <p>
        <strong>Patient:</strong>
        ${b.patientName || "-"}
      </p>

      <p>
        <strong>Age:</strong>
        ${b.patientAge || "-"}
      </p>

      <p>
        <strong>Gender:</strong>
        ${b.patientGender || "-"}
      </p>

      <p>
        <strong>Patient Mobile:</strong>
        ${b.patientMobile || b.userMobile || "-"}
      </p>

      <p>
        <strong>Service:</strong>
        ${b.service || "-"}
      </p>

      <p>
        <strong>Date:</strong>
        ${b.bookingDate || "-"}
      </p>

      <p>
        <strong>Time:</strong>
        ${b.bookingTime || "-"}
      </p>

      <p>
        <strong>Duration:</strong>
        ${b.duration || "-"}
      </p>

      <p>
        <strong>Medical Condition:</strong>
        ${b.medicalCondition || "-"}
      </p>

      <p>
        <strong>Special Instructions:</strong>
        ${b.specialInstructions || "-"}
      </p>

      <p>
        <strong>Address:</strong><br>
        ${b.address?.house || ""},
        ${b.address?.area || ""},
        ${b.address?.city || ""},
        ${b.address?.district || ""},
        ${b.address?.state || ""},
        ${b.address?.pincode || ""}
      </p>

    </div>

  `);
}


// =====================================================
// NURSE MAP
// =====================================================

function nurseOpenMap(bookingId) {

  const b = findBooking(bookingId);

  if (!b) return;

  trackBooking(bookingId);
}


// =====================================================
// NURSE CALL
// =====================================================

function nurseCallPatient(number) {

  if (!number) {
    alert("❌ Patient mobile number उपलब्ध नहीं है।");
    return;
  }

  window.location.href =
    "tel:" + number;
}


// =====================================================
// NURSE WHATSAPP
// =====================================================

function nurseWhatsAppPatient(number) {

  if (!number) {
    alert("❌ Patient mobile number उपलब्ध नहीं है।");
    return;
  }

  window.open(
    "https://wa.me/" +
    number.replace(/\D/g, ""),
    "_blank"
  );
}


// =====================================================
// NURSE LOGOUT
// =====================================================

function nurseLogout() {

  currentNurse = null;

  localStorage.removeItem(
    "sevaSathiNurse"
  );

  alert("✅ Nurse Logout हो गया।");

  closeModal();
}
// =====================================================
// SCROLL ACTIVE NAV
// =====================================================

window.addEventListener("scroll", () => {

  const sections =
    document.querySelectorAll("section[id]");

  const links =
    document.querySelectorAll(".navbar a");

  let current = "";

  sections.forEach(section => {

    const top =
      section.offsetTop - 130;

    if (window.scrollY >= top) {
      current = section.id;
    }

  });

  links.forEach(link => {

    link.classList.remove("active");

    if (
      link.getAttribute("href") === "#" + current
    ) {
      link.classList.add("active");
    }

  });

});

// =====================================================
// DONE
// =====================================================

console.log("✅ Seva Sathi JavaScript Loaded Successfully");
// =====================================================
// SEVA SATHI - ADMIN LOGIN
// =====================================================

const ADMIN_USERNAME = "Praveen@2900";
const ADMIN_PASSWORD = "Praveen@9928";

function openAdminLogin() {

  openModal(`
    <h2>👑 Admin Login</h2>

    <input
      id="adminUsername"
      type="text"
      placeholder="Admin Username"
    >

    <input
      id="adminPassword"
      type="password"
      placeholder="Admin Password"
    >

    <button
      onclick="adminLogin()"
      style="width:100%;margin-top:15px;padding:14px;background:#7c3aed;color:white;border:0;border-radius:10px;font-weight:bold;"
    >
      👑 Login as Admin
    </button>
  `);
}

async function adminLogin() {

  const username =
    document.getElementById("adminUsername")?.value.trim();

  const password =
    document.getElementById("adminPassword")?.value;

  if (!username || !password) {
    alert("Username और Password दोनों भरें।");
    return;
  }

  // Firebase Admin Email
  const adminEmail = "bollaroshan@gmail.com";

  // Username वही रहेगा जो Admin Login में दिखता है
  if (username !== ADMIN_USERNAME) {
    alert("❌ गलत Admin Username");
    return;
  }

  try {

    // Firebase Authentication
    const result =
      await auth.signInWithEmailAndPassword(
        adminEmail,
        password
      );

    // Firebase login successful
    localStorage.setItem(
      "sevaSathiAdmin",
      "true"
    );

    localStorage.setItem(
      "sevaSathiAdminUID",
      result.user.uid
    );

    alert("✅ Admin Login Successful");

    closeModal();

    if (
      typeof openAdminDashboard === "function"
    ) {
      openAdminDashboard();
    } else {
      alert(
        "⚠️ Admin Dashboard का code अभी मौजूद नहीं है।"
      );
    }

  } catch (error) {

    console.error(
      "❌ Firebase Admin Login Error:",
      error.code,
      error.message
    );

    alert(
      "❌ Admin Login Failed\n\n" +
      "Username या Password गलत है।"
    );
  }
}
// =====================================================
// LOGIN + REGISTER = ONE BUTTON
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

  const loginBtn = document.querySelector(".login-btn");
  const registerBtn = document.querySelector(".register-btn");

  if (loginBtn) {
    loginBtn.textContent = "👤 Login / Register";
    loginBtn.onclick = function () {
      openPatientDashboard();
    };
  }

  if (registerBtn) {
    registerBtn.style.display = "none";
  }

});
// =====================================================
// HIDDEN ADMIN LOGIN
// Ctrl + Shift + A दबाने पर Admin Login खुलेगा
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

  const adminButtons = document.querySelectorAll(
    'button[onclick="openAdminLogin()"]'
  );

  adminButtons.forEach(btn => {
    btn.style.display = "none";
  });

});

document.addEventListener("keydown", function (e) {

  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {

    openAdminLogin();

  }

});
// =====================================================
// PATIENT BOOKING DETAILS
// =====================================================

function patientViewBooking(bookingId) {

  const b = bookings.find(
    booking => booking.bookingId === bookingId
  );

  if (!b) {
    alert("❌ Booking नहीं मिली।");
    return;
  }

  openModal(`
    <h2>📋 Booking Details</h2>

    <div style="
      background:#f8fbfd;
      padding:15px;
      border-radius:12px;
      margin-top:15px;
    ">

      <p><strong>Booking ID:</strong> ${b.bookingId}</p>

      <p><strong>Patient:</strong>
        ${b.patientName || "-"}</p>

      <p><strong>Service:</strong>
        ${b.service || "-"}</p>

      <p><strong>Date:</strong>
        ${b.bookingDate || "-"}</p>

      <p><strong>Time:</strong>
        ${b.bookingTime || "-"}</p>

      <p><strong>Duration:</strong>
        ${b.duration || "-"}</p>

      <p><strong>Status:</strong>
        ${b.status || "Pending"}</p>

      <p><strong>Payment:</strong>
        ${b.paymentStatus || "Pending"}</p>

      <p><strong>Assigned Nurse:</strong>
        ${b.assignedNurse || "Not Assigned"}</p>

      <p><strong>Medical Condition:</strong>
        ${b.medicalCondition || "-"}</p>

      <p><strong>Special Instructions:</strong>
        ${b.specialInstructions || "-"}</p>

      <p><strong>Address:</strong><br>
        ${b.address?.house || ""},
        ${b.address?.area || ""},
        ${b.address?.city || ""},
        ${b.address?.district || ""},
        ${b.address?.state || ""},
        ${b.address?.pincode || ""}
      </p>

    </div>
  `);
}
// =====================================================
// MOBILE SECRET ADMIN PIN
// =====================================================

let adminPinAttempts = 0;
let adminPinLockedUntil = 0;

function openSecretAdmin() {

  // Check lock
  if (Date.now() < adminPinLockedUntil) {

    const remaining =
      Math.ceil(
        (adminPinLockedUntil - Date.now()) / 60000
      );

    alert(
      "🔒 Admin access temporarily locked.\n\n" +
      "बाद में फिर कोशिश करें।\n" +
      "लगभग " + remaining + " मिनट बाकी हैं।"
    );

    return;
  }

  const pin = prompt("🔐 Secret Admin PIN डालें:");

  // Cancel
  if (pin === null) {
    return;
  }

  // Correct PIN
  if (pin === "884930") {

    adminPinAttempts = 0;

    openAdminLogin();

    return;
  }

  // Wrong PIN
  adminPinAttempts++;

  const remainingAttempts =
    3 - adminPinAttempts;

  if (adminPinAttempts >= 3) {

    adminPinLockedUntil =
      Date.now() + (15 * 60 * 1000);

    adminPinAttempts = 0;

    alert(
      "🔒 3 बार गलत PIN डालने के कारण\n" +
      "Admin access 15 मिनट के लिए लॉक कर दिया गया है।"
    );

    return;
  }

  alert(
    "❌ गलत PIN\n\n" +
    "बाकी attempts: " +
    remainingAttempts
  );
}
// =====================================================
// SECRET ADMIN - 5 TAP
// =====================================================

let secretAdminTapCount = 0;
let secretAdminTapTimer = null;

function secretAdminTap(event) {

  // Logo का normal Home link रोकें
  event.preventDefault();

  secretAdminTapCount++;

  clearTimeout(secretAdminTapTimer);

  secretAdminTapTimer = setTimeout(() => {
    secretAdminTapCount = 0;
  }, 1500);

  if (secretAdminTapCount >= 5) {

    secretAdminTapCount = 0;

    openSecretAdmin();
  }
}
// =====================================================
// FIREBASE AUTH TEST
// =====================================================

async function testFirebaseAuth() {

  try {

    const userCredential =
      await auth.createUserWithEmailAndPassword(
        "test@sevasathi.com",
        "Test@12345"
      );

    console.log(
      "✅ Firebase Auth User Created:",
      userCredential.user.uid
    );

    alert("✅ Firebase Authentication Working!");

  } catch (error) {

    console.error("Firebase Auth Error:", error);

    alert(
      "❌ Firebase Auth Error:\n\n" +
      error.message
    );
  }
}
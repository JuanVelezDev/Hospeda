document.addEventListener("DOMContentLoaded", async () => {
    const apartmentId = localStorage.getItem("apartmentId");
    if (!apartmentId) return window.location.href = "../student-serch/student.html";

    try {
        const aptRes = await fetch(`http://localhost:3000/apartment`);
        const apartments = await aptRes.json();
        const apartment = apartments.find(a => a.apartment_id == apartmentId);

        const photoRes = await fetch(`http://localhost:3000/apartment/${apartmentId}/photos`);
        const photos = photoRes.ok ? await photoRes.json() : [];

        document.querySelector(".title").textContent = apartment.title;
        document.querySelector(".price").textContent = `$${apartment.price}/month`;
        document.querySelector(".address").innerHTML = `<i class="fa-solid fa-location-dot"></i> ${apartment.address}, ${apartment.city}`;
        document.querySelector(".description").innerHTML = `<p>${apartment.description}</p>`;

        const heroImg = document.querySelector(".hero img");
        heroImg.src = photos.length > 0 ? photos[0].photo_url : "https://via.placeholder.com/800x500?text=No+Photo";
    } catch (err) { console.error(err); }
});

document.getElementById("reserveBtn").addEventListener("click", async () => {
    const apartmentId = localStorage.getItem("apartmentId");
    const user = JSON.parse(localStorage.getItem("user"));
    const startDate = document.getElementById("checkIn").value;
    const endDate = document.getElementById("checkOut").value;

    if (!user) return alert("Debes iniciar sesión");
    if (!startDate || !endDate) return alert("Selecciona fechas");

    try {
        const res = await fetch("http://localhost:3000/booking", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: user.id, apartment_id: apartmentId, start_date: startDate, end_date: endDate })
        });
        const data = await res.json();
        if (res.ok) alert("✅ Reserva creada. El propietario debe confirmar");
        else alert("❌ " + data.error);
    } catch (err) { console.error(err); }
});

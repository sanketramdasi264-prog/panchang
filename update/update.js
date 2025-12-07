const fs = require("fs");

// Mumbai location
const latitude = 19.0760;
const longitude = 72.8777;
const timezone = 5.5;

const API_KEY = "Qt8dyDA5jz709uhbe8F1y1fykUIVbqEl99tGH4T6";

const filePath = "./panchang.json";


// Today's date
const today = new Date();
const yyyy = today.getFullYear();
const mm = today.getMonth() + 1;
const dd = today.getDate();

async function fetchPanchang() {
    const url = "https://json.freeastrologyapi.com/v1/panchang";

    const body = {
        year: yyyy,
        month: mm,
        date: dd,
        hours: 6,
        minutes: 0,
        seconds: 0,
        latitude,
        longitude,
        timezone,
        observation_point: "topocentric"
    };

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY
        },
        body: JSON.stringify(body)
    });

    return await res.json();
}

function transform(api) {
    return {
        tithi: api?.tithi?.name || "",
        tithi_end: api?.tithi?.end_time || "",
        tithi_next: api?.tithi?.next || "",

        nakshatra: api?.nakshatra?.name || "",
        nakshatra_end: api?.nakshatra?.end_time || "",
        nakshatra_next: api?.nakshatra?.next || "",

        yog: api?.yog?.name || "",
        yog_time: api?.yog?.end_time || "",

        karan: api?.karan?.name || "",
        karan_end: api?.karan?.end_time || "",
        karan_next: api?.karan?.next || "",

        sunrise: api?.sunrise || "",
        sunset: api?.sunset || "",
        moonrise: api?.moonrise || "",
        rahukaal: api?.rahukaal || "",

        moon_rashi: api?.moon_rashi || "",
        sun_rashi: api?.sun_rashi || "",

        din_vishesh: ""
    };
}

async function updateJSON() {
    const api = await fetchPanchang();

    const formattedDate = `${yyyy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;

    let existing = {};
    if (fs.existsSync(filePath)) {
        existing = JSON.parse(fs.readFileSync(filePath, "utf8"));
    }

    existing[formattedDate] = transform(api);

    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), "utf8");

    console.log("Panchang updated for:", formattedDate);
}

updateJSON();

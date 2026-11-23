/*
=============================================
file: dht_sensor.h

File ini berisi definisi modul sensor DHT11. File .ino hanya akan memanggil:
    initDHT();
    readDHT(currentTemperature, currentHumidity);

File .h mirip daftar modul/cetak biru yang menyediakan fungsi kepada .ino.
Ini bukan implementasi otomatis dari nama class HTML/CSS, melainkan pembagian 
kode menjadi bagian-bagian yang dapat dicari dan dipakai ulang.
==============================================
*/

// INCLUDE GUARD / Pengaman Duplikat 
#ifndef CONTOH_DHT_SENSOR_H
#define CONTOH_DHT_SENSOR_H

#include <DHT.h>
#include "config.h"

static DHT sensorExample(DHT_PIN, DHT_TYPE); // Buat objek sensor DHT

/*
initDHT()
Dipanggil dari setup() pada file .ino.
Ini mengaktifkan komunikasi sensor pada pin yang telah ditentukan di config.h.
*/
inline void initDHT() {
    sensorExample.begin();

    /* ==================== KODINGAN ASLI ESP32 (VIDEO GURU) ====================
    // Serial.println("[dht_sensor.h] Sensor DHT11 dimulai pada GPIO " + String(DHT_PIN));
    ========================================================================== */

    // Tampilan khusus ESP8266
    Serial.println("[dht_sensor.h] Sensor DHT11 dimulai pada Pin ESP8266: D4 (GPIO2)");
}

/*
readDHT()
Ini adalah satu-satunya tempat fungsi readDHT() dibuat pada contoh ini.
Tempat panggilan tidak menentukan tempat pembuatannya.

.ino: if (readDHT(...)) { ... }
.h ini: inline bool readDHT(float &temperature, float &humidity) { ... }

inline digunakan supaya definisi header mudah dipakai tanpa membuat file .cpp
terpisah dalam proyek dasar ini. Fungsi header dianggap sebagai modul ringkas.

Parameter float &temp dan float &hum memakai referensi (&) karena itu fungsi 
dapat menuliskan hasil pembacaan kembali ke variabel milik file .ino.
*/
inline bool readDHT(float &temp, float &hum) {
   float temperature = sensorExample.readTemperature();
   float humidity = sensorExample.readHumidity();

   if (isnan(temperature) || isnan(humidity)) {
        Serial.println("[dht_sensor.h] Gagal membaca sensor DHT11!");
        return false; // Kembalikan false jika pembacaan gagal
    } 

    temp = temperature;
    hum = humidity;
    return true;
}

#endif // CONTOH_DHT_SENSOR_H
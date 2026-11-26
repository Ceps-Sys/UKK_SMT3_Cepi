#ifndef DHT_SENSOR_H
#define DHT_SENSOR_H

#include "config.h"
#include <DHT.h>

// Membuat objek sensor DHT sesuai pin dan tipe (DHT11) dari config.h
static DHT dht(DHTPIN, DHT_TYPE);

// Menginisialisasi komunikasi dengan sensor DHT11
inline void initDHT() {
  dht.begin();
  Serial.println(F("[INFO] Driver Sensor DHT11 berhasil diinisialisasi."));
}

// Membaca suhu (°C) dan kelembapan (%) dengan filter data tidak valid/glitch
inline bool readDHT(float &temp, float &hum) {
  float t = dht.readTemperature();
  float h = dht.readHumidity();

  // Cek apakah hasil pembacaan bukan angka (NaN) karena kabel longgar/sensor gagal respon
  if (isnan(t) || isnan(h)) {
    Serial.println(F("[ERR] Sensor membaca NaN!"));
    return false;
  }

  // Filter nilai ekstrem/noise di luar rentang wajar ruangan
  if (t < 0.0 || t > 50.0 || h < 10.0 || h > 99.0) {
    Serial.println(F("[WARN] Sinyal data corrupt! Nilai dibuang."));
    return false;
  }

  // Simpan nilai valid ke variabel referensi pemanggil
  temp = t;
  hum = h;
  return true;
}

#endif // DHT_SENSOR_H
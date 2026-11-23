#ifndef DHT_SENSOR_H
#define DHT_SENSOR_H

#include "config.h"
#include <DHT.h>

static DHT dht(DHTPIN, DHT_TYPE);

inline void initSensor() {
  dht.begin();
  Serial.println(F("[INFO] Driver Sensor DHT11 berhasil diinisialisasi."));
}

inline bool readDHTData(float &temp, float &hum) {
  float t = dht.readTemperature();
  float h = dht.readHumidity();

  if (isnan(t) || isnan(h)) {
    Serial.println(F("[ERR] Sensor membaca NaN!"));
    return false;
  }

  // Filter nilai corrupt/glitch
  if (t < 0.0 || t > 50.0 || h < 10.0 || h > 99.0) {
    Serial.println(F("[WARN] Sinyal data corrupt! Nilai dibuang."));
    return false;
  }

  temp = t;
  hum = h;
  return true;
}

#endif // DHT_SENSOR_H
#include "config.h"
#include "dht_sensor.h"
#include "oled_display.h"
#include "wifi_manager.h"
#include "async_server.h"

// Variabel global untuk menyimpan pembacaan suhu, kelembapan, dan waktu boot
float currentTemp = 0.0;
float currentHum = 0.0;
unsigned long bootMillis = 0;
static unsigned long lastSensorMillis = 0;

void setup() {
  // Inisialisasi komunikasi serial untuk debugging
  Serial.begin(SERIAL_BAUD);
  delay(1000);
  bootMillis = millis();

  Serial.println();
  Serial.println(F("========================================"));
  Serial.println(F("  Proyek 4: DHT11 dengan Layar TFT 1.77  "));
  Serial.println(F("========================================"));

  // Inisialisasi layar TFT ST7735 dan tampilkan status koneksi awal
  initDisplay();
  showConnectingWiFi(DEFAULT_WIFI_SSID);

  // Inisialisasi sensor DHT11 dan file system LittleFS
  initDHT();
  initLittleFS();

  // Hubungkan ESP8266 ke Wi-Fi dan jalankan web server jika berhasil
  bool connected = connectToWifi(DEFAULT_WIFI_SSID, DEFAULT_WIFI_PASS);
  if (connected) {
    initAsyncWebServer();
  }

  // Pembacaan awal sensor & render tampilan pertama di layar TFT
  if (readDHT(currentTemp, currentHum)) {
    drawDashboardOled(currentTemp, currentHum, wifiConnected, localIPAddress);
  } else {
    drawDataError();
  }
}

void loop() {
  unsigned long now = millis();

  // Pembacaan sensor berkala non-blocking sesuai SENSOR_READ_INTERVAL
  if (now - lastSensorMillis >= SENSOR_READ_INTERVAL) {
    lastSensorMillis = now;

    if (readDHT(currentTemp, currentHum)) {
      Serial.print(F("[ASYNC NODE] Suhu: "));
      Serial.print(currentTemp, 1);
      Serial.print(F(" C | Hum: "));
      Serial.print(currentHum, 1);
      Serial.println(F("%"));

      drawDashboardOled(currentTemp, currentHum, wifiConnected, localIPAddress);
    } else {
      drawDataError();
    }
  }
}

/* =========================================================================
   KODE ASLI KAPRODI (ESP32 + OLED) - DIJADIKAN KOMENTAR SEBAGAI ARSIP
   =========================================================================
#include "config.h"
#include "dht_sensor.h"
#include "oled_display.h"
#include "wifi_manager.h"
#include "async_server.h"

float currentTemp = 0.0;
float currentHum = 0.0;
unsigned long bootMillis = 0;
static unsigned long lastSensormillis = 0;

void setup() {
    Serial.begin(SERIAL_BAUD);
    delay(1000);
    bootMillis = millis();

    Serial.println();
    Serial.println("========================================");
    Serial.println("    Proyek 4 DHT 11 dengan layar TFT    ");
    Serial.println("========================================");

    initDisplay()
    showConnectingWiFi(WIFI_SSID);

    initDHT();

    initLittleFS();

    bool connected = connectToWifi();

    if (connented) {
        initAsyncWebServer();
    }

    readDHT(currentTemp, currentHum);
    drawDashbordOled(currentTemp, currentHum, connected, localIPAddress);
}

void loop() {
    unsigned long now = millis();

    if (now - lastSensorMillis >= SENSOR_READ_INTERVAL) {
        lastSensorMillis = now;

        if (readDHT(currentTemp, currentHum)) {
            Serial.print("[ASYNC NODE] suhu: ");
            Serial.print(currentTemp, 1);
            Serial.print("[ASYNC NODE] Hum: ");
            Serial.print(currentHum, 1);
            Serial.print("%");

            drawDashboardOled(currentTemp, currentHum, wifiConnected, localIPAddress);

        }
    }
}
   ========================================================================= */
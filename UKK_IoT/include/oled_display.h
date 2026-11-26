#ifndef OLED_DISPLAY_H
#define OLED_DISPLAY_H

#include "config.h"
#include <Adafruit_GFX.h>
#include <Adafruit_ST7735.h>
#include <SPI.h>

// Objek layar TFT ST7735 menggunakan pin CS, DC, dan RST
static Adafruit_ST7735 tft = Adafruit_ST7735(TFT_CS, TFT_DC, TFT_RST);
static bool isDisplayAvailable = false;

// Menginisialisasi layar TFT ST7735 dan mengaturnya ke mode landscape
inline bool initDisplay() {
  tft.initR(INITR_BLACKTAB);
  tft.setRotation(1); // Mode landscape (160x128)
  tft.fillScreen(ST7735_BLACK);

  isDisplayAvailable = true;
  Serial.println(F("[INFO] Layar TFT 1.77 ST7735 berhasil diinisialisasi."));
  return true;
}

// Menampilkan status proses koneksi Wi-Fi di layar TFT
inline void showConnectingWiFi(const String &ssid) {
  if (!isDisplayAvailable) return;

  tft.fillScreen(ST7735_BLACK);
  tft.drawRect(2, 2, tft.width() - 4, tft.height() - 4, ST7735_CYAN);

  tft.setTextColor(ST7735_YELLOW, ST7735_BLACK);
  tft.setTextSize(1);
  tft.setCursor(12, 24);
  tft.print(F("MENGHUBUNGKAN WIFI..."));

  tft.setTextColor(ST7735_WHITE, ST7735_BLACK);
  tft.setCursor(12, 46);
  tft.print(F("SSID: "));
  tft.println(ssid);

  tft.setTextColor(ST7735_CYAN, ST7735_BLACK);
  tft.setCursor(12, 72);
  tft.print(F("Mohon tunggu..."));
}

// Menggambar dashboard utama suhu, kelembapan, status Wi-Fi, dan alamat IP di TFT
inline void drawDashboardOled(float temp, float hum, bool connected, const String &ipAddr) {
  if (!isDisplayAvailable) return;

  tft.fillScreen(ST7735_BLACK);

  // Header bar bagian atas
  tft.fillRect(0, 0, tft.width(), 18, connected ? ST7735_BLUE : ST7735_RED);
  tft.setTextSize(1);
  tft.setTextColor(ST7735_WHITE, connected ? ST7735_BLUE : ST7735_RED);
  tft.setCursor(6, 5);
  tft.print(F("ESP8266 DHT11 | "));
  tft.print(connected ? F("ONLINE") : F("OFFLINE"));

  // Blok tampilan Suhu (°C) di sisi kiri
  tft.setTextColor(ST7735_YELLOW, ST7735_BLACK);
  tft.setTextSize(1);
  tft.setCursor(6, 26);
  tft.print(F("SUHU (C):"));

  tft.setTextSize(2);
  tft.setCursor(6, 40);
  tft.print(temp, 1);

  // Garis pemisah vertikal antar kolom Suhu dan Kelembapan
  tft.drawFastVLine(78, 24, 40, ST7735_WHITE);

  // Blok tampilan Kelembapan (%) di sisi kanan
  tft.setTextSize(1);
  tft.setTextColor(ST7735_CYAN, ST7735_BLACK);
  tft.setCursor(86, 26);
  tft.print(F("HUM (%):"));

  tft.setTextSize(2);
  tft.setCursor(86, 40);
  tft.print(hum, 1);

  // Garis pemisah horizontal & informasi IP / status lingkungan di bagian bawah
  tft.drawFastHLine(0, 72, tft.width(), ST7735_WHITE);
  tft.setTextSize(1);
  tft.setCursor(6, 80);

  if (temp >= 35.0 || hum >= 80.0) {
    tft.setTextColor(ST7735_RED, ST7735_BLACK);
    tft.print(F("STATUS: PANAS/LEMBAP"));
  } else if (temp <= 18.0 || hum <= 30.0) {
    tft.setTextColor(ST7735_BLUE, ST7735_BLACK);
    tft.print(F("STATUS: DINGIN/KERING"));
  } else {
    tft.setTextColor(ST7735_GREEN, ST7735_BLACK);
    tft.print(F("STATUS: NORMAL"));
  }

  tft.setTextColor(ST7735_WHITE, ST7735_BLACK);
  tft.setCursor(6, 98);
  tft.print(F("IP: "));
  tft.print(ipAddr);
}

// Menampilkan pesan error jika pembacaan sensor gagal
inline void drawDataError() {
  if (!isDisplayAvailable) return;

  tft.fillScreen(ST7735_RED);
  tft.setTextSize(1);
  tft.setTextColor(ST7735_WHITE, ST7735_RED);
  tft.setCursor(12, 42);
  tft.println(F("Gagal Membaca DHT11!"));
  tft.setCursor(12, 62);
  tft.println(F("Periksa kabel D1 (GPIO5)."));
}

/* =========================================================================
   KODE ASLI KAPRODI (ESP32 + OLED) - DIJADIKAN KOMENTAR SEBAGAI ARSIP
   =========================================================================
#ifndef OLED_DISPLAY_H
#define OLED_DISPLAY_H

#include "config.h"
#include <Adafruit_GFX.h>
#include <Adafruit_ST7735.h>
#include <SPI.h>

static Adafruit_ST7735 tft = Adafruit_ST7735(TFT_CS, TFT_DC, TFT_RST);
static bool isDisplayAvailable = false;

inline bool initDisplay() {
  tft.initR(INITR_BLACKTAB);
  tft.setRotation(1); // Modus Landscape
  tft.fillScreen(ST7735_BLACK);

  isDisplayAvailable = true;
  Serial.println(F("[INFO] Layar TFT 1.77 ST7735 berhasil diinisialisasi."));
  return true;
}

inline void drawSplashScreen() {
  if (!isDisplayAvailable) return;

  tft.fillScreen(ST7735_BLACK);
  tft.drawRect(2, 2, tft.width() - 4, tft.height() - 4, ST7735_CYAN);

  tft.setTextColor(ST7735_YELLOW);
  tft.setTextSize(1);
  tft.setCursor(15, 20);
  tft.print(F("MONITORING SUHU"));

  tft.setTextColor(ST7735_WHITE);
  tft.setCursor(15, 35);
  tft.print(F("& KELEMBABAN"));

  tft.setTextColor(ST7735_GREEN);
  tft.setTextSize(2);
  tft.setCursor(20, 60);
  tft.print(F("[ WELL AH ]"));

  delay(2500);
}

inline void drawDashboardViewer(float temp, float hum, unsigned long packetCount) {
  if (!isDisplayAvailable) return;

  tft.fillScreen(ST7735_BLACK);

  // Header Bar Top
  tft.fillRect(0, 0, tft.width(), 18, ST7735_BLUE);
  tft.setTextSize(1);
  tft.setTextColor(ST7735_WHITE, ST7735_BLUE);
  tft.setCursor(6, 5);
  tft.print(F("MONITOR DHT11 #"));
  tft.print(packetCount);

  // Area Temp
  tft.setTextColor(ST7735_YELLOW, ST7735_BLACK);
  tft.setTextSize(1);
  tft.setCursor(6, 26);
  tft.print(F("SUHU (C):"));

  tft.setTextSize(2);
  tft.setCursor(6, 40);
  tft.print(temp, 1);

  // Garis Pembagi Vertikal
  tft.drawFastVLine(70, 24, 40, ST7735_WHITE);

  // Area Hum
  tft.setTextSize(1);
  tft.setTextColor(ST7735_CYAN, ST7735_BLACK);
  tft.setCursor(76, 26);
  tft.print(F("HUM (%):"));

  tft.setTextSize(2);
  tft.setCursor(76, 40);
  tft.print(hum, 1);

  // Bar Status Bawah
  tft.drawFastHLine(0, 75, tft.width(), ST7735_WHITE);
  tft.setTextSize(1);
  tft.setCursor(6, 85);

  if (temp >= 35.0 || hum >= 80.0) {
    tft.setTextColor(ST7735_RED, ST7735_BLACK);
    tft.print(F("STATUS: PANAS"));
  } else if (temp <= 18.0 || hum <= 30.0) {
    tft.setTextColor(ST7735_BLUE, ST7735_BLACK);
    tft.print(F("STATUS: DINGIN"));
  } else {
    tft.setTextColor(ST7735_GREEN, ST7735_BLACK);
    tft.print(F("STATUS: NORMAL"));
  }
}

inline void drawDataError() {
  if (!isDisplayAvailable) return;

  tft.fillScreen(ST7735_RED);
  tft.setTextSize(1);
  tft.setTextColor(ST7735_WHITE);
  tft.setCursor(15, 40);
  tft.println(F("Gagal Membaca Sensor!"));
  tft.setCursor(15, 60);
  tft.println(F("Periksa Kabel D1 DHT11."));
}

#endif // OLED_DISPLAY_H
   ========================================================================= */

#endif // OLED_DISPLAY_H
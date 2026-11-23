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
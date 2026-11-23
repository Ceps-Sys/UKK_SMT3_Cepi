#ifndef CONFIG_H
#define CONFIG_H

#include <Arduino.h>

#define SERIAL_BAUD 115200

// Sensor DHT11 menggunakan GPIO 5 (Label D1 pada Shield NodeMCU)
#define DHTPIN          5 
#define DHT_TYPE    DHT11 

// Konfigurasi Pin TFT 1.77 inch ST7735 (SPI)
#define TFT_CS         0  // Pin CS (Pin 7 TFT)  -> GPIO 0 (D3)
#define TFT_RST        2  // Pin RES (Pin 5 TFT) -> GPIO 2 (D4)
#define TFT_DC         4  // Pin RS (Pin 6 TFT)  -> GPIO 4 (D2)

#define TFT_WIDTH    128 
#define TFT_HEIGHT   160  

// Konfigurasi Sistem
#define READ_INTERVAL_MILLIS 2000 

#endif // CONFIG_H
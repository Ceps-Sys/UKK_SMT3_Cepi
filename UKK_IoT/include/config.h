#ifndef CONFIG_H
#define CONFIG_H

#include <Arduino.h>

// Kecepatan komunikasi Serial Monitor (UART)
#define SERIAL_BAUD 115200

// Konfigurasi default Wi-Fi awal (bisa diganti lewat Web Dashboard & disimpan ke LittleFS)
#define DEFAULT_WIFI_SSID "Punya uwit"
#define DEFAULT_WIFI_PASS "Witriwitri30"

// Sensor DHT11 pada GPIO 5 (label D1 pada shield/board NodeMCU ESP8266)
#define DHTPIN       5
#define DHT_TYPE     DHT11

// Konfigurasi pin layar TFT 1.77 inch ST7735 (SPI) untuk ESP8266
// Catatan: pastikan tidak bentrok dengan pin boot/flash saat upload firmware
#define TFT_CS       0   // Pin CS  (TFT Pin 7) -> GPIO 0 (D3)
#define TFT_RST      2   // Pin RES (TFT Pin 5) -> GPIO 2 (D4)
#define TFT_DC       4   // Pin RS/DC (TFT Pin 6) -> GPIO 4 (D2)

// Resolusi layar TFT ST7735 (dalam mode landscape setRotation(1): lebar 160, tinggi 128)
#define TFT_WIDTH    128
#define TFT_HEIGHT   160

// Interval pembacaan sensor DHT11 dalam milidetik (2000 ms = 2 detik)
#define SENSOR_READ_INTERVAL 2000

#endif // CONFIG_H
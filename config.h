/*
========================================================================
file: config.h

Konfigurasi harus diputuskan di sini. Jika ingin memindahkan sensor 
ke pin lain, ubah DHT_PIN saja; file .ino tidak perlu mengulang 
perubahan pada setiap fungsi.
========================================================================
*/

// INCLUDE GUARD: Cegah isi file ini dibaca ulang oleh compiler dengan nama sama
#ifndef CONTOH_CONFIG_H
#define CONTOH_CONFIG_H

#include <Arduino.h>

// ==================== KODINGAN ASLI ESP32 (VIDEO GURU) ====================
// Pada ESP32, GPIO 4 biasa digunakan langsung sebagai pin data DHT
// #define DHT_PIN 4
// ==========================================================================

// ==================== KODINGAN DUKUNGAN ESP8266 (NodeMCU ESP-12E) ====================
// Pada NodeMCU ESP8266, pin D4 terhubung ke GPIO2 secara internal.
#define DHT_PIN D4

#define DHT_TYPE DHT11 // Tipe sensor DHT yang digunakan (DHT11, DHT22, dsb)
#define SERIAL_BAUD 115200 // Baud rate untuk komunikasi serial
#define SENSOR_READ_INTERVAL 2000 // Interval pembacaan sensor dalam milidetik

#endif // CONTOH_CONFIG_H
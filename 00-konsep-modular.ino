/*
=========================================================
FOLDER PEMBELAJARAN KONSEP MODULAR C++/ ARDUINO
FILE: 00-KONSEP-MODULAR.INO

FILE INI ADALAH FILE PENGENDALI UTAMA. File .ino boleh dipakai sebagai 
panduan alur program: setup() menyiapkan perangkat dan loop() menjalankan 
perintah utama. File ini juga dapat digunakan sebagai file pengendali utama 
untuk mengatur alur program dan memanggil fungsi-fungsi dari file header 
dan file sumber lainnya.

PERBANDINGAN DENGAN HTML + CSS:
CLASS PADA HTML ADALAH NAMA ELEMENT, SEDANGKAN CSS MENENTUKAN GAYA.
DI ARDUINO, NAMA FUNGSI PADA FILE .ino JUGA ADALAH NAMA PANGGILAN.
DEFINISI FUNGSI DICARI PADA FILE HEADER .H YANG DIPANGGIL MELALUI #INCLUDE. 
IMPLEMENTASI FUNGSI DICARI PADA FILE .CPP YANG DIPANGGIL MELALUI #INCLUDE JUGA.

CONTOH YANG SERING TIMBUL:
FILE INI MEMAKAI: readDHT(currentTemperature, currentHumidity)
NAMA readDHT BERASAL DARI FUNGSI YANG DIDEFINISIKAN DALAM dht_sensor.h 
JADI URUTANNYA:
1. .ino MENYERTAKAN HEADER: #include "dht_sensor.h"
2. dht_sensor.h BERISI DEKLARASI/DEFINISI: inline bool readDHT(...)
3. .ino MEMANGGIL FUNGSI readDHT(...) UNTUK MENDAPATKAN NILAI TEMPERATUR DAN HUMIDITY
4. COMPILER MEMBACA KEMBALI KODE FUNGSI TERSEBUT LALU MENGGABUNGKANNYA MENJADI SATU PROGRAM ESP32 / ESP8266

ANALOGI CSS: <div class="temperature-card">
            BAGIAN HTML MEMBERI NAMA
            .temperature-card {...}
            BAGIAN CSS MENCARI NAMA ITU DAN MEMBERI TAMPILAN

PADA ARDUINO, MODUL SENSOR BEKERJA SEPERTI INI:
#include "dht_sensor.h"     -> MEMBUKA DAFTAR MODUL SENSOR
readDHT(...)                -> MEMANGGIL DARI MODUL
"inline bool readDHT(...)"  -> MENCARI KODE FUNGSI YANG DITUJU
========================================================= */

// Sertakan konfigurasi modul yang dipakai
#include "config.h"
#include "dht_sensor.h"

// Variabel milik file utama. Nilai dibaca oleh modul lalu disimpan di sini
float currentTemperature = 0.0;
float currentHumidity = 0.0;
unsigned long lastReadMillis = 0; // Variabel untuk menyimpan waktu terakhir pembacaan sensor
unsigned long readCount = 0;      // Variabel untuk menghitung jumlah pembacaan sensor

void setup () {
    /* ==================== KODINGAN ASLI ESP32 (VIDEO GURU) ====================
    // Serial.begin(SERIAL_BAUD);
    ========================================================================== */

    // Baudrate Serial Monitor (115200) untuk ESP8266 / NodeMCU ESP-12E
    Serial.begin(SERIAL_BAUD);
    delay(500);

    Serial.println("=========================================================");
    Serial.println("BELAJAR KONSEP MODULAR ESP32/ESP8266 + HEADER.h");
    Serial.println("=========================================================");
    Serial.println("config.h          : sumber pin dan interval");
    Serial.println("dht_sensor.h      : tempat fungsi readDHT() dibuat");
    Serial.println("file .ino         : tempat fungsi setup() dan loop() mengatur alur program");

    // Fungsi ini berasal dari dht_sensor.h, dipanggil dari setup() untuk mengaktifkan sensor DHT
    // Fungsi ini dipanggil sekali karena berada dalam void setup()
    initDHT(); // Panggil fungsi inisialisasi sensor DHT
}

void loop () {
  unsigned long nowMillis = millis(); // Ambil waktu saat ini dalam milidetik

  if (nowMillis - lastReadMillis >= SENSOR_READ_INTERVAL) { // Cek apakah sudah waktunya membaca sensor
    lastReadMillis = nowMillis; // Update waktu terakhir pembacaan sensor
    readCount++;                // Tambahkan jumlah pembacaan sensor

    /*
    Fungsi dipanggil di sini.
    readDHT adalah nama fungsi yang didefinisikan pada dht_sensor.h 
    dan variabel diteruskan dengan tanda & sehingga dht_sensor.h dapat 
    mengubah nilai currentTemperature dan currentHumidity secara langsung.

    Setelah return true:
    currentTemperature berisi nilai celsius dari sensor DHT11
    currentHumidity berisi nilai kelembapan dari sensor DHT11
    */

    if(readDHT(currentTemperature, currentHumidity)) { // Panggil fungsi readDHT() dari dht_sensor.h
        Serial.println("[loop] Pembacaan sensor DHT11 berhasil!");
        Serial.println("[loop] Total Pembacaan: " + String(readCount));
        Serial.println("[loop] Temperatur: " + String(currentTemperature) + " °C");
        Serial.println("[loop] Humidity: " + String(currentHumidity) + " %");
    } else {
        Serial.println("[loop] Gagal membaca sensor DHT11!");
    }
  }
}
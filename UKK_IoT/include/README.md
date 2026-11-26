# Proyek 4: DHT11 Async Web Dashboard (ESP8266 + TFT ST7735)

**Penempatan Pin ESP8266**

* **DHT11:** Pin **VCC** ke **3V3**, pin **GND** ke **GND**, dan pin **DATA** ke **D1 (GPIO 5)**.
* **TFT 1.77" ST7735 (SPI):** Pin **VCC/LED** ke **3V3**, **GND** ke **GND**, **SCK/SCL** ke **D5 (GPIO 14)**, **SDA/MOSI** ke **D7 (GPIO 13)**, **CS** ke **D3 (GPIO 0)**, **DC/RS** ke **D2 (GPIO 4)**, dan **RST/RES** ke **D4 (GPIO 2)**.
* **Catatan Pin Boot:** Pin **D3 (GPIO 0)** dan **D4 (GPIO 2)** dipakai sebagai pin boot ESP8266, jadi pastikan tidak ditarik ke posisi LOW saat upload firmware berlangsung[cite: 3, 5].

**Struktur File dan Keterangan**

File **`include/config.h`** menyimpan konfigurasi awal kredensial Wi-Fi, definisi pin DHT11 dan TFT, resolusi layar, serta interval waktu pembacaan sensor. File **`include/dht_sensor.h`** menangani inisialisasi dan pembacaan suhu maupun kelembapan dari DHT11 sekaligus menyaring nilai error atau glitch. File **`include/oled_display.h`** mengatur tampilan antarmuka pada layar TFT ST7735 serta menyimpan arsip kode asli ESP32 dan OLED dalam bentuk komentar. File **`include/wifi_manager.h`** mengelola proses koneksi ESP8266 ke jaringan Wi-Fi dan mencatat status beserta alamat IP lokal. File **`include/async_server.h`** menjalankan web server asynchronous dan LittleFS untuk menyajikan halaman web serta menyediakan endpoint API pembacaan sensor real-time, pemindaian SSID terdekat, dan penghubungan Wi-Fi baru. File **`src/main.cpp`** mengatur alur utama program mulai dari inisialisasi perangkat keras hingga pembaruan data sensor secara berkala. Terakhir, file **`data/index.html`** merupakan antarmuka web dashboard dark mode untuk memantau suhu, kelembapan, status perangkat, serta mengatur koneksi Wi-Fi secara langsung dari browser[cite: 1, 2, 3, 4, 5, 6, 7].
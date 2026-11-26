// Proyek 4: DHT11 Async Web Dashboard dengan LittleFS & REST API
// Deskripsi: Modul ini menggunakan ESPAsyncWebServer dan LittleFS untuk menyajikan
// file static HTML/CSS/JS dari flash memory ESP8266 serta menyediakan endpoint JSON:
// - GET  /api/now          -> data suhu, kelembapan, status Wi-Fi, SSID, RSSI, IP, uptime
// - GET  /api/wifi/scan    -> memindai daftar SSID Wi-Fi di sekitar
// - POST /api/wifi/connect -> menghubungkan ESP8266 ke SSID & password yang dipilih di web

#ifndef ASYNC_SERVER_H
#define ASYNC_SERVER_H

#include <LittleFS.h>
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>
#include "config.h"
#include "wifi_manager.h"

// Server HTTP asynchronous berjalan pada port 80
static AsyncWebServer asyncServer(80);

// Variabel global yang didefinisikan di main.cpp
extern float currentTemp;
extern float currentHum;
extern unsigned long bootMillis;

// Menginisialisasi sistem file LittleFS pada memori flash ESP8266
inline bool initLittleFS() {
  if (!LittleFS.begin()) {
    Serial.println(F("[LittleFS ERROR] Gagal mount file system flash"));
    return false;
  }
  Serial.println(F("[LittleFS] File system berhasil dimuat"));
  return true;
}

// Mendaftarkan route static file dan endpoint API pada web server
inline void initAsyncWebServer() {
  // Menyajikan file statis dari folder /data (default: index.html)
  asyncServer.serveStatic("/", LittleFS, "/").setDefaultFile("index.html");

  // Endpoint data sensor & status koneksi real-time
  asyncServer.on("/api/now", HTTP_GET, [](AsyncWebServerRequest *request) {
    JsonDocument doc;

    if (isnan(currentTemp) || isnan(currentHum)) {
      doc["temp"] = nullptr;
      doc["hum"] = nullptr;
    } else {
      doc["temp"] = round(currentTemp * 10) / 10.0;
      doc["hum"] = round(currentHum * 10) / 10.0;
    }

    bool isOnline = (WiFi.status() == WL_CONNECTED);
    wifiConnected = isOnline;
    localIPAddress = isOnline ? WiFi.localIP().toString() : "Disconnected";

    doc["online"] = isOnline;
    doc["status"] = isOnline ? "Connected" : wifiStatusMsg;
    doc["rssi"] = isOnline ? WiFi.RSSI() : 0;
    doc["uptime"] = (millis() - bootMillis) / 1000;
    doc["ip"] = localIPAddress;
    doc["ssid"] = isOnline ? WiFi.SSID() : activeSSID;

    String response;
    serializeJson(doc, response);
    request->send(200, "application/json", response);
  });

  // Endpoint scan jaringan Wi-Fi terdekat
  asyncServer.on("/api/wifi/scan", HTTP_GET, [](AsyncWebServerRequest *request) {
    int n = WiFi.scanNetworks(false, true);
    JsonDocument doc;
    JsonArray networks = doc["networks"].to<JsonArray>();

    for (int i = 0; i < n; i++) {
      JsonObject item = networks.add<JsonObject>();
      item["ssid"] = WiFi.SSID(i);
      item["rssi"] = WiFi.RSSI(i);
      item["encrypted"] = (WiFi.encryptionType(i) != ENC_TYPE_NONE);
    }

    WiFi.scanDelete();

    String response;
    serializeJson(doc, response);
    request->send(200, "application/json", response);
  });

  // Endpoint menghubungkan ke SSID & password baru dari card Wi-Fi di web
  asyncServer.on("/api/wifi/connect", HTTP_POST, [](AsyncWebServerRequest *request) {
    String targetSSID = "";
    String targetPass = "";

    if (request->hasParam("ssid", true)) {
      targetSSID = request->getParam("ssid", true)->value();
    }
    if (request->hasParam("password", true)) {
      targetPass = request->getParam("password", true)->value();
    }

    targetSSID.trim();
    if (targetSSID.length() == 0) {
      request->send(400, "application/json", "{\"ok\":false,\"message\":\"SSID tidak boleh kosong\"}");
      return;
    }

    bool ok = connectToWifi(targetSSID, targetPass);

    JsonDocument doc;
    doc["ok"] = ok;
    doc["ssid"] = activeSSID;
    doc["status"] = wifiStatusMsg;
    doc["ip"] = localIPAddress;

    String response;
    serializeJson(doc, response);
    request->send(ok ? 200 : 500, "application/json", response);
  });

  // Penanganan halaman yang tidak ditemukan (404)
  asyncServer.onNotFound([](AsyncWebServerRequest *request) {
    request->send(404, "text/plain", "404: Not Found");
  });

  // Menjalankan web server secara asynchronous
  asyncServer.begin();
  Serial.println(F("[ASYNC HTTP] Server aktif dan siap melayani request background"));
}

#endif // ASYNC_SERVER_H
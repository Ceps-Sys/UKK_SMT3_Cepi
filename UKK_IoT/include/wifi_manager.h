#ifndef WIFI_MANAGER_H
#define WIFI_MANAGER_H

#include <ESP8266WiFi.h>
#include "config.h"

// Menyimpan status koneksi Wi-Fi, alamat IP lokal, dan SSID aktif saat ini
static bool wifiConnected = false;
static String localIPAddress = "0.0.0.0";
static String activeSSID = DEFAULT_WIFI_SSID;
static String wifiStatusMsg = "Idle";

// Menghubungkan ESP8266 ke jaringan Wi-Fi tertentu dengan batas percobaan (timeout)
inline bool connectToWifi(const String &ssid = DEFAULT_WIFI_SSID, const String &pass = DEFAULT_WIFI_PASS) {
  Serial.println();
  Serial.print(F("[WIFI] Menghubungkan ke: "));
  Serial.println(ssid);

  activeSSID = ssid;
  wifiStatusMsg = "Connecting...";

  // Mode STA (Station) agar ESP8266 terhubung ke router/hotspot yang ada
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid.c_str(), pass.c_str());

  int attempts = 0;
  // Tunggu maksimal 40 x 500ms = 20 detik sampai terkoneksi
  while (WiFi.status() != WL_CONNECTED && attempts < 40) {
    delay(500);
    Serial.print(F("."));
    attempts++;
  }
  Serial.println();

  if (WiFi.status() == WL_CONNECTED) {
    wifiConnected = true;
    localIPAddress = WiFi.localIP().toString();
    activeSSID = WiFi.SSID();
    wifiStatusMsg = "Connected";

    Serial.println(F("[WIFI] Berhasil terhubung!"));
    Serial.print(F("[WIFI] SSID: "));
    Serial.println(activeSSID);
    Serial.print(F("[WIFI] Alamat Dashboard: http://"));
    Serial.println(localIPAddress);
    return true;
  } else {
    wifiConnected = false;
    localIPAddress = "Disconnected";
    wifiStatusMsg = "Failed / Wrong Password or SSID";

    Serial.println(F("[WIFI ERROR] Gagal terhubung ke Wi-Fi."));
    return false;
  }
}

#endif // WIFI_MANAGER_H
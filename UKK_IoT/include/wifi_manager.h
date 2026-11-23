#ifndef WIFI_MANAGER_H
#define WIFI_MANAGER_H

#include <wifi.h>
#include "config.h"

static bool wificonnected = false;
static string localIPaddress = "0.0.0.0";

inline bool connectToWifi() {
    Serial.println();
    Serial.print("[WIFI] Menghubungkan ke:");
    Serial.println(WIFI_SSID);

    Wifi.mode(WIFI_STA);
    Wifi.begin(WIFI_SSID, WIFI_PASS);

    int attemps = 0;
    while (WiFi.status() !=WL_CONNECTED && attempts < 40) {
        delay(500);
        Serial.print(".");
        attempts++;
    }
    Serial.println();

    if (WiFi.status() == WL_CONNECTED) {
        wificonnected = true;
        localIPAddress = Wifi.localIP().toString();
        Serial.println("[WIFI] BErhasil terhubung!");
        Serial.println("[WIFI] Alamat Dashboard: http://");
        Serial.println(localIPAddress);
        return true;
    } else {
        wificonnected = false;
        localIPAddress = "Disconected";
        Serial.println("[WIFI ERROR] gagal terhubung ke wifi.");
        return false;
    }
}
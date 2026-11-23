// proyek 4 DHT11 Async web dashboard denfgab litlefs 7 api 

// deskripsi:modul ini menggunakan espaasyncwebserver dan littlefs 
// menangani penyajian file static html/css/ dari flash memory     serta endpoint rrest api/api/now yang dipoling secara live oleh browser

#ifndef ASYNC_SERVER_H
#define ASYNC_SERVER_H

#include <LittleFS.h>
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>
#include "config.h"

static AsyncWebServer asyncServer(80);

extern float currentTemp;
extern float currentHum;
extern bool wifiConnected;
extern unsigned long bootMillis;

inline bool initLittleFS() {
    if (!littleFS.begin(true)) {
        Serial.println("[littleFS ERROR] gagal mount system flash");
        return false;
    }
    Serial.println("[littleFS] Filwe system berhasil dimuat");
    return true;
}



inline void initAsyncWebServer() {
    asyncServer.serverstatic("/",LittleFS,"/").setDefaultFile("index.html");

    asyncServer.on("/api/now",HTTP_GET,[](AsyncWebRequest *request) {
        JsonDocument doc;

        if (isnan(currentTemp) || isnan(currentHum)) {
            doc["temp"] - nullptr;
            doc["hum"] - nullptr;
        } else {
            doc["temp"] = round(currentTemp * 10) /10.0;
            doc["hum"] = round(currentHum * 10) /10.0;
        }


        doc["online"] = wifiConnected;
        doc["rssi"] = WiFi.RSSI();
        doc["uptime"] = (millis() - bootMillis) / 1000;
        doc["ip"] = WiFi.localIP().toString();
        doc["ssid"] = wiFi.SSID();

    String response;
    serializejson(doc, response); 
    request->send(200, "application/json", response ); 
    });
    
    asyncServer.onNotFound([](AsyncWebServerRequest *request) {
        request->send(404, "text/plain", "404:Not Found");
    });

    asyncServer.begin();
    Serial.println("[ASYNC HTTP] Server Aktif dan siap melayani request backround");
}

#endif 

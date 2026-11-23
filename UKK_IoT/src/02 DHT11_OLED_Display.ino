#include "config.h"
#include "dht_sensor.h"
#include "oled_display.h"

float currentTemperature = 0.0;
float currentHumidity = 0.0;
unsigned long lastReadMillis = 0;
unsigned long readCount = 0;

void setup() {
    Serial.begin(SERIAL_BAUD);
    delay(500);

    Serial.println("=========================================================");
    Serial.println("BELAJAR KONSEP MODULAR ESP8266 + TFT ST7735");
    Serial.println("=========================================================");

    initDisplay();  
    drawSplashScreen();

    initSensor();   
    delay(1000);
}

void loop() {
  unsigned long nowMillis = millis();

  if (nowMillis - lastReadMillis >= READ_INTERVAL_MILLIS) { 
    lastReadMillis = nowMillis; 
    readCount++;                

    if (readDHTData(currentTemperature, currentHumidity)) { 
        Serial.println("[loop] Pembacaan sensor DHT11 berhasil!");
        Serial.println("[loop] Total Pembacaan: " + String(readCount));
        Serial.println("[loop] Temperatur     : " + String(currentTemperature) + " °C");
        Serial.println("[loop] Humidity       : " + String(currentHumidity) + " %");
        
        drawDashboardViewer(currentTemperature, currentHumidity, readCount);
    } else {
        Serial.println("[loop] Gagal membaca sensor DHT11!");
        drawDataError();
    }
  }
}
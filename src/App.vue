/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
<template>
  <div id="map"></div>
</template>

<script lang="ts" setup>
import { randomInt } from "d3-random";
import { Feature } from "geojson";
import L, { Layer, StyleFunction } from "leaflet";
import { onMounted, ref } from "vue";
import { BTSType } from "./types/BTSType";

const defaultZoom = 11;
const defaultCoor = L.latLng(-7.8709, 110.2574);

const date = ref(new Date());
const dataBantul = ref<GeoJSON.GeoJsonObject | BTSType>()
const dataCompanyColor = ref<Record<string, string>>({})

let map: L.Map | undefined;


async function initMaps() {
  map = L.map("map").setView(defaultCoor, defaultZoom);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: `© Lina | Tercatat pada ${date.value.toLocaleDateString()}`,
  }).addTo(map);

  const response = await fetch("data_bts_bantul.json")
  dataBantul.value = await response.json()
  console.log(dataBantul.value)

  addMarker()
  addCircle()
}

function addMarker() {
  if(map){
      (dataBantul.value as BTSType).records.forEach(record => {
          const coordinate = L.latLng(record[3] as number, record[2] as number)
          L.marker(coordinate, getMarkerStyle(record) ).addTo(map!)
      });
  }
}

function addCircle(){
  if(map){
      (dataBantul.value as BTSType).records.forEach(record => {
          const coordinate = L.latLng(record[3] as number, record[2] as number)
          L.circle(coordinate, getCircleStyle(record[7] as string) ).addTo(map!)
      });
  }
}

function getMarkerStyle(record: (string | number)[] ): L.MarkerOptions {
  return {
    title : record[7] as string
  }
  
}

function getCircleStyle(companyName : string) : L.CircleMarkerOptions{
  const selectedColor = getColor(companyName)
  // const selectedColor = getRandomColor()
  return {
    color: selectedColor,  
    fillColor: selectedColor,
    fillOpacity: 0.5,
    radius: 1000,
  }
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getColor(companyName : string): string {  
  if (!(companyName in dataCompanyColor.value)){
      // const random = randomInt(5)
      let selectedColor = getRandomColor()
      let sameColor = Object.values(dataCompanyColor.value).includes(selectedColor)
      while(sameColor){
        selectedColor = getRandomColor()
        sameColor = Object.values(dataCompanyColor.value).includes(selectedColor)
      }
      dataCompanyColor.value[companyName] = selectedColor
  }
  return dataCompanyColor.value[companyName]
}

function returnHome() {
  if (map) {
    map.setView(defaultCoor, defaultZoom);
  }
}

onMounted(async () => {
  await initMaps();
});
</script>

<style lang="scss">
#map {
  height: 95vh;
}

.info {
  padding: 6px 8px;
  font: 14px/16px Arial, Helvetica, sans-serif;
  background: white;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
}

.legend {
  line-height: 18px;
  color: #555;
}
.legend i {
  width: 18px;
  height: 18px;
  float: left;
  margin-right: 8px;
  opacity: 0.7;
}
</style>

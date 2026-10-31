"use client";

import { useEffect, useRef, useState } from "react";
import type { CircleMarker, Map as LeafletMap, Polyline } from "leaflet";
import type { Ship } from "@/lib/ais";

const NORMAL_COLOR = "#0d9488";
const ANOMALY_COLOR = "#ef4444";
const SELECTED_COLOR = "#f59e0b";

const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

type AisMapProps = {
  ships: Ship[];
  threshold: number;
  selected: Ship | null;
  onSelect: (ship: Ship) => void;
  label: string;
};

export function AisMap({
  ships,
  threshold,
  selected,
  onSelect,
  label,
}: AisMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const markersRef = useRef<Map<number, CircleMarker>>(new Map());
  const routeRef = useRef<Polyline | null>(null);
  const routePointsRef = useRef<CircleMarker[]>([]);
  const onSelectRef = useRef(onSelect);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    if (ships.length === 0) {
      return;
    }

    let cancelled = false;
    let resize: ResizeObserver | undefined;

    async function mount() {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      const L = await import("leaflet");
      if (cancelled) {
        return;
      }

      const map = L.map(container, {
        center: [-6.04, 106.88],
        zoom: 11,
        minZoom: 9,
        maxZoom: 16,
        preferCanvas: true,
      });

      leafletRef.current = L;
      mapRef.current = map;

      L.tileLayer(TILE_URL, {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const markers = new Map<number, CircleMarker>();
      for (const ship of ships) {
        const marker = L.circleMarker([ship.lat, ship.lon], {
          radius: 3.5,
          weight: 0,
          fillColor: NORMAL_COLOR,
          fillOpacity: 0.45,
        }).addTo(map);

        marker.bindTooltip(`${ship.mmsi} · ${ship.score.toFixed(3)}`, {
          className: "ais-tooltip",
          direction: "top",
          offset: [0, -4],
          opacity: 1,
        });
        marker.on("click", () => onSelectRef.current(ship));
        markers.set(ship.mmsi, marker);
      }
      markersRef.current = markers;

      resize = new ResizeObserver(() => map.invalidateSize());
      resize.observe(container);

      if (cancelled) {
        map.remove();
        return;
      }
      setReady(true);
    }

    void mount();

    return () => {
      cancelled = true;
      resize?.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
      leafletRef.current = null;
      routeRef.current = null;
      routePointsRef.current = [];
      markersRef.current.clear();
    };
  }, [ships]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    const flagged = new Set(
      ships.filter((ship) => ship.score >= threshold).map((ship) => ship.mmsi),
    );

    for (const [mmsi, marker] of markersRef.current) {
      if (selected?.mmsi === mmsi) {
        marker.setStyle({
          radius: 7,
          fillColor: SELECTED_COLOR,
          fillOpacity: 1,
          color: "#ffffff",
          weight: 2,
        });
        marker.bringToFront();
      } else if (flagged.has(mmsi)) {
        marker.setStyle({
          radius: 5.5,
          fillColor: ANOMALY_COLOR,
          fillOpacity: 0.95,
          color: "#ffffff",
          weight: 1,
        });
        marker.bringToFront();
      } else {
        marker.setStyle({
          radius: 3.5,
          fillColor: NORMAL_COLOR,
          fillOpacity: 0.45,
          color: NORMAL_COLOR,
          weight: 0,
        });
      }
    }
  }, [ready, ships, threshold, selected]);

  useEffect(() => {
    if (!ready || !selected) {
      return;
    }

    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L) {
      return;
    }

    routeRef.current?.remove();
    routeRef.current = null;
    routePointsRef.current.forEach((point) => point.remove());
    routePointsRef.current = [];

    if (selected.route.length > 1) {
      routeRef.current = L.polyline(selected.route, {
        color: SELECTED_COLOR,
        weight: 2,
        opacity: 0.9,
        dashArray: "4 5",
      }).addTo(map);
      routePointsRef.current = selected.route.map(([lat, lon]) =>
        L.circleMarker([lat, lon], {
          radius: 2.5,
          weight: 0,
          fillColor: SELECTED_COLOR,
          fillOpacity: 0.85,
        }).addTo(map),
      );
    }

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const center: [number, number] = [selected.lat, selected.lon];
    const zoom = Math.max(map.getZoom(), 12);

    if (reduced) {
      map.setView(center, zoom, { animate: false });
    } else {
      map.flyTo(center, zoom, { duration: 0.6 });
    }
  }, [ready, selected]);

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={label}
      className="h-[420px] w-full sm:h-[520px] lg:h-[560px]"
    />
  );
}

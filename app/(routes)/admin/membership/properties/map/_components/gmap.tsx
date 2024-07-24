"use client";

import { ExtendedUser } from "@/next-auth";
import { Property } from "@prisma/client";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF as Marker,
} from "@react-google-maps/api";
import { useCallback, useEffect, useState } from "react";

const customSize = {
  width: 50,
  height: 50,
  equals: function (other: google.maps.Size | null): boolean {
    return (
      other !== null &&
      this.width === other.width &&
      this.height === other.height
    );
  },
};

const pinIcon = {
  url: "/home.png",
  scaledSize: customSize,
};

const pinVacantIcon = {
  url: "/vacant.png",
  scaledSize: customSize,
};

const pinOccupiedIcon = {
  url: "/occupied.png",
  scaledSize: customSize,
};

interface GMapViewProps {
  properties: Property[];
  selectedProperty: string;
  users: ExtendedUser[];
}

const GMapView: React.FC<GMapViewProps> = ({
  properties,
  selectedProperty,
  users,
}) => {
  const containerStyle = {
    width: "100%",
    height: "100%",
  };

  const initialCenter = {
    lat: 14.564760291845436,
    lng: 120.9931651962691,
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: `${process.env.NEXT_PUBLIC_GMAPS_API_KEY}`,
  });

  const [map, setMap] = useState(null);
  const [center, setCenter] = useState(initialCenter);

  useEffect(() => {
    const selected = properties.find((property) => {
      return property.id === selectedProperty;
    });

    const propCenter = {
      lat: selected?.latitude || initialCenter.lat,
      lng: selected?.longitude || initialCenter.lng,
    };

    if (propCenter) {
      setCenter(propCenter);
    }
  }, [initialCenter.lat, initialCenter.lng, properties, selectedProperty]);

  const onLoad = useCallback(
    function callback(map: any) {
      const bounds = new window.google.maps.LatLngBounds(center);
      map.fitBounds(bounds);

      setMap(map);
    },
    [center]
  );

  const onUnmount = useCallback(function callback(map: any) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {properties.map((property) => {
        if (property.latitude && property.longitude) {
          const propCenter = {
            lat: property.latitude,
            lng: property.longitude,
          };

          const isOccupied = users.filter((user) => {
            return property.id === user?.info?.address;
          });

          return (
            <Marker
              key={property.id}
              position={propCenter}
              icon={isOccupied.length ? pinVacantIcon : pinOccupiedIcon}
            />
          );
        }
      })}
    </GoogleMap>
  ) : (
    <></>
  );
};

export default GMapView;

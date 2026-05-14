import { useEffect, useState } from "react";

import {
  Page,
  Card,
  Select,
  BlockStack,
  InlineStack,
  Text,
} from "@shopify/polaris";

export default function LocationsPage() {

  const apiRoot = import.meta.env.VITE_API_ROOT;

  const [locations, setLocations] = useState([]);

  const csvOptions = [
    { label: "Select CSV", value: "" },
    { label: "OH_032", value: "OH_032" },
    { label: "OH_034", value: "OH_034" },
    { label: "OH_078", value: "OH_078" },
  ];

  const fetchLocations = async () => {

    try {

      const response = await fetch(
        `${apiRoot}/api/locations/get-locations`
      );

      const data = await response.json();

      setLocations(data.data || []);

    } catch (error) {

      console.error(error);
    }
  };

  useEffect(() => {

    fetchLocations();

  }, []);

  const updateMapping = async (locationId, csvCode) => {

    try {

      await fetch(`${apiRoot}/api/locations/map-locations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location_id: locationId,
          csv_code: csvCode,
        }),
      });

      setLocations((prev) =>
        prev.map((item) =>
          item.id === locationId
            ? { ...item, csv_code: csvCode }
            : item
        )
      );

    } catch (error) {

      console.error(error);
    }
  };

  return (

    <Page title="Location Mapping">

      <BlockStack gap="400">

        {locations.map((location) => (

          <Card key={location.id}>

            <InlineStack align="space-between">

              <Text variant="headingMd">
                {location.store_name}
              </Text>

              <div style={{ width: 250 }}>

                <Select
                  options={csvOptions}
                  value={location.csv_code || ""}
                  onChange={(value) =>
                    updateMapping(location.id, value)
                  }
                />

              </div>

            </InlineStack>

          </Card>
        ))}

      </BlockStack>

    </Page>
  );
}
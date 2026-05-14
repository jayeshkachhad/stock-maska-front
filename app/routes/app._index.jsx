import {
  useLoaderData,
} from "react-router";

import { authenticate } from "../shopify.server";

import { useEffect, useState } from "react";

import {
  Page,
  Card,
  Select,
  BlockStack,
  InlineStack,
  Text,
} from "@shopify/polaris";

export const loader = async ({ request }) => {

  await authenticate.admin(request);

  return {
    apiRoot: process.env.VITE_API_ROOT || ""
  };
};

export default function DashboardPage() {

  const { apiRoot } = useLoaderData();

  const [stats, setStats] = useState(null);

  const [locations, setLocations] = useState([]);

  const csvOptions = [
    { label: "Select CSV", value: "" },
    { label: "OH_032", value: "OH_032" },
    { label: "OH_034", value: "OH_034" },
    { label: "OH_078", value: "OH_078" },
  ];

  // Dashboard Stats
  useEffect(() => {

    fetch(`${apiRoot}/api/stats`)
      .then(res => res.json())
      .then(data => {
        setStats(data);
      });

  }, [apiRoot]);

  // Fetch Locations
  useEffect(() => {

    fetch(`${apiRoot}/api/locations/get-locations`)
      .then(res => res.json())
      .then(data => {
        setLocations(data.data || []);
      });

  }, [apiRoot]);

  // Update Mapping
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

    <Page title="StockMaska Dashboard">

      <BlockStack gap="500">

        {/* Stats */}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
        }}>

          <DashboardCard
            title="Pending Queue"
            value={stats?.pending || 0}
          />

          <DashboardCard
            title="Processed"
            value={stats?.done || 0}
          />

          <DashboardCard
            title="Failed"
            value={stats?.failed || 0}
          />

          <DashboardCard
            title="Locations"
            value={stats?.locations || 0}
          />

        </div>

        {/* Location Mapping */}

        <Card>

          <div style={{ padding: "20px" }}>

            <Text variant="headingLg" as="h2">
              Location Mapping
            </Text>

            <div style={{ marginTop: "20px" }}>

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

            </div>

          </div>

        </Card>

      </BlockStack>

    </Page>
  );
}

function DashboardCard({ title, value }) {

  return (

    <div style={{
      border: '1px solid #ddd',
      padding: '20px',
      borderRadius: '10px',
      background: '#fff'
    }}>

      <h3>{title}</h3>

      <h1>{value}</h1>

    </div>
  );
}
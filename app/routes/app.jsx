import {
  useLoaderData,
  useRouteError
} from "react-router";

import { boundary } from "@shopify/shopify-app-react-router/server";

import { authenticate } from "../shopify.server";

import { useEffect, useState } from "react";

export const loader = async ({ request }) => {

  await authenticate.admin(request);

  return {
    apiRoot: process.env.API_ROOT || ""
  };
};

export default function AppHome() {

  const { apiRoot } = useLoaderData();

  const [stats, setStats] = useState(null);

  useEffect(() => {

    fetch(`${apiRoot}/api/stats`)

      .then(res => res.json())

      .then(data => {
        setStats(data);
      });

  }, [apiRoot]);

  if (!stats) {

    return <div>Loading...</div>;
  }

  return (

    <div style={{ padding: "20px" }}>

      <h1>StockMaska Dashboard</h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        marginTop: '20px'
      }}>

        <Card
          title="Pending Queue"
          value={stats.pending}
        />

        <Card
          title="Processed"
          value={stats.done}
        />

        <Card
          title="Failed"
          value={stats.failed}
        />

        <Card
          title="Locations"
          value={stats.locations}
        />

      </div>

    </div>
  );
}

function Card({ title, value }) {

  return (

    <div style={{
      border: '1px solid #ddd',
      padding: '20px',
      borderRadius: '10px'
    }}>

      <h3>{title}</h3>

      <h1>{value}</h1>

    </div>
  );
}

export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
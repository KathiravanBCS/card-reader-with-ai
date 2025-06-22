import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Typography, Paper, Button } from "@mui/material";

function renderValue(value) {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object" && value !== null) {
    // Show description if present, else JSON
    if (value.description) return value.description;
    return <pre style={{ margin: 0 }}>{JSON.stringify(value, null, 2)}</pre>;
  }
  return value;
}

export default function CardDetail() {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  useEffect(() => {
    fetch(`/card/${id}`)
      .then((res) => res.json())
      .then(setCard);
  }, [id]);
  if (!card) return <p>Loading...</p>;
  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Card Details
        </Typography>
        {card.image && (
          <img
            src={`data:image/jpeg;base64,${card.image}`}
            alt="Card"
            width={300}
            style={{ display: "block", margin: "0 auto 16px" }}
          />
        )}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {Object.entries(card).map(
            ([k, v]) =>
              k !== "image" && (
                <li key={k} style={{ marginBottom: 8 }}>
                  <strong>{k}:</strong> {renderValue(v)}
                </li>
              )
          )}
        </ul>
        <Button
          component={Link}
          to="/cards"
          variant="outlined"
          sx={{ mt: 2 }}
        >
          Back to Cards List
        </Button>
      </Paper>
    </Box>
  );
}

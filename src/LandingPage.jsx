import React, { useEffect, useState } from "react";
import { Card, CardContent, CardMedia, Typography, Grid, Box } from "@mui/material";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const [cards, setCards] = useState([]);
  useEffect(() => {
    fetch("/cards")
      .then((res) => res.json())
      .then(setCards);
  }, []);
  return (
    <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Welcome to Card Reader
      </Typography>
      <Typography variant="body1" align="center" gutterBottom>
        Scan and manage your business cards easily. Use the sidebar to scan new
        cards or view all scanned cards.
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={card.id}>
            <Card
              component={Link}
              to={`/card/${card.id}`}
              sx={{ textDecoration: "none", height: "100%" }}
            >
              {card.image && (
                <CardMedia
                  component="img"
                  height="160"
                  image={`data:image/jpeg;base64,${card.image}`}
                  alt={card.name || "Card"}
                  sx={{ objectFit: "cover" }}
                />
              )}
              <CardContent>
                <Typography variant="h6" noWrap>
                  {card.name || "(No Name)"}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {card.company_name}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {card.email}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

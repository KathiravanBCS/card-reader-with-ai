import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

export default function ScanUpload({ onScan }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const scan = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch("/analyze", { method: "POST", body: formData });
    const data = await res.json();
    setResult(data);
    setLoading(false);
    setSuccess(true);
    if (onScan) onScan(data);
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setSuccess(false);
  };

  const renderResult = (data) => {
    if (!data) return null;
    // If the result is an array, render each card
    if (Array.isArray(data)) {
      return (
        <Box>
          {data.map((card, idx) => (
            <Paper key={idx} sx={{ mb: 2, p: 2, background: "#fafafa" }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Card {idx + 1}
              </Typography>
              <List dense>
                {Object.entries(card).map(([key, value]) => (
                  <ListItem key={key} alignItems="flex-start" disablePadding>
                    <ListItemText
                      primary={<b>{key.replace(/_/g, " ")}:</b>}
                      secondary={
                        typeof value === "object" && value !== null ? (
                          <Box
                            component="span"
                            sx={{
                              whiteSpace: "pre-wrap",
                              fontFamily: "inherit",
                            }}
                          >
                            {JSON.stringify(value, null, 2)}
                          </Box>
                        ) : (
                          String(value)
                        )
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          ))}
        </Box>
      );
    }
    // If the result is a single object
    if (typeof data === "object") {
      return (
        <List dense>
          {Object.entries(data).map(([key, value]) => (
            <ListItem key={key} alignItems="flex-start" disablePadding>
              <ListItemText
                primary={<b>{key.replace(/_/g, " ")}:</b>}
                secondary={
                  typeof value === "object" && value !== null ? (
                    <Box
                      component="span"
                      sx={{
                        whiteSpace: "pre-wrap",
                        fontFamily: "inherit",
                      }}
                    >
                      {JSON.stringify(value, null, 2)}
                    </Box>
                  ) : (
                    String(value)
                  )
                }
              />
            </ListItem>
          ))}
        </List>
      );
    }
    // Fallback
    return (
      <Box
        component="pre"
        sx={{
          background: "#f5f5f5",
          p: 2,
          borderRadius: 1,
          fontSize: 14,
          overflow: "auto",
        }}
      >
        {JSON.stringify(data, null, 2)}
      </Box>
    );
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      {!success ? (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Upload Card Image
          </Typography>
          <input type="file" accept="image/*" onChange={handleFile} />
          {file && (
            <Button
              variant="contained"
              onClick={scan}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              Scan
            </Button>
          )}
          {loading && <Typography sx={{ mt: 2 }}>Scanning...</Typography>}
        </Paper>
      ) : (
        <Paper sx={{ p: 3 }}>
          <Alert severity="success" sx={{ mb: 2 }}>
            Scan successful!
          </Alert>
          <Typography variant="subtitle1" gutterBottom>
            Extracted Card Details:
          </Typography>
          {renderResult(result)}
          <Button
            variant="outlined"
            onClick={reset}
            sx={{ mt: 2 }}
          >
            Scan Another
          </Button>
        </Paper>
      )}
    </Box>
  );
}

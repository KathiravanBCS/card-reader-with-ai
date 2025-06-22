import React, { useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

export default function ScanCamera({ onScan }) {
  const videoRef = useRef(null);
  const [captured, setCaptured] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [success, setSuccess] = useState(false);
  const [videoReady, setVideoReady] = useState(false); // NEW

  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setVideoReady(false); // Reset ready state
    }
  };

  // NEW: handle video loadedmetadata
  const handleLoadedMetadata = () => {
    setVideoReady(true);
  };

  const capture = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      setCaptured(blob);
    }, "image/jpeg");
  };

  const scan = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("image", captured, "capture.jpg");
    const res = await fetch("/analyze", { method: "POST", body: formData });
    const data = await res.json();
    setResult(data);
    setLoading(false);
    setSuccess(true);
    if (onScan) onScan(data);
  };

  const reset = () => {
    setCaptured(null);
    setResult(null);
    setSuccess(false);
  };

  const renderResult = (data) => {
    if (!data) return null;
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
                      primary={<b>{key.replace(/_/g, " ")}</b>}
                      secondary={
                        typeof value === "object" && value !== null ? (
                          <Box component="span" sx={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
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
    if (typeof data === "object") {
      return (
        <List dense>
          {Object.entries(data).map(([key, value]) => (
            <ListItem key={key} alignItems="flex-start" disablePadding>
              <ListItemText
                primary={<b>{key.replace(/_/g, " ")}</b>}
                secondary={
                  typeof value === "object" && value !== null ? (
                    <Box component="span" sx={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
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
    return (
      <Box component="pre" sx={{ background: "#f5f5f5", p: 2, borderRadius: 1, fontSize: 14, overflow: "auto" }}>
        {JSON.stringify(data, null, 2)}
      </Box>
    );
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      {!success ? (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Scan Card with Camera
          </Typography>
          <video
            ref={videoRef}
            autoPlay
            width={320}
            height={240}
            style={{ display: "block", marginBottom: 8 }}
            onLoadedMetadata={handleLoadedMetadata} // NEW
          />
          <Box sx={{ mb: 2 }}>
            <Button variant="outlined" onClick={startCamera} sx={{ mr: 1 }}>
              Start Camera
            </Button>
            <Button
              variant="contained"
              onClick={capture}
              disabled={loading || !videoRef.current?.srcObject || !videoReady} // UPDATED
            >
              Capture
            </Button>
          </Box>
          {captured && (
            <Box sx={{ mb: 2 }}>
              <img src={URL.createObjectURL(captured)} alt="Captured" width={200} style={{ display: "block", marginBottom: 8 }} />
              <Button variant="contained" onClick={scan} disabled={loading}>
                Scan
              </Button>
            </Box>
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
          <Button variant="outlined" onClick={reset} sx={{ mt: 2 }}>
            Scan Another
          </Button>
        </Paper>
      )}
    </Box>
  );
}

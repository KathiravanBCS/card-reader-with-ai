import React, { useEffect, useState } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { Box, Typography, useMediaQuery } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

function formatCell(value) {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object" && value !== null) {
    if (value.description) return value.description;
    return "See details";
  }
  return value;
}

export default function CardsTable() {
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme ? useTheme() : {};
  const isMobile = useMediaQuery(theme.breakpoints ? theme.breakpoints.down("sm") : "(max-width:600px)");

  useEffect(() => {
    fetch("/cards").then((res) => res.json()).then(setRows);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this card?")) return;
    await fetch(`/card/${id}`, { method: "DELETE" });
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  const columns = [
    { field: "id", headerName: "#", width: 60 },
    { field: "name", headerName: "Full Name", flex: 1, minWidth: 120, valueGetter: (params) => formatCell(params?.row?.name ?? "") },
    { field: "email", headerName: "Email", flex: 1, minWidth: 120, valueGetter: (params) => formatCell(params?.row?.email ?? "") },
    { field: "company_name", headerName: "Company", flex: 1, minWidth: 120, valueGetter: (params) => formatCell(params?.row?.company_name ?? "") },
    { field: "phone_number", headerName: "Phone Number", flex: 1, minWidth: 120, valueGetter: (params) => formatCell(params?.row?.phone_number ?? "") },
    { field: "title", headerName: "Title", flex: 1, minWidth: 120, valueGetter: (params) => formatCell(params?.row?.title ?? "") },
    { field: "website", headerName: "Website", flex: 1, minWidth: 120, valueGetter: (params) => formatCell(params?.row?.website ?? "") },
    { field: "created_at", headerName: "Scanned At", flex: 1, minWidth: 120 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<VisibilityIcon />}
          label="View"
          onClick={() => navigate(`/card/${params.id}`)}
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => navigate(`/card/${params.id}?edit=1`)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDelete(params.id)}
          showInMenu
        />,
      ],
    },
  ];

  return (
    <Box sx={{ width: "100%", mt: 2, px: { xs: 0, sm: 2, md: 4 } }}>
      <Typography variant="h5" align="center" gutterBottom>Scanned Cards Table</Typography>
      <div style={{ height: isMobile ? 400 : 600, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={isMobile ? 5 : 10}
          rowsPerPageOptions={isMobile ? [5, 10] : [10, 20, 50]}
          disableSelectionOnClick
          autoHeight={isMobile}
        />
      </div>
    </Box>
  );
}

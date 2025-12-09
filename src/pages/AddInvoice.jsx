import React, { useState, useRef } from "react";
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  Box,
  Typography,
  Alert,
  Paper,
} from "@mui/material";
import { axiosClient } from "../utilities/axiosConfig";

const statusOptions = [
  { label: "In Progress", value: 0 },
  { label: "Approved", value: 1 },
  { label: "Rejected", value: 2 },
  { label: "Submitted", value: 3 },
];

export default function AddInvoice() {
  const [form, setForm] = useState({
    invoice_date: "",
    invoice_id: "",
    invoice_description: "",
    amount: "",
    status: 0,
    notes: "",
    customer_id: "",
  });

  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const inputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selected]);
  };

  // Drag & Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      // Send via FormData
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value ?? "");
      });

      formData.append("amount", parseFloat(form.amount));
      formData.append(
        "customer_id",
        form.customer_id ? parseInt(form.customer_id, 10) : ""
      );

      // Append files properly
      files.forEach((file) => {
        formData.append("files[]", file);
      });
      console.log("Submitting form data:", formData);
      const resp = await axiosClient.post("/invoices", formData);

      console.log("Invoice added:", resp);

      setSuccessMsg("Invoice added successfully!");
      setForm({
        invoice_date: "",
        invoice_description: "",
        amount: "",
        status: 0,
        notes: "",
        customer_id: "",
        invoice_id: "",
      });
      setFiles([]);
    } catch (err) {
      console.log("Error adding invoice:", err);
      setErrorMsg(
        err?.response?.data?.message ||
          "Failed to add invoice. Please check your input and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 600,
        mx: "auto",
        p: { xs: 2, sm: 4 },
        borderRadius: 3,
        background: (theme) =>
          theme.palette.mode === "dark" ? "#1a2027" : "#fff",
      }}
    >
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        Add New Invoice
      </Typography>

      <Box component="form" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* ---------------- Form Fields ---------------- */}
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Invoice Date"
              type="date"
              name="invoice_date"
              value={form.invoice_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Amount"
              type="number"
              name="amount"
              inputProps={{ min: 0, step: "0.01" }}
              value={form.amount}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="invoice_description"
              value={form.invoice_description}
              onChange={handleChange}
              multiline
              rows={2}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Invoice ID"
              name="invoice_id"
              fullWidth
              value={form.invoice_id}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Customer ID"
              name="customer_id"
              fullWidth
              value={form.customer_id}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              multiline
              rows={2}
            />
          </Grid>

          {/* ---------------- FILE UPLOAD UI ---------------- */}
          <Grid item xs={12}>
            <Box
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => inputRef.current.click()}
              sx={{
                border: "2px dashed",
                borderColor: dragActive ? "primary.main" : "grey.500",
                p: 3,
                borderRadius: 2,
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: dragActive ? "action.hover" : "transparent",
                transition: "0.2s",
              }}
            >
              <Typography sx={{ fontWeight: 600, mb: 1 }}>
                Click or drag files here
              </Typography>
              <Typography variant="body2" color="text.secondary">
                PNG, JPG, WEBP, PDF, Word, Excel...
              </Typography>

              <input
                ref={inputRef}
                type="file"
                multiple
                hidden
                onChange={handleFileSelect}
              />
            </Box>

            {/* File previews */}
            {files.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                  Selected Files:
                </Typography>
                {files.map((file, idx) => (
                  <Typography
                    key={idx}
                    variant="body2"
                    sx={{ opacity: 0.8, mb: 0.5 }}
                  >
                    • {file.name}
                  </Typography>
                ))}
              </Box>
            )}
          </Grid>

          {/* ---------------- Submit Button ---------------- */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
              fullWidth
              sx={{ py: 1.5, fontWeight: 700, mt: 1 }}
            >
              {loading ? "Submitting..." : "Add Invoice"}
            </Button>
          </Grid>

          {/* ---------------- Alerts ---------------- */}
          {successMsg && (
            <Grid item xs={12}>
              <Alert severity="success">{successMsg}</Alert>
            </Grid>
          )}
          {errorMsg && (
            <Grid item xs={12}>
              <Alert severity="error">{errorMsg}</Alert>
            </Grid>
          )}
        </Grid>
      </Box>
    </Paper>
  );
}

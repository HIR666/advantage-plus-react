import React, { useEffect, useState, useRef } from "react";
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
import { useAuth } from "../context/AuthContext";

export default function AddInvoice() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    invoice_date: "",
    invoice_id: "",
    invoice_description: "",
    amount: "",
    notes: "",
    customer_id: "",
    requester_id: "",
    currency: "USD",
  });

  const [requesters, setRequesters] = useState([]);
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  /** --------------------------------------------------------------
   * Load Requesters (users who can be assigned tasks)
   * -------------------------------------------------------------*/
  useEffect(() => {
    axiosClient
      .get("/users?role=requester") // You can adjust this API as needed
      .then((res) => setRequesters(res))
      .catch(() => setRequesters([]));
  }, []);

  /** --------------------------------------------------------------
   * Handle Form Input
   * -------------------------------------------------------------*/
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /** --------------------------------------------------------------
   * File Handling
   * -------------------------------------------------------------*/
  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selected]);
  };

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

  /** --------------------------------------------------------------
   * Submit Form
   * -------------------------------------------------------------*/
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const fd = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        fd.append(key, value ?? "");
      });

      fd.append("amount", parseFloat(form.amount));

      files.forEach((file) => {
        fd.append("files[]", file);
      });

      const resp = await axiosClient.post("/invoices", fd);
      console.log("Invoice created:", resp);
      setSuccessMsg("Task created successfully!");
      setForm({
        invoice_date: "",
        invoice_id: "",
        invoice_description: "",
        amount: "",
        notes: "",
        customer_id: "",
        requester_id: "",
        currency: "USD",
      });
      setFiles([]);
    } catch (err) {
      console.log("Error creating invoice:", err);
      setErrorMsg(
        err?.response?.data?.message ||
          "Failed to create task. Please check your input and try again."
      );
    } finally {
      setLoading(true);
      setTimeout(() => setLoading(false), 300);
    }
  };

  /** --------------------------------------------------------------
   * Prevent non-supervisors from seeing this page
   * -------------------------------------------------------------*/
  if (!user?.role === 2) {
    return (
      <Alert severity="error" sx={{ mt: 3 }}>
        You do not have permission to create tasks.
      </Alert>
    );
  }

  /** --------------------------------------------------------------
   * Render Component
   * -------------------------------------------------------------*/
  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 650,
        mx: "auto",
        p: { xs: 2, sm: 4 },
        borderRadius: 3,
      }}
    >
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        Create New Task
      </Typography>

      <Box component="form" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Date */}
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

          {/* Amount */}
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

          {/* Currency */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              required
              fullWidth
              label="Currency"
              name="currency"
              value={form.currency}
              onChange={handleChange}
            >
              <MenuItem value="USD">USD</MenuItem>
              {/* <MenuItem value="EUR">EUR</MenuItem> */}
              <MenuItem value="IQD">IQD</MenuItem>
              <MenuItem value="AED">AED</MenuItem>
              <MenuItem value="CNY">CNY</MenuItem>
            </TextField>
          </Grid>

          {/* Requester */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              required
              fullWidth
              label="Assign Requester"
              name="requester_id"
              value={form.requester_id}
              onChange={handleChange}
            >
              {requesters.length === 0 && (
                <MenuItem disabled>No requesters found</MenuItem>
              )}
              {requesters.map((req) => (
                <MenuItem key={req.id} value={req.id}>
                  {req.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Invoice ID */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Invoice ID (Optional)"
              name="invoice_id"
              value={form.invoice_id}
              onChange={handleChange}
            />
          </Grid>

          {/* Description */}
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

          {/* Customer */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Customer ID"
              name="customer_id"
              value={form.customer_id}
              onChange={handleChange}
            />
          </Grid>

          {/* Notes */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Internal Notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              multiline
              rows={2}
            />
          </Grid>

          {/* FILE UPLOAD */}
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
                transition: ".2s",
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

            {files.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                  Selected Files:
                </Typography>
                {files.map((file, idx) => (
                  <Typography key={idx} variant="body2" sx={{ opacity: 0.8 }}>
                    • {file.name}
                  </Typography>
                ))}
              </Box>
            )}
          </Grid>

          {/* Submit */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              disabled={loading}
              sx={{ py: 1.5, fontWeight: 700, mt: 1 }}
            >
              {loading ? "Creating Task..." : "Create Task"}
            </Button>
          </Grid>

          {/* Alerts */}
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

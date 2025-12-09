// src/screens/invoices/InvoiceDetails.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Button,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { axiosClient } from "../utilities/axiosConfig";

export default function InvoiceDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Modal + form state
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusNotes, setStatusNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [statusError, setStatusError] = useState("");

  const getInvoice = async () => {
    setLoading(true);

    try {
      const res = await axiosClient.get(`/invoices/${id}`);
      console.log("Invoice response:", res);
      setInvoice(res);
    } catch (error) {
      console.error("Invoice error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInvoice();
  }, [id]);

  useEffect(() => {
    if (user) {
      console.log("Current user:", user);
    }
  }, [user]);

  const getStatusLabel = (status) =>
    ["Pending", "Finished", "Needs Modification", "Cancelled"][status];

  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return "warning";
      case 1:
        return "success";
      case 2:
        return "info";
      case 3:
      default:
        return "error";
    }
  };

  // 🔹 Open modal, prefill with current status
  const handleOpenStatusModal = () => {
    if (!invoice) return;
    setNewStatus(invoice.status ?? 0);
    setStatusNotes(invoice.status_notes ?? "");
    setStatusError("");
    setStatusModalOpen(true);
  };

  const handleCloseStatusModal = () => {
    if (saving) return;
    setStatusModalOpen(false);
  };

  // 🔹 Submit status change
  const handleUpdateStatus = async () => {
    setStatusError("");

    // Basic front-end validation
    if (newStatus === "" || newStatus === null) {
      setStatusError("Please choose a status.");
      return;
    }

    // If "Needs Modification", require notes
    if (Number(newStatus) === 2 && !statusNotes.trim()) {
      setStatusError("Please provide notes when requesting modifications.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        status: Number(newStatus),
        status_notes: statusNotes || null,
      };

      const res = await axiosClient.post(
        `/invoices/${invoice.id}/status`,
        payload
      );
      console.log("Status update response:", res);

      // Refresh invoice details with new data
      await getInvoice();
      setStatusModalOpen(false);
    } catch (error) {
      console.error("Status update error:", error);
      setStatusError(
        error?.message ||
          error?.errors?.status?.[0] ||
          "Failed to update status. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );

  if (!invoice) return <Typography>No invoice found.</Typography>;

  return (
    <>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Invoice #{invoice.id}
        </Typography>

        <Chip
          label={getStatusLabel(invoice.status)}
          color={getStatusColor(invoice.status)}
          sx={{ mt: 2, mb: 2 }}
        />

        <Divider sx={{ my: 2 }} />

        <Typography>
          <strong>Invoice ID:</strong> {invoice.invoice_id}
        </Typography>
        <Typography>
          <strong>Date:</strong> {invoice.invoice_date}
        </Typography>
        <Typography>
          <strong>Amount:</strong> {invoice.amount}
        </Typography>
        <Typography>
          <strong>Customer ID:</strong> {invoice.customer_id ?? "-"}
        </Typography>
        <Typography sx={{ mt: 1 }}>
          <strong>Notes:</strong> {invoice.notes ?? "-"}
        </Typography>

        {invoice.status_notes && (
          <Typography sx={{ mt: 1 }}>
            <strong>Status Notes:</strong> {invoice.status_notes}
          </Typography>
        )}

        {invoice.files?.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mt: 3 }}>
              Files
            </Typography>
            {invoice.files.map((file) => (
              <Box key={file.id} sx={{ mt: 1 }}>
                <a href={file.url} target="_blank" rel="noreferrer">
                  {file.original_name}
                </a>
              </Box>
            ))}
          </>
        )}

        {/* 🔹 Supervisor-only action button */}
        {parseInt(user?.role) === 2 && (
          <Button
            variant="contained"
            sx={{ mt: 3 }}
            onClick={handleOpenStatusModal}
          >
            Update Status
          </Button>
        )}
      </Paper>

      {/* 🔹 Status Update Modal */}
      <Dialog
        open={statusModalOpen}
        onClose={handleCloseStatusModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Update Invoice Status</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              label="Status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value={0}>Pending</MenuItem>
              <MenuItem value={1}>Finished</MenuItem>
              <MenuItem value={2}>Needs Modification</MenuItem>
              <MenuItem value={3}>Cancelled</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Status Notes"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            value={statusNotes}
            onChange={(e) => setStatusNotes(e.target.value)}
            placeholder="Add explanation, modification request, or reason for cancellation"
          />

          {statusError && (
            <Typography color="error" sx={{ mt: 1 }}>
              {statusError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusModal} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdateStatus}
            variant="contained"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

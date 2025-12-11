// src/screens/invoices/InvoiceDetails.jsx
import React, { useEffect, useState, useRef } from "react";
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
  TextField,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Alert,
  Grid,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { axiosClient } from "../utilities/axiosConfig";

export default function InvoiceDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit Mode
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [requesters, setRequesters] = useState([]);
  const [editFiles, setEditFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const editFileInput = useRef(null);
  const [saving, setSaving] = useState(false);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalNote, setModalNote] = useState("");
  const [actionType, setActionType] = useState(null);

  // Load invoice
  const fetchInvoice = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get(`/invoices/${id}`);
      setInvoice(res);
    } catch (err) {
      console.error("Fetch invoice error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  // Load requesters for supervisor
  useEffect(() => {
    if (user?.role === 2) {
      axiosClient
        .get("/users?role=requester")
        .then((res) => setRequesters(res))
        .catch(() => setRequesters([]));
    }
  }, [user]);

  const statusLabels = {
    0: "Draft",
    1: "Assigned",
    2: "In Progress",
    3: "Submitted",
    4: "Needs Modification",
    5: "Approved",
    6: "Rejected",
  };

  const statusColors = {
    0: "default",
    1: "info",
    2: "warning",
    3: "primary",
    4: "error",
    5: "success",
    6: "error",
  };

  const isRequester = invoice && user?.id === invoice?.requester_id;
  const isSupervisor =
    invoice && (user?.id === invoice?.supervisor_id || user?.role === 2);

  /* -------------------------------------------------------- */
  /* Requester Actions */
  /* -------------------------------------------------------- */
  const requesterStart = async () => {
    setSaving(true);
    try {
      await axiosClient.post(`/invoices/${invoice.id}/start`);
      await fetchInvoice();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const requesterSubmit = () => {
    setActionType("submit");
    setModalNote("");
    setModalOpen(true);
  };

  const submitWork = async () => {
    setSaving(true);
    try {
      await axiosClient.post(`/invoices/${invoice.id}/submit`, {
        note: modalNote,
      });
      await fetchInvoice();
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  /* -------------------------------------------------------- */
  /* Supervisor Actions */
  /* -------------------------------------------------------- */
  const supervisorAction = (type) => {
    setActionType(type);
    setModalNote("");
    setModalOpen(true);
  };

  const sendSupervisorStatus = async () => {
    setSaving(true);

    let newStatus = null;
    if (actionType === "approve") newStatus = 5;
    if (actionType === "reject") newStatus = 6;
    if (actionType === "modify") newStatus = 4;

    try {
      await axiosClient.post(`/invoices/${invoice.id}/status`, {
        status: newStatus,
        status_notes: modalNote || null,
      });
      await fetchInvoice();
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  /* -------------------------------------------------------- */
  /* Edit Form Handling */
  /* -------------------------------------------------------- */

  const startEditing = () => {
    setEditForm({
      invoice_date: invoice.invoice_date,
      invoice_id: invoice.invoice_id || "",
      invoice_description: invoice.invoice_description || "",
      amount: invoice.amount,
      notes: invoice.notes || "",
      customer_id: invoice.customer_id || "",
      requester_id: invoice.requester_id,
      currency: invoice.currency,
    });
    setEditFiles([]);
    setEditing(true);
  };

  const handleEditChange = (e) => {
    setEditForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e?.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(editForm).forEach(([k, v]) => fd.append(k, v ?? ""));
      fd.append("amount", parseFloat(editForm.amount));

      editFiles.forEach((file) => fd.append("files[]", file));

      await axiosClient.post(`/invoices/${invoice.id}/edit`, fd);

      setEditing(false);
      await fetchInvoice();
    } catch (err) {
      console.error("Edit save error:", err);
    } finally {
      setSaving(false);
    }
  };

  /* -------------------------------------------------------- */

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );

  if (!invoice) return <Typography>No invoice found.</Typography>;

  return (
    <>
      {/* ============================================================= */}
      {/* INVOICE DETAILS */}
      {/* ============================================================= */}
      <Grid container justifyContent="center" spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={10}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight={700}>
              Task #{invoice.id}
            </Typography>

            <Chip
              label={statusLabels[invoice.status]}
              color={statusColors[invoice.status]}
              sx={{ mt: 2, mb: 2 }}
            />

            <Divider sx={{ my: 2 }} />

            <Typography>
              <strong>Invoice Date:</strong> {invoice.invoice_date}
            </Typography>
            <Typography>
              <strong>Amount:</strong> {invoice.amount} {invoice.currency}
            </Typography>
            <Typography>
              <strong>Requester:</strong> {invoice.requester?.name}
            </Typography>
            <Typography>
              <strong>Supervisor:</strong> {invoice.supervisor?.name}
            </Typography>
            <Typography>
              <strong>Description:</strong> {invoice.invoice_description}
            </Typography>
            {invoice.notes && (
              <Typography sx={{ mt: 1 }}>
                <strong>Internal Notes:</strong> {invoice.notes}
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

            {/* EDIT BUTTON */}
            {(isSupervisor || isRequester) && (
              <Box sx={{ mt: 3 }}>
                <Button variant="contained" onClick={startEditing}>
                  Edit Task
                </Button>
              </Box>
            )}

            {/* REQUESTER ACTIONS */}
            {isRequester && (
              <Box sx={{ mt: 3, display: "flex", gap: 1 }}>
                {invoice.status === 1 && (
                  <Button variant="contained" onClick={requesterStart}>
                    Start Work
                  </Button>
                )}

                {invoice.status === 2 && (
                  <Button variant="contained" onClick={requesterSubmit}>
                    Submit for Review
                  </Button>
                )}
              </Box>
            )}

            {/* SUPERVISOR ACTIONS */}
            {isSupervisor && invoice.status === 3 && (
              <Box sx={{ mt: 3, display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => supervisorAction("approve")}
                >
                  Approve
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => supervisorAction("reject")}
                >
                  Reject
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => supervisorAction("modify")}
                >
                  Needs Modification
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* ============================================================= */}
        {/* EDIT FORM */}
        {/* ============================================================= */}
        {editing && (
          <Grid item xs={12} md={10}>
            <Paper
              sx={{
                mt: 3,
                p: 3,
                borderRadius: 3,
                backgroundColor: "#1f242d",
              }}
            >
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                Edit Task
              </Typography>

              <Box component="form" noValidate onSubmit={handleEditSubmit}>
                <Grid container spacing={2}>
                  {/* Invoice Date */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      type="date"
                      label="Invoice Date"
                      name="invoice_date"
                      value={editForm.invoice_date}
                      onChange={handleEditChange}
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
                      value={editForm.amount}
                      onChange={handleEditChange}
                      inputProps={{ min: 0, step: "0.01" }}
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
                      value={editForm.currency}
                      onChange={handleEditChange}
                    >
                      <MenuItem value="USD">USD</MenuItem>
                      <MenuItem value="IQD">IQD</MenuItem>
                      <MenuItem value="AED">AED</MenuItem>
                    </TextField>
                  </Grid>

                  {/* Requester (Supervisor only) */}
                  {isSupervisor && (
                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        fullWidth
                        label="Assign Requester"
                        name="requester_id"
                        value={editForm.requester_id}
                        onChange={handleEditChange}
                      >
                        {requesters.map((req) => (
                          <MenuItem key={req.id} value={req.id}>
                            {req.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  )}

                  {/* Invoice ID */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Invoice ID"
                      name="invoice_id"
                      value={editForm.invoice_id}
                      onChange={handleEditChange}
                    />
                  </Grid>

                  {/* Customer ID */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Customer ID"
                      name="customer_id"
                      value={editForm.customer_id}
                      onChange={handleEditChange}
                    />
                  </Grid>

                  {/* Description */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      name="invoice_description"
                      value={editForm.invoice_description}
                      onChange={handleEditChange}
                      multiline
                      rows={2}
                    />
                  </Grid>

                  {/* Notes */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Internal Notes"
                      name="notes"
                      value={editForm.notes}
                      onChange={handleEditChange}
                      multiline
                      rows={2}
                    />
                  </Grid>

                  {/* File Upload */}
                  <Grid item xs={12} sm={6}>
                    <Box
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragActive(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        setDragActive(false);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragActive(false);
                        const dropped = Array.from(e.dataTransfer.files);
                        setEditFiles((prev) => [...prev, ...dropped]);
                      }}
                      onClick={() => editFileInput.current.click()}
                      sx={{
                        border: "2px dashed",
                        borderColor: dragActive ? "primary.main" : "grey.500",
                        p: 2.5,
                        borderRadius: 2,
                        textAlign: "center",
                        cursor: "pointer",
                        transition: ".2s",
                      }}
                    >
                      <Typography sx={{ fontWeight: 600 }}>
                        Click or drag files to upload
                      </Typography>
                      <input
                        ref={editFileInput}
                        type="file"
                        multiple
                        hidden
                        onChange={(e) =>
                          setEditFiles((prev) => [
                            ...prev,
                            ...Array.from(e.target.files),
                          ])
                        }
                      />
                    </Box>

                    {editFiles.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        {editFiles.map((f, i) => (
                          <Typography
                            key={i}
                            variant="body2"
                            sx={{ opacity: 0.8 }}
                          >
                            • {f.name}
                          </Typography>
                        ))}
                      </Box>
                    )}
                  </Grid>

                  {/* Save + Cancel */}
                  <Grid item xs={12} sx={{ mt: 2, display: "flex", gap: 2 }}>
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={handleEditSubmit}
                      disabled={saving}
                      sx={{ fontWeight: 700, px: 4 }}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>

                    <Button
                      variant="outlined"
                      onClick={() => setEditing(false)}
                      sx={{ px: 4 }}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        )}

        {/* ============================================================= */}
        {/* AUDIT LOG */}
        {/* ============================================================= */}
        <Grid item xs={12} md={10}>
          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Progress Log
            </Typography>

            {invoice.audits?.length === 0 && (
              <Typography color="text.secondary">
                No changes recorded yet.
              </Typography>
            )}

            {invoice.audits?.length > 0 && (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>When</TableCell>
                      <TableCell>Changed By</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Notes</TableCell>
                      <TableCell>Changes</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {invoice.audits
                      .filter((a) => a.to_status !== 1)
                      .map((audit) => (
                        <TableRow key={audit.id}>
                          <TableCell>
                            {new Date(audit.created_at).toLocaleString()}
                          </TableCell>

                          <TableCell>{audit.user?.name || "System"}</TableCell>

                          <TableCell>
                            <Chip
                              label={
                                audit.to_status !== null
                                  ? statusLabels[audit.to_status]
                                  : "Updated"
                              }
                              color={
                                audit.to_status !== null
                                  ? statusColors[audit.to_status]
                                  : "default"
                              }
                              size="small"
                            />
                          </TableCell>

                          <TableCell>
                            {audit.note || <em>No notes</em>}
                          </TableCell>

                          <TableCell sx={{ maxWidth: 300 }}>
                            {audit.changes ? (
                              Object.entries(audit.changes).map(
                                ([field, diff], i) => (
                                  <Typography
                                    key={i}
                                    variant="body2"
                                    sx={{ mb: 0.5 }}
                                  >
                                    <strong>{field}</strong>:{" "}
                                    <span style={{ color: "#888" }}>
                                      {diff.from || "∅"}
                                    </span>{" "}
                                    →{" "}
                                    <strong>
                                      {diff.to?.toString() || "∅"}
                                    </strong>
                                  </Typography>
                                )
                              )
                            ) : (
                              <em>No field changes</em>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* ============================================================= */}
      {/* MODAL */}
      {/* ============================================================= */}
      <Dialog
        open={modalOpen}
        onClose={() => !saving && setModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {actionType === "submit" && "Submit Work for Review"}
          {actionType === "approve" && "Approve Task"}
          {actionType === "reject" && "Reject Task"}
          {actionType === "modify" && "Request Modification"}
        </DialogTitle>

        <DialogContent>
          <TextField
            label="Notes"
            multiline
            rows={4}
            fullWidth
            value={modalNote}
            onChange={(e) => setModalNote(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setModalOpen(false)} disabled={saving}>
            Cancel
          </Button>

          {actionType === "submit" && (
            <Button variant="contained" onClick={submitWork} disabled={saving}>
              {saving ? "Submitting..." : "Submit"}
            </Button>
          )}

          {["approve", "reject", "modify"].includes(actionType) && (
            <Button
              variant="contained"
              onClick={sendSupervisorStatus}
              disabled={saving}
            >
              {saving ? "Saving..." : "Confirm"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

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
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  MenuItem,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { axiosClient } from "../utilities/axiosConfig";

export default function InvoiceDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [editSaving, setEditSaving] = useState(false);

  const [editForm, setEditForm] = useState({
    invoice_date: "",
    invoice_id: "",
    invoice_description: "",
    amount: "",
    notes: "",
    requester_id: "",
    currency: "USD",
    company_name: "",
  });

  const [requesters, setRequesters] = useState([]);
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalNote, setModalNote] = useState("");
  const [actionType, setActionType] = useState(null);
  const [saving, setSaving] = useState(false);

  /** Fetch invoice */
  const fetchInvoice = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get(`/invoices/${id}`);
      setInvoice(res);

      setEditForm({
        invoice_date: res.invoice_date || "",
        invoice_id: res.invoice_id || "",
        invoice_description: res.invoice_description || "",
        amount: res.amount || "",
        notes: res.notes || "",
        requester_id: res.requester_id || "",
        currency: res.currency || "USD",
        company_name: res.data?.company_name || "",
      });
    } catch (error) {
      console.error("Fetch invoice:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  /** Load requesters */
  useEffect(() => {
    axiosClient
      .get("/users?role=requester")
      .then((res) => setRequesters(res))
      .catch(() => setRequesters([]));
  }, []);

  /** Status maps */
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

  /** Role detection (fix integer/string mismatch) */
  const isRequester = Number(user?.role) === 1;

  const isSupervisor = Number(user?.role) === 2;

  /** Requester Start */
  const requesterStart = async () => {
    setSaving(true);
    try {
      const resp = await axiosClient.post(`/invoices/${invoice.id}/start`);
      console.log("Start response:", resp);
      await fetchInvoice();
    } catch (error) {
      console.log(error);
      // console.error(error);
    } finally {
      setSaving(false);
    }
  };

  /** Requester Submit */
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

  /** Supervisor actions */
  const supervisorAction = (type) => {
    setActionType(type);
    setModalNote("");
    setModalOpen(true);
  };

  const sendSupervisorStatus = async () => {
    setSaving(true);

    const map = {
      approve: 5,
      reject: 6,
      modify: 4,
    };

    try {
      await axiosClient.post(`/invoices/${invoice.id}/status`, {
        status: map[actionType],
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

  /** Edit Form Handlers */
  const handleEditChange = (e) => {
    setEditForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /** File Upload */
  const handleFileSelect = (e) => {
    setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
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
    setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
  };

  /** Submit Edit (FIXED PUT override, FIXED content-type) */
  const submitEdit = async () => {
    setEditSaving(true);

    try {
      const fd = new FormData();

      fd.append("invoice_date", editForm.invoice_date);
      fd.append("invoice_id", editForm.invoice_id);
      fd.append("invoice_description", editForm.invoice_description);
      fd.append("amount", editForm.amount);
      fd.append("notes", editForm.notes);
      fd.append("currency", editForm.currency);

      fd.append(
        "requester_id",
        isSupervisor ? editForm.requester_id : invoice.requester_id
      );

      fd.append("data[company_name]", editForm.company_name || "");

      files.forEach((file) => fd.append("files[]", file));

      // REQUIRED FIX
      // fd.append("_method", "PUT");

      await axiosClient.post(`/invoices/${invoice.id}/edit`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setEditOpen(false);
      await fetchInvoice();
    } catch (err) {
      console.error("Edit save error:", err);
    } finally {
      setEditSaving(false);
    }
  };

  /** Loading */
  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );

  if (!invoice) return <Typography>No invoice found.</Typography>;

  /** Filter audits */
  const filteredAudits = invoice.audits?.filter(
    (a) => Number(a.to_status) !== 1
  );

  return (
    <>
      {/* MAIN PANEL */}
      <Grid container justifyContent="center" spacing={3}>
        <Grid item xs={12} md={10}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight={700}>
              Task #{invoice.id}
            </Typography>

            <Chip
              label={statusLabels[invoice.status]}
              color={statusColors[invoice.status]}
              sx={{ mt: 1, mb: 2 }}
            />

            <Divider sx={{ my: 2 }} />

            <Typography>
              <strong>Invoice ID:</strong> {invoice.invoice_id}
            </Typography>
            <Typography>
              <strong>Date:</strong> {invoice.invoice_date}
            </Typography>
            <Typography>
              <strong>Amount:</strong> {invoice.amount} {invoice.currency}
            </Typography>
            <Typography>
              <strong>Company Name:</strong> {invoice.data?.company_name ?? "—"}
            </Typography>

            <Typography>
              <strong>Requester:</strong> {invoice.requester?.name}
            </Typography>
            <Typography>
              <strong>Supervisor:</strong> {invoice.supervisor?.name}
            </Typography>

            {invoice.notes && (
              <Typography sx={{ mt: 1 }}>
                <strong>Notes:</strong> {invoice.notes}
              </Typography>
            )}

            {invoice.status_notes && (
              <Typography sx={{ mt: 1 }}>
                <strong>Status Notes:</strong> {invoice.status_notes}
              </Typography>
            )}

            {/* Existing Files */}
            {invoice.files?.length > 0 && (
              <>
                <Typography variant="h6" sx={{ mt: 3 }}>
                  Files
                </Typography>
                {invoice.files.map((f) => (
                  <Box key={f.id} sx={{ mt: 1 }}>
                    <a href={f.url} target="_blank" rel="noreferrer">
                      {f.original_name}
                    </a>
                  </Box>
                ))}
              </>
            )}
            <Box sx={{ mt: 3, display: "flex", gap: 1, alignItems: "center" }}>
              {/* Edit */}
              {(isSupervisor || (isRequester && invoice.status < 3)) && (
                <Button
                  sx={{ mt: 2 }}
                  variant="contained"
                  onClick={() => setEditOpen(true)}
                >
                  Edit Task
                </Button>
              )}

              {/* Requester actions */}
              {isRequester && invoice.status === 1 && (
                <Button
                  sx={{ mt: 2 }}
                  variant="contained"
                  onClick={requesterStart}
                >
                  Start Work
                </Button>
              )}

              {isRequester && invoice.status === 2 && (
                <Button
                  sx={{ mt: 2 }}
                  variant="contained"
                  onClick={requesterSubmit}
                >
                  Submit for Review
                </Button>
              )}
            </Box>

            {/* Supervisor buttons */}
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

        {/* AUDIT LOG */}
        <Grid item xs={12} md={10}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              Progress Log
            </Typography>

            {(!filteredAudits || filteredAudits.length === 0) && (
              <Typography color="text.secondary">
                No changes recorded yet.
              </Typography>
            )}

            {filteredAudits?.length > 0 && (
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
                    {filteredAudits.map((audit) => (
                      <TableRow key={audit.id}>
                        <TableCell>
                          {new Date(audit.created_at).toLocaleString()}
                        </TableCell>

                        <TableCell>{audit.user?.name ?? "System"}</TableCell>

                        <TableCell>
                          <Chip
                            label={statusLabels[audit.to_status] || "Updated"}
                            color={statusColors[audit.to_status] || "default"}
                            size="small"
                          />
                        </TableCell>

                        <TableCell>{audit.note || <em>No notes</em>}</TableCell>

                        <TableCell>
                          {audit.changes ? (
                            Object.entries(audit.changes).map(
                              ([field, diff], i) => (
                                <Typography key={i} variant="body2">
                                  <strong>{field}</strong>: {diff.from ?? "∅"} →{" "}
                                  {diff.to ?? "∅"}
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

      {/* ======================= EDIT MODAL ======================= */}
      <Dialog
        open={editOpen}
        onClose={() => !editSaving && setEditOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {/* Date */}
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                type="date"
                name="invoice_date"
                label="Invoice Date"
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
                type="number"
                name="amount"
                label="Amount"
                value={editForm.amount}
                inputProps={{ step: "0.01" }}
                onChange={handleEditChange}
              />
            </Grid>

            {/* Currency */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                name="currency"
                label="Currency"
                value={editForm.currency}
                onChange={handleEditChange}
              >
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="IQD">IQD</MenuItem>
                <MenuItem value="AED">AED</MenuItem>
              </TextField>
            </Grid>

            {/* Requester (Supervisor Only) */}
            {isSupervisor && (
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  name="requester_id"
                  label="Assign Requester"
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="invoice_id"
                label="Invoice ID (Optional)"
                value={editForm.invoice_id}
                onChange={handleEditChange}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="invoice_description"
                label="Description"
                multiline
                rows={2}
                value={editForm.invoice_description}
                onChange={handleEditChange}
              />
            </Grid>

            {/* Company Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="company_name"
                label="Company Name (Optional)"
                value={editForm.company_name}
                onChange={handleEditChange}
              />
            </Grid>

            {/* Notes */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="notes"
                label="Internal Notes"
                multiline
                rows={2}
                value={editForm.notes}
                onChange={handleEditChange}
              />
            </Grid>

            {/* File Upload */}
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
                <Typography fontWeight={600}>
                  Click or drag files here
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add more attachments (optional)
                </Typography>

                <input
                  ref={inputRef}
                  type="file"
                  multiple
                  hidden
                  onChange={handleFileSelect}
                />
              </Box>

              {/* File preview + remove */}
              {files.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 1, fontWeight: 600 }}
                  >
                    Selected Files:
                  </Typography>

                  {files.map((file, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 0.5,
                        background: "rgba(255,255,255,0.05)",
                        p: 1,
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2">{file.name}</Typography>

                      <Button
                        size="small"
                        color="error"
                        sx={{ minWidth: 40 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setFiles((prev) => prev.filter((_, i) => i !== idx));
                        }}
                      >
                        ✕
                      </Button>
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEditOpen(false)} disabled={editSaving}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={submitEdit}
            disabled={editSaving}
          >
            {editSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ======================= REVIEW MODAL ======================= */}
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

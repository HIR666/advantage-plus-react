import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography,
  CircularProgress,
  Box,
  Chip,
} from "@mui/material";
import { axiosClient } from "../utilities/axiosConfig";
import { useNavigate } from "react-router-dom";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get("/invoices", {
        params: { page: page + 1, per_page: rowsPerPage },
      })
      .then((res) => {
        setInvoices(res.data);
        setTotal(res.total);
      })
      .finally(() => setLoading(false));
  }, [page, rowsPerPage]);

  const handleChangePage = (e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

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

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        Tasks (Invoices)
      </Typography>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={250}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Invoice ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Currency</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Requester</TableCell>
                  <TableCell>Supervisor</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {invoices.map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate(`/d/invoices/${row.id}`)}
                  >
                    <TableCell>{row.id}</TableCell>

                    <TableCell>{row.invoice_id ?? "-"}</TableCell>
                    <TableCell>{row.invoice_date}</TableCell>

                    <TableCell align="right">{row.amount}</TableCell>

                    <TableCell>{row.currency || "-"}</TableCell>

                    <TableCell>
                      <Chip
                        label={statusLabels[row.status]}
                        color={statusColors[row.status]}
                        size="small"
                      />
                    </TableCell>

                    <TableCell>{row.requester?.name ?? <em>-</em>}</TableCell>
                    <TableCell>{row.supervisor?.name ?? <em>-</em>}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </>
      )}
    </Paper>
  );
}

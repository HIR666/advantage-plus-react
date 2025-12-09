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
        console.log("Invoices response:", res);
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

  const getStatusLabel = (status) => {
    return ["Pending", "Finished", "Needs Modification", "Cancelled"][status];
  };

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

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        Invoices
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
            <Table sx={{ minWidth: 650 }} aria-label="Invoices Table">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Created By</TableCell>
                  <TableCell>Invoice ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Customer ID</TableCell>
                  <TableCell>Notes</TableCell>
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

                    {/* 🔥 Created By */}
                    <TableCell>
                      {row.requester?.name ?? <em>Unknown</em>}
                    </TableCell>

                    <TableCell>{row.invoice_id}</TableCell>
                    <TableCell>{row.invoice_date}</TableCell>

                    <TableCell align="right">{row.amount}</TableCell>

                    {/* 🔥 Status Chip */}
                    <TableCell>
                      <Chip
                        label={getStatusLabel(row.status)}
                        color={getStatusColor(row.status)}
                        size="small"
                      />
                    </TableCell>

                    <TableCell>{row.customer_id ?? "-"}</TableCell>
                    <TableCell>{row.notes}</TableCell>
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

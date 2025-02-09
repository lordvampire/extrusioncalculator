import React, { useEffect, useState } from "react";
import {
  getOberflaechen,
  createOberflaeche,
  deleteOberflaeche,
  getAnwendungsbereiche,
  createAnwendungsbereich,
  deleteAnwendungsbereich,
} from "../services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Container,
  Grid,
  Card,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const OberflaechenUndAnwendungen = () => {
  const [oberflaechen, setOberflaechen] = useState([]);
  const [anwendungsbereiche, setAnwendungsbereiche] = useState([]);
  const [openOberflaeche, setOpenOberflaeche] = useState(false);
  const [openAnwendungsbereich, setOpenAnwendungsbereich] = useState(false);
  const [newOberflaeche, setNewOberflaeche] = useState({ bezeichnung: "", reduktionsfaktor: "" });
  const [newAnwendungsbereich, setNewAnwendungsbereich] = useState({ bezeichnung: "", reduktionsfaktor: "", schrottlaenge: "" });

  useEffect(() => {
    getOberflaechen().then(setOberflaechen);
    getAnwendungsbereiche().then(setAnwendungsbereiche);
  }, []);

  const handleCreateOberflaeche = async () => {
    const createdEntry = await createOberflaeche(newOberflaeche);
    setOberflaechen((prev) => [...prev, createdEntry]);
    setNewOberflaeche({ bezeichnung: "", reduktionsfaktor: "" });
    setOpenOberflaeche(false);
  };

  const handleCreateAnwendungsbereich = async () => {
    const createdEntry = await createAnwendungsbereich(newAnwendungsbereich);
    setAnwendungsbereiche((prev) => [...prev, createdEntry]);
    setNewAnwendungsbereich({ bezeichnung: "", reduktionsfaktor: "", schrottlaenge: "" });
    setOpenAnwendungsbereich(false);
  };

  return (
    <Container>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={10}>
          <Card elevation={3} sx={{ padding: 3, marginTop: 3 }}>
            <Typography variant="h4" gutterBottom>
              Oberflächenanforderungen & Anwendungsbereiche
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenOberflaeche(true)}>
              Neue Oberflächenanforderung
            </Button>
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Bezeichnung</TableCell>
                    <TableCell>Reduktionsfaktor</TableCell>
                    <TableCell>Aktionen</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {oberflaechen.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell>{o.bezeichnung}</TableCell>
                      <TableCell>{o.reduktionsfaktor}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => deleteOberflaeche(o.id)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
          <Card elevation={3} sx={{ padding: 3, marginTop: 3 }}>
            <Typography variant="h4" gutterBottom>
              Anwendungsbereiche
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenAnwendungsbereich(true)}>
              Neuen Anwendungsbereich
            </Button>
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Bezeichnung</TableCell>
                    <TableCell>Reduktionsfaktor</TableCell>
                    <TableCell>Schrottlänge (m)</TableCell>
                    <TableCell>Aktionen</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {anwendungsbereiche.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell>{o.bezeichnung}</TableCell>
                      <TableCell>{o.reduktionsfaktor}</TableCell>
                      <TableCell>{o.schrottlaenge}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => deleteAnwendungsbereich(o.id)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog für neue Oberflächenanforderung */}
      <Dialog open={openOberflaeche} onClose={() => setOpenOberflaeche(false)}>
        <DialogTitle>Neue Oberflächenanforderung</DialogTitle>
        <DialogContent>
          {Object.keys(newOberflaeche).map((key) => (
            <TextField
              key={key}
              label={key.replace("_", " ").toUpperCase()}
              fullWidth
              margin="dense"
              value={newOberflaeche[key]}
              onChange={(e) => setNewOberflaeche({ ...newOberflaeche, [key]: e.target.value })}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenOberflaeche(false)}>Abbrechen</Button>
          <Button variant="contained" onClick={handleCreateOberflaeche}>
            Hinzufügen
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog für neuen Anwendungsbereich */}
      <Dialog open={openAnwendungsbereich} onClose={() => setOpenAnwendungsbereich(false)}>
        <DialogTitle>Neuer Anwendungsbereich</DialogTitle>
        <DialogContent>
          {Object.keys(newAnwendungsbereich).map((key) => (
            <TextField
              key={key}
              label={key.replace("_", " ").toUpperCase()}
              fullWidth
              margin="dense"
              value={newAnwendungsbereich[key]}
              onChange={(e) => setNewAnwendungsbereich({ ...newAnwendungsbereich, [key]: e.target.value })}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAnwendungsbereich(false)}>Abbrechen</Button>
          <Button variant="contained" onClick={handleCreateAnwendungsbereich}>
            Hinzufügen
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OberflaechenUndAnwendungen;
